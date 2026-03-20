/**
 * Passport Express - App Logic
 * Real-time form saving, intuitive navigation, and smooth transitions.
 */

const API_BASE = '/api';

// --- State Management ---
const state = {
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user')) || null,
    applications: [],
    currentApp: null,
    activeStep: 1,
    isSaving: false,
    lastSaved: null
};

// --- Router ---
const router = {
    routes: {
        '/': LandingPage,
        '/login': LoginPage,
        '/dashboard': DashboardPage,
        '/onboarding': OnboardingPage,
        '/apply': FormPage,
        '/document-upload': DocumentUploadPage,
        '/appointment': AppointmentPage,
        '/confirmation': ConfirmationPage
    },
    
    init() {
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    },

    navigate(path) {
        window.location.hash = path;
    },

    handleRoute() {
        const hash = window.location.hash.slice(1) || '/';
        const [path, ...params] = hash.split('/').filter(Boolean);
        const route = '/' + (path || '');
        
        const component = this.routes[route] || LandingPage;
        
        // Auth Guard
        const publicRoutes = ['/', '/login'];
        if (!state.token && !publicRoutes.includes(route)) {
            this.navigate('/login');
            return;
        }

        render(component, params);
        window.scrollTo(0, 0);
    }
};

// --- App Shell / Navigation ---
function updateNav() {
    const mainNav = document.getElementById('main-nav');
    const authNav = document.getElementById('auth-nav');

    if (state.token) {
        mainNav.innerHTML = `
            <a href="#/dashboard" class="btn btn-ghost">Dashboard</a>
            <a href="#/onboarding" class="btn btn-ghost">Apply New</a>
        `;
        authNav.innerHTML = `
            <span class="user-greeting">Hi, ${state.user.name}</span>
            <button class="btn btn-secondary" onclick="logout()">Logout</button>
        `;
    } else {
        mainNav.innerHTML = `
            <a href="/" class="btn btn-ghost">How it Works</a>
            <a href="/" class="btn btn-ghost">Checklist</a>
        `;
        authNav.innerHTML = `
            <a href="#/login" class="btn btn-primary">Login / Sign up</a>
        `;
    }
    lucide.createIcons();
}

function logout() {
    state.token = null;
    state.user = null;
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.navigate('/');
    updateNav();
}

// --- Components ---

function LandingPage() {
    return `
        <section class="hero animate-fade-in">
            <div class="container">
                <h1>Global Travel Starts with <br><span class="express">Seamless Identity.</span></h1>
                <p>The smartest, fastest, and most intuitive way to apply for your Indian Passport. Designed for the modern citizen.</p>
                <div class="btn-group" style="justify-content: center; margin-top: 2rem;">
                    <button class="btn btn-primary" onclick="router.navigate('/login')">Get Started Now <i data-lucide="arrow-right"></i></button>
                    <button class="btn btn-secondary">Learn More</button>
                </div>
            </div>
        </section>

        <section class="features container">
            <div class="grid grid-2-col" style="display:grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 1.5rem; margin-top: 4rem;">
                <div class="glass form-card" style="padding: 2rem;">
                    <div class="logo-icon" style="margin-bottom: 1rem;"><i data-lucide="zap"></i></div>
                    <h3>Fast-Track Forms</h3>
                    <p>Intelligent forms that remember your progress and validate details in real-time.</p>
                </div>
                <div class="glass form-card" style="padding: 2rem;">
                    <div class="logo-icon" style="margin-bottom: 1rem; background: linear-gradient(135deg, #10b981, #34d399);"><i data-lucide="calendar"></i></div>
                    <h3>Smart Appointments</h3>
                    <p>Visual calendar booking with real-time slot availability at your nearest PSK.</p>
                </div>
                <div class="glass form-card" style="padding: 2rem;">
                    <div class="logo-icon" style="margin-bottom: 1rem; background: linear-gradient(135deg, #f43f5e, #fb7185);"><i data-lucide="file-check"></i></div>
                    <h3>Clear Checklist</h3>
                    <p>No more document confusion. Get a personalized list tailored to your profile.</p>
                </div>
            </div>
        </section>
    `;
}

function LoginPage() {
    return `
        <div class="container" style="max-width: 450px; margin-top: 4rem;">
            <div class="glass form-card animate-fade-in">
                <center>
                    <div class="logo-icon" style="margin-bottom: 1.5rem;"><i data-lucide="user"></i></div>
                    <h2>Welcome Back</h2>
                    <p style="margin-bottom: 2rem;">Login to access your passport applications.</p>
                </center>
                
                <form id="login-form">
                    <div class="form-group">
                        <label for="email">Email Address</label>
                        <input type="email" id="email" class="form-control" placeholder="hire-me@anshumat.org" required>
                    </div>
                    <div class="form-group">
                        <label for="password">Password</label>
                        <input type="password" id="password" class="form-control" placeholder="HireMe@2025!" required>
                    </div>
                    <button type="submit" class="btn btn-primary" style="width: 100%; justify-content: center; margin-top: 1rem;">
                        Login <i data-lucide="log-in"></i>
                    </button>
                </form>
                
                <div style="margin-top: 2rem; text-align: center; font-size: 0.85rem; color: var(--text-muted);">
                    Dont have an account? <a href="#" style="color: var(--primary); font-weight: 600;">Sign up with Phone</a>
                </div>
            </div>
        </div>
    `;
}

function DashboardPage() {
    fetchApplications();
    return `
        <div class="container animate-fade-in">
            <div class="dashboard-grid">
                <aside class="sidebar-card">
                    <div class="glass dashboard-card" style="padding: 1.5rem;">
                        <div style="display: flex; align-items: center; gap: 1rem; margin-bottom: 2rem;">
                            <div style="width: 48px; height: 48px; border-radius: 50%; background: var(--primary-light); display: flex; align-items: center; justify-content: center; font-weight: 700; color: var(--primary);">AS</div>
                            <div>
                                <h4 style="margin: 0;">${state.user.name}</h4>
                                <span style="font-size: 0.75rem; color: var(--text-muted);">Verified Citizen</span>
                            </div>
                        </div>
                        <nav style="display: flex; flex-direction: column; gap: 0.5rem;">
                            <a href="#/dashboard" class="btn btn-primary" style="justify-content: flex-start; background: var(--primary-light); color: var(--primary);"><i data-lucide="layout"></i> Dashboard</a>
                            <a href="#" class="btn btn-ghost" style="justify-content: flex-start;"><i data-lucide="file-text"></i> My Documents</a>
                            <a href="#" class="btn btn-ghost" style="justify-content: flex-start;"><i data-lucide="bell"></i> Notifications</a>
                        </nav>
                    </div>
                </aside>
                
                <main>
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                        <div>
                            <h2>My Passport Applications</h2>
                            <p style="color: var(--text-muted);">Track and manage your requests.</p>
                        </div>
                        <button class="btn btn-primary" onclick="router.navigate('/onboarding')">
                            <i data-lucide="plus"></i> New Application
                        </button>
                    </div>

                    <div id="application-list" class="app-list">
                        <div class="loading-spinner"><div class="spinner"></div></div>
                    </div>
                </main>
            </div>
        </div>
    `;
}

function OnboardingPage() {
    return `
        <div class="container animate-fade-in">
            <div class="multi-step-container">
                <div class="glass form-card" style="padding: 3.5rem;">
                    <center>
                        <div class="logo-icon" style="margin-bottom: 1.5rem; width: 4rem; height: 4rem;"><i data-lucide="sparkles" style="width: 2rem; height: 2rem;"></i></div>
                        <h1>Start Your Journey</h1>
                        <p style="font-size: 1.1rem; color: var(--text-muted); margin-bottom: 3rem;">Ready to apply for your new passport? Let's get you prepared in under 10 minutes.</p>
                    </center>

                    <div class="grid grid-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 3rem;">
                        <div style="display: flex; gap: 1rem;">
                            <i data-lucide="clock" style="color: var(--primary);"></i>
                            <div>
                                <strong>10-15 Minutes</strong>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Quick and easy filling</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <i data-lucide="save" style="color: var(--primary);"></i>
                            <div>
                                <strong>Autosave on</strong>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Pick up where you left off</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <i data-lucide="file-check" style="color: var(--primary);"></i>
                            <div>
                                <strong>Smart Documents</strong>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Clear list of what's needed</p>
                            </div>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <i data-lucide="shield" style="color: var(--primary);"></i>
                            <div>
                                <strong>Secure Portal</strong>
                                <p style="font-size: 0.85rem; color: var(--text-muted);">Bank-grade data safety</p>
                            </div>
                        </div>
                    </div>

                    <div class="form-group" style="background: var(--bg-main); padding: 1.5rem; border-radius: var(--radius-md); border: 1px dashed var(--border);">
                        <label>Select Application Type</label>
                        <select id="app-type" class="form-control">
                            <option value="fresh">Fresh Passport Application</option>
                            <option value="reissue">Re-issue of Passport</option>
                        </select>
                    </div>

                    <button class="btn btn-primary" style="width: 100%; justify-content: center; height: 3.5rem; font-size: 1.1rem;" onclick="startNewApplication()">
                        Begin Application <i data-lucide="chevron-right"></i>
                    </button>
                </div>
            </div>
        </div>
    `;
}

function FormPage() {
    const app = state.currentApp;
    if (!app) { router.navigate('/dashboard'); return ''; }

    return `
        <div class="container animate-fade-in">
            <div class="multi-step-container">
                <div class="stepper">
                    <div class="step completed">
                        <div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div>
                        <span class="step-label">Type</span>
                    </div>
                    <div class="step active">
                        <div class="step-circle">2</div>
                        <span class="step-label">Personal</span>
                    </div>
                    <div class="step">
                        <div class="step-circle">3</div>
                        <span class="step-label">Family</span>
                    </div>
                    <div class="step">
                        <div class="step-circle">4</div>
                        <span class="step-label">Documents</span>
                    </div>
                    <div class="step">
                        <div class="step-circle">5</div>
                        <span class="step-label">Booking</span>
                    </div>
                </div>

                <div class="glass form-card">
                    <h2 style="margin-bottom: 2rem; display: flex; align-items: center; gap: 1rem;">
                        <i data-lucide="user-plus" style="color: var(--primary);"></i> Personal Details
                    </h2>
                    
                    <div id="application-form">
                        <div class="grid grid-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div class="form-group">
                                <label>Applicant's Given Name</label>
                                <input type="text" name="given_name" class="form-control" placeholder="Enter as per Aadhaar" value="${app.given_name || ''}">
                                <p style="font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem;">Includes first and middle name.</p>
                            </div>
                            <div class="form-group">
                                <label>Surname</label>
                                <input type="text" name="surname" class="form-control" placeholder="Optional" value="${app.surname || ''}">
                            </div>
                        </div>

                        <div class="grid grid-2-col" style="display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem;">
                            <div class="form-group">
                                <label>Date of Birth</label>
                                <input type="date" name="dob" class="form-control" value="${app.dob || ''}">
                            </div>
                            <div class="form-group">
                                <label>Gender</label>
                                <select name="gender" class="form-control">
                                    <option value="">Select Gender</option>
                                    <option value="male" ${app.gender === 'male' ? 'selected' : ''}>Male</option>
                                    <option value="female" ${app.gender === 'female' ? 'selected' : ''}>Female</option>
                                    <option value="transgender" ${app.gender === 'transgender' ? 'selected' : ''}>Transgender</option>
                                </select>
                            </div>
                        </div>

                        <div class="form-group">
                            <label>Place of Birth (Village/Town/City)</label>
                            <input type="text" name="pob" class="form-control" value="${app.pob || ''}">
                        </div>

                        <div class="form-group">
                            <label>Educational Qualification</label>
                            <select name="qualification" class="form-control">
                                <option value="graduate" ${app.qualification === 'graduate' ? 'selected' : ''}>Graduate</option>
                                <option value="10th" ${app.qualification === '10th' ? 'selected' : ''}>10th Pass or Higher</option>
                                <option value="7th" ${app.qualification === '7th' ? 'selected' : ''}>Below 7th Standard</option>
                            </select>
                        </div>
                    </div>

                    <div class="btn-group" style="justify-content: space-between; margin-top: 3rem; border-top: 1px solid var(--border); padding-top: 2rem;">
                        <button class="btn btn-secondary" onclick="router.navigate('/dashboard')">Save as Draft</button>
                        <button class="btn btn-primary" onclick="router.navigate('/document-upload')">Next: Document Upload <i data-lucide="chevron-right"></i></button>
                    </div>
                </div>
            </div>

            <div id="autosave-tag" class="autosave-indicator glass animate-fade-in" style="display: none;">
                <i data-lucide="cloud-check" style="color: var(--success); width: 16px;"></i>
                <span>Progress saved</span>
            </div>
        </div>
    `;
}

function DocumentUploadPage() {
    return `
        <div class="container animate-fade-in">
            <div class="multi-step-container">
                <div class="stepper">
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step active"><div class="step-circle">4</div><span class="step-label">Documents</span></div>
                    <div class="step"><div class="step-circle">5</div></div>
                </div>

                <div class="glass form-card">
                    <h2 style="margin-bottom: 2rem;">Verification Documents</h2>
                    <p style="color: var(--text-muted); margin-bottom: 2rem;">Upload clear scans of your documents. PNG, JPG or PDF (Max 2MB).</p>

                    <div class="doc-list" style="display: flex; flex-direction: column; gap: 1.5rem;">
                        <div class="glass" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
                            <div>
                                <h4 style="margin:0;">Proof of Address (Aadhaar Card)</h4>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">MANDATORY</span>
                            </div>
                            <div style="display: flex; gap: 0.5rem;">
                                <button class="btn btn-secondary"><i data-lucide="upload"></i> Upload</button>
                            </div>
                        </div>

                        <div class="glass" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-md); border-left: 4px solid var(--primary);">
                            <div>
                                <h4 style="margin:0;">Proof of Birth (10th Marks Card)</h4>
                                <span style="font-size: 0.85rem; color: var(--text-muted);">MANDATORY</span>
                            </div>
                            <button class="btn btn-secondary"><i data-lucide="upload"></i> Upload</button>
                        </div>

                        <div class="glass" style="padding: 1.5rem; display: flex; justify-content: space-between; align-items: center; border-radius: var(--radius-md); background: #f0fdf4;">
                            <div>
                                <h4 style="margin:0;">Passport Size Photo</h4>
                                <span style="font-size: 0.85rem; color: var(--success);">UPLOADED ✓</span>
                            </div>
                            <button class="btn btn-ghost" style="color: var(--success);"><i data-lucide="image"></i> View</button>
                        </div>
                    </div>

                    <div class="btn-group" style="justify-content: space-between; margin-top: 3rem;">
                        <button class="btn btn-secondary" onclick="router.navigate('/apply')"><i data-lucide="chevron-left"></i> Back</button>
                        <button class="btn btn-primary" onclick="router.navigate('/appointment')">Next: Book Appointment <i data-lucide="chevron-right"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function AppointmentPage() {
    return `
        <div class="container animate-fade-in">
            <div class="multi-step-container">
                <div class="stepper">
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step completed"><div class="step-circle"><i data-lucide="check" style="width: 14px;"></i></div></div>
                    <div class="step active"><div class="step-circle">5</div><span class="step-label">Booking</span></div>
                </div>

                <div class="glass form-card">
                    <h2 style="margin-bottom: 2rem;">Schedule Your Visit</h2>
                    
                    <div class="form-group">
                        <label>Select Passport Seva Kendra (PSK)</label>
                        <select class="form-control">
                            <option>PSK Bengaluru Central (Lalbagh)</option>
                            <option>PSK Bengaluru North (Hubli)</option>
                            <option>PSK Mysuru</option>
                        </select>
                    </div>

                    <h4 style="margin-top: 2rem;">Select Available Date</h4>
                    <div class="calendar-grid">
                        <div class="calendar-day disabled">20</div>
                        <div class="calendar-day disabled">21</div>
                        <div class="calendar-day disabled">22</div>
                        <div class="calendar-day disabled">23</div>
                        <div class="calendar-day" onclick="selectDate(this)">24</div>
                        <div class="calendar-day" onclick="selectDate(this)">25</div>
                        <div class="calendar-day" onclick="selectDate(this)">26</div>
                        <div class="calendar-day" onclick="selectDate(this)">27</div>
                        <div class="calendar-day selected" onclick="selectDate(this)">28</div>
                        <div class="calendar-day" onclick="selectDate(this)">29</div>
                        <div class="calendar-day" onclick="selectDate(this)">30</div>
                        <div class="calendar-day" onclick="selectDate(this)">31</div>
                        <div class="calendar-day" onclick="selectDate(this)">01</div>
                        <div class="calendar-day" onclick="selectDate(this)">02</div>
                    </div>

                    <div style="margin-top: 2rem; background: var(--primary-light); padding: 1.5rem; border-radius: var(--radius-md); color: var(--primary); display: flex; gap: 1rem; align-items: flex-start;">
                        <i data-lucide="info" style="flex-shrink: 0;"></i>
                        <p style="font-size: 0.9rem; margin:0;"><strong>Available Slot:</strong> Friday, 28th March 2025 at 10:15 AM has 124 seats available.</p>
                    </div>

                    <div class="btn-group" style="justify-content: space-between; margin-top: 3rem;">
                        <button class="btn btn-secondary" onclick="router.navigate('/document-upload')"><i data-lucide="chevron-left"></i> Back</button>
                        <button class="btn btn-primary" onclick="router.navigate('/confirmation')">Confirm & Pay <i data-lucide="credit-card"></i></button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

function ConfirmationPage() {
    setTimeout(() => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#6366f1', '#10b981', '#f43f5e']
        });
    }, 500);

    return `
        <div class="container animate-fade-in" style="max-width: 600px; margin-top: 4rem;">
            <div class="glass form-card" style="text-align: center; border-top: 4px solid var(--success);">
                <div style="width: 5rem; height: 5rem; border-radius: 50%; background: #dcfce7; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 1.5rem;">
                    <i data-lucide="check-circle" style="color: var(--success); width: 2.5rem; height: 2.5rem;"></i>
                </div>
                <h2>Application Submitted!</h2>
                <p style="color: var(--text-muted); margin-bottom: 2rem;">Your passport application (ID: PK-${Math.floor(Math.random()*900000+100000)}) has been successfully filed.</p>

                <div class="glass" style="text-align: left; padding: 1.5rem; border-radius: var(--radius-md); margin-bottom: 2.5rem; background: var(--bg-main);">
                    <h4 style="margin-bottom: 1rem; border-bottom: 1px solid var(--border); padding-bottom: 0.5rem;">Appointment Details</h4>
                    <p><strong>Location:</strong> PSK Bengaluru Central</p>
                    <p><strong>Date:</strong> 28th March 2025</p>
                    <p><strong>Time:</strong> 10:15 AM</p>
                    <p><strong>Queue Token:</strong> A124</p>
                </div>

                <div style="display: flex; flex-direction: column; gap: 1rem;">
                    <button class="btn btn-primary" style="justify-content: center;" onclick="downloadReceipt()">
                        <i data-lucide="download"></i> Download Acknowledgement Receipt (PDF)
                    </button>
                    <div class="btn-group" style="justify-content: center;">
                        <button class="btn btn-secondary" style="flex: 1; justify-content: center;" onclick="router.navigate('/dashboard')">Go to Dashboard</button>
                        <button class="btn btn-secondary" style="flex: 1; justify-content: center;"><i data-lucide="share-2"></i> Share Status</button>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// --- Event Handlers & API Calls ---

async function login(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    
    try {
        const res = await fetch(`${API_BASE}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        
        if (res.ok) {
            state.token = data.token;
            state.user = data.user;
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            updateNav();
            router.navigate('/dashboard');
        } else {
            alert(data.message);
        }
    } catch (err) {
        console.error(err);
        alert('Could not connect to backend. Please ensure it is running on port 5000.');
    }
}

async function fetchApplications() {
    try {
        const res = await fetch(`${API_BASE}/applications`, {
            headers: { 'Authorization': `Bearer ${state.token}` }
        });
        const data = await res.json();
        state.applications = data;
        renderAppList();
    } catch (err) {
        console.error(err);
    }
}

function renderAppList() {
    const list = document.getElementById('application-list');
    if (!list) return;

    if (state.applications.length === 0) {
        list.innerHTML = `
            <div style="text-align: center; padding: 4rem; border: 2px dashed var(--border); border-radius: var(--radius-lg);">
                <i data-lucide="inbox" style="width: 3rem; height: 3rem; color: var(--text-light); margin-bottom: 1rem;"></i>
                <p style="color: var(--text-muted);">No applications found. Start your first one!</p>
            </div>
        `;
    } else {
        list.innerHTML = state.applications.map(app => `
            <div class="app-item">
                <div>
                    <h4 style="margin: 0;">${app.type === 'fresh' ? 'Fresh Passport' : 'Re-issue'} Application</h4>
                    <span style="font-size: 0.8rem; color: var(--text-muted);">Last saved: ${new Date(app.last_saved).toLocaleString()}</span>
                </div>
                <div style="display: flex; align-items: center; gap: 1.5rem;">
                    <span class="status-badge draft">Draft</span>
                    <button class="btn btn-secondary" onclick="editApp('${app.id}')">Continue <i data-lucide="arrow-right"></i></button>
                </div>
            </div>
        `).join('');
    }
    lucide.createIcons();
}

function startNewApplication() {
    const type = document.getElementById('app-type').value;
    const id = 'app_' + Date.now();
    state.currentApp = { id, type, step: 2 };
    router.navigate(`/apply`);
}

function editApp(id) {
    const app = state.applications.find(a => a.id === id);
    if (app) {
        state.currentApp = app;
        router.navigate(`/apply`);
    }
}

// Autosave Logic
let autosaveTimeout;
function handleInputChange(e) {
    if (!state.currentApp) return;
    
    const { name, value } = e.target;
    state.currentApp[name] = value;
    
    clearTimeout(autosaveTimeout);
    autosaveTimeout = setTimeout(() => saveProgress(), 1000);
}

async function saveProgress() {
    if (!state.currentApp) return;
    
    const indicator = document.getElementById('autosave-tag');
    if (indicator) indicator.style.display = 'flex';
    
    try {
        await fetch(`${API_BASE}/applications`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${state.token}`
            },
            body: JSON.stringify(state.currentApp)
        });
        
        setTimeout(() => {
            if (indicator) indicator.style.display = 'none';
        }, 2000);
    } catch (err) {
        console.error('Save failed', err);
    }
}

function selectDate(el) {
    document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
    el.classList.add('selected');
}

function downloadReceipt() {
    alert('Thank you! Your acknowledgement receipt is being generated as a PDF...');
}

// --- Initialization ---

function render(component, params) {
    const view = document.getElementById('router-view');
    view.innerHTML = component(params);
    lucide.createIcons();
    updateNav();

    // Reset mobile menu on navigation
    document.body.classList.remove('nav-active');
    const menuToggle = document.getElementById('menu-toggle');
    if (menuToggle) {
        menuToggle.onclick = () => {
            document.body.classList.toggle('nav-active');
            const icon = menuToggle.querySelector('i');
            if (document.body.classList.contains('nav-active')) {
                icon.setAttribute('data-lucide', 'x');
            } else {
                icon.setAttribute('data-lucide', 'menu');
            }
            lucide.createIcons();
        };
    }


    // Event Listeners
    if (component === LoginPage) {
        document.getElementById('login-form').addEventListener('submit', login);
    }

    if (component === FormPage) {
        const fields = document.querySelectorAll('#application-form input, #application-form select');
        fields.forEach(f => f.addEventListener('input', handleInputChange));
    }
}

router.init();
updateNav();
