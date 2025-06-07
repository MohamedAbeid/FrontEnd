import { BASE_URL } from "./base_url.js";

function signUp() {
  const name = document.getElementById("name")?.value.trim();
  const email = document.getElementById("email")?.value.trim();
  const password = document.getElementById("password")?.value;
  const passwordConfirm = document.getElementById("passwordConfirm")?.value;

  if (!name || !email || !password || !passwordConfirm) {
    return alert("❌ All fields are required.");
  }

  if (password !== passwordConfirm) {
    return alert("❌ Passwords do not match.");
  }

  fetch(`${BASE_URL}/auth/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password, passwordConfirm }),
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        alert("✅ Signup successful!");
        window.location.href = "./login_form.html";
      } else {
        alert("❌ Signup failed: " + (data.message || "Something went wrong"));
      }
    })
    .catch((err) => {
      console.error("❌ Error signing up:", err);
      alert("❌ An error occurred. Please try again.");
    });
}

document.getElementById("signupForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  signUp();
});
