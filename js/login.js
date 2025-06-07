import { BASE_URL } from "./base_url.js";

function signIn() {
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;

  if (!email || !password) {
    return alert("❌ Please enter both email and password.");
  }

  fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", data.data.role);
        alert("✅ Login successful!");
        window.location.href = "./index.html";
      } else {
        alert("❌ Login failed: " + data.message);
      }
    })
    .catch((error) => {
      console.error("❌ Error signing in:", error);
      alert("❌ Error connecting to server.");
    });
}

window.signIn = signIn; // ضروري إذا كنت تستدعي signIn من HTML مباشرة
