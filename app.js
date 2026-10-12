// Require a demo login before opening the dashboard.
(function () {
  const session = sessionStorage.getItem("loanwise_demo_session");
  if (!session) {
    window.location.replace("login.html");
    return;
  }
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      sessionStorage.removeItem("loanwise_demo_session");
      window.location.href = "login.html";
    });
  }
})();

const loanForm = document.getElementById("loanForm");
const resultTitle = document.getElementById("resultTitle");
const resultText = document.getElementById("resultText");
const riskText = document.getElementById("riskText");
const riskBar = document.getElementById("riskBar");

// This is a FRONTEND-ONLY demonstration, not a trained machine-learning model.
// Replace this demo function when you connect your actual model/API.
loanForm.addEventListener("submit", function (event) {
  event.preventDefault();

  const form = new FormData(loanForm);
  const income = Number(form.get("income"));
  const loan = Number(form.get("loan"));
  const credit = Number(form.get("credit"));
  const dti = Number(form.get("dti"));
  const history = form.get("history");
  const employment = Number(form.get("employment"));

  // A simple illustrative score to demonstrate the result UI.
  // It must NOT be presented as an actual model prediction.
  let score = 45;
  if (credit >= 750) score -= 18;
  else if (credit >= 680) score -= 8;
  else if (credit < 600) score += 18;

  if (dti < 25) score -= 10;
  else if (dti > 45) score += 15;

  if (history === "good") score -= 12;
  else score += 10;

  if (income > 0 && loan / income > 0.6) score += 12;
  if (employment >= 5) score -= 5;
  if (employment === 0) score += 5;

  score = Math.max(5, Math.min(95, score));

  let label;
  if (score < 35) label = "Lower illustrative risk";
  else if (score < 65) label = "Moderate illustrative risk";
  else label = "Higher illustrative risk";

  resultTitle.textContent = label;
  resultText.textContent = "This is a sample UI demonstration based on simple rules, not a Random Forest or Gradient-Boosted Trees prediction. Connect your trained model to get real results.";
  riskText.textContent = score + "%";
  riskBar.style.width = score + "%";
});

loanForm.addEventListener("reset", function () {
  window.setTimeout(function () {
    resultTitle.textContent = "Your result will appear here";
    resultText.textContent = "Complete the form and run the demo to see how a result card can look.";
    riskText.textContent = "—";
    riskBar.style.width = "0%";
  }, 0);
});
