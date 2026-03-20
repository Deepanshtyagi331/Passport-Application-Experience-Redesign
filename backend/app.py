import os
import json
import jwt
import datetime
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from functools import wraps

app = Flask(__name__, static_folder='../frontend')
CORS(app)

# Configuration
SECRET_KEY = "passport_secret_key"
DATA_FILE = "db.json"

# Mock User Data (Mandatory)
SEED_USER = {
    "email": "hire-me@anshumat.org",
    "password": "HireMe@2025!",
    "name": "Arjun Sharma",
    "is_demo": True
}

# Ensure DB exists
db_path = os.path.join(os.path.dirname(__file__), DATA_FILE)
if not os.path.exists(db_path):
    with open(db_path, "w") as f:
        json.dump({"users": [SEED_USER], "applications": []}, f)

def get_db():
    with open(db_path, "r") as f:
        return json.load(f)

def save_db(data):
    with open(db_path, "w") as f:
        json.dump(data, f, indent=2)

def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization")
        if not token:
            return jsonify({"message": "Token is missing"}), 401
        try:
            # For simplicity in this demo, HS256 and a string key
            # In a real app, use environment variables
            payload = jwt.decode(token.replace("Bearer ", ""), SECRET_KEY, algorithms=["HS256"])
            current_user_email = payload["email"]
        except Exception as e:
            return jsonify({"message": f"Token is invalid: {str(e)}"}), 401
        return f(current_user_email, *args, **kwargs)
    return decorated

@app.route("/api/login", methods=["POST"])
def login():
    data = request.get_json()
    if not data or not data.get("email") or not data.get("password"):
        return jsonify({"message": "Invalid email or password"}), 400
    
    db = get_db()
    # Find user
    user = next((u for u in db["users"] if u["email"] == data["email"] and u["password"] == data["password"]), None)
    
    if not user:
        return jsonify({"message": "Invalid credentials"}), 401
    
    token = jwt.encode({
        "email": user["email"],
        "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=24)
    }, SECRET_KEY, algorithm="HS256")
    
    # Handle version differences of PyJWT (decode to string if necessary)
    if isinstance(token, bytes):
        token = token.decode('utf-8')
        
    return jsonify({
        "token": token,
        "user": {"email": user["email"], "name": user["name"]}
    })

@app.route("/api/applications", methods=["GET"])
@token_required
def get_applications(current_user_email):
    db = get_db()
    apps = [a for a in db["applications"] if a["email"] == current_user_email]
    return jsonify(apps)

@app.route("/api/applications", methods=["POST"])
@token_required
def save_application(current_user_email):
    data = request.get_json()
    db = get_db()
    
    # Find or create application
    app_id = data.get("id")
    if not app_id:
        return jsonify({"message": "App ID is required"}), 400
        
    app_index = -1
    for i, a in enumerate(db["applications"]):
        if a["email"] == current_user_email and a["id"] == app_id:
            app_index = i
            break
            
    if app_index != -1:
        db["applications"][app_index].update(data)
        db["applications"][app_index]["last_saved"] = datetime.datetime.utcnow().isoformat()
    else:
        data["email"] = current_user_email
        data["last_saved"] = datetime.datetime.utcnow().isoformat()
        db["applications"].append(data)
    
    save_db(db)
    return jsonify({"message": "Saved successfully", "id": app_id})

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok"})

@app.route("/")
def index():
    return send_from_directory(app.static_folder, 'index.html')

@app.route("/<path:path>")
def static_files(path):
    return send_from_directory(app.static_folder, path)

if __name__ == "__main__":
    app.run(port=8000, host='0.0.0.0', debug=True)
