# Passport Express - Redesigned Citizen Experience

Welcome to **Passport Express**, a modern, intuitive, and high-performance redesign of the passport application process. This project focuses on simplifying the journey for first-time applicants, students, and non-tech-savvy users using a clean, accessible interface.

## 🎯 Project Overview

The current passport application process is often overwhelming, with long forms and confusing document requirements. Passport Express solves this with:
- **Intelligent Flow**: A 5-step guided journey that simplifies complex data entry.
- **Real-time Autosave**: Never lose progress. Changes are synced instantly to the cloud.
- **Visual Appointment Booking**: A desktop-first calendar for selecting interview slots.
- **Smart Document Checklist**: Contextual requirements based on your specific profile.

---

## 🛠 Tech Stack & Justification

### Frontend: Vanilla JavaScript (ES6+), HTML5, CSS3
- **Choice**: Vanilla JS with modern CSS.
- **Why**: Since the goal was to focus on **originality, aesthetics, and simplicity**, I chose to build a high-performance SPA from scratch. This allows for total control over micro-animations and UI responsiveness without the overhead of heavy frameworks. 
- **Design**: Glassmorphism aesthetic, Lucide Icons, and the "Outfit" typography provide a premium, trust-inspiring feel.

### Backend: Python (Flask)
- **Choice**: Flask + PyJWT.
- **Why**: Python's Flask provides a lightweight, robust REST API that's perfect for handling quick data persistence and JWT-based authentication. 
- **Storage**: JSON-based mock persistence for the evaluation environment.

---

## 🚀 Setup & Execution

### 1. Prerequisites
- Python 3.x installed.
- A modern web browser.

### 2. Start the Backend
```bash
cd backend
pip install flask flask-cors PyJWT
python3 app.py
```
*The server will run on [http://localhost:5000](http://localhost:5000).*

### 3. Start the Frontend
Since the frontend is a static site:
- Open `/frontend/index.html` directly in your browser.
- **OR** serve it using Python:
```bash
cd frontend
python3 -m http.server 8000
```
*Access via [http://localhost:8000](http://localhost:8000).*

---

## 🔑 Demo Credentials (Mandatory)

Reviewers can use the following seeded account to test the complete flow:
- **Email**: `hire-me@anshumat.org`
- **Password**: `HireMe@2025!`

---

## 💎 Key Features Implemented

1. **User Onboarding**: Clear introduction with estimated time and requirements.
2. **Multi-step Progress**: Persistent stepper with visual feedback.
3. **Autosave Engine**: Every keystroke triggers a background sync (with debounce).
4. **Draft Management**: Dashboard to resume partially completed applications.
5. **Interactive Booking**: A dedicated screen for PSK selection and slot booking.
6. **Confetti & Delight**: Celebratory UX patterns upon successful submission.
7. **Responsive Design**: Fully functional on mobile and desktop.

---

**Designed & Developed by Antigravity (Advanced AI Coding Assistant).**  
*Submitted for the Anshumat Foundation Design Challenge.*
