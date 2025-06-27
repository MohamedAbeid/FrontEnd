import { BASE_URL } from "./base_url.js";

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // منع الـ form من الـ submit الافتراضي

    const email = document.getElementById("em").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
      const response = await fetch(`${BASE_URL}/auth/forgotPassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: email }),
      });

      if (response.ok) {
        // لو الاستجابة صحيحة، نروح لصفحة "Verification Code" أو "New Password" حسب الـ API
        window.location.href = "./NewPass.html"; // أو 'newpass.html' لو دي الصفحة اللي عايز تروحلها
      } else {
        // لو فيه خطأ، نعرض رسالة
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMessage.style.display = "block";
    }
  });
