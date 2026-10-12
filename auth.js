// Frontend-only demo authentication. Accounts are stored in this browser.
// Do not use this approach for production or real personal data.
const USERS_KEY = "loanwise_demo_users";
const SESSION_KEY = "loanwise_demo_session";

function readUsers() {
  try { return JSON.parse(localStorage.getItem(USERS_KEY) || "[]"); }
  catch { return []; }
}
function showAuthMessage(message, type = "error") {
  const el = document.getElementById("authMessage");
  if (!el) return;
  el.textContent = message;
  el.className = `auth-message ${type}`;
}
function normaliseEmail(email) { return email.trim().toLowerCase(); }

const signupForm = document.getElementById("signupForm");
if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(signupForm);
    const name = String(data.get("name") || "").trim();
    const email = normaliseEmail(String(data.get("email") || ""));
    const password = String(data.get("password") || "");
    const confirmPassword = String(data.get("confirmPassword") || "");

    if (!name || !email || !password) return showAuthMessage("Please complete every field.");
    if (password.length < 6) return showAuthMessage("Password must contain at least 6 characters.");
    if (password !== confirmPassword) return showAuthMessage("The passwords do not match.");

    const users = readUsers();
    if (users.some(user => user.email === email)) {
      return showAuthMessage("An account with this email already exists. Please sign in.");
    }

    // Store a demo account only. Never store real passwords in a frontend-only app.
    users.push({ name, email, password });
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
    showAuthMessage("Account created. Taking you to login…", "success");
    signupForm.reset();
    window.setTimeout(() => { window.location.href = "login.html"; }, 700);
  });
}

const loginForm = document.getElementById("loginForm");
if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const data = new FormData(loginForm);
    const email = normaliseEmail(String(data.get("email") || ""));
    const password = String(data.get("password") || "");
    const user = readUsers().find(item => item.email === email && item.password === password);

    if (!user) return showAuthMessage("Email or password is incorrect. If you're new, create an account first.");
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ name: user.name, email: user.email }));
    showAuthMessage("Login successful. Opening your dashboard…", "success");
    window.setTimeout(() => { window.location.href = "index.html"; }, 500);
  });
}
