import { BASE_URL } from "./base_url.js";

document
  .getElementById("resetPasswordForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const newPassword = document.getElementById("newPassword").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const errorMessage = document.getElementById("errorMessage");
    const successMessage = document.getElementById("successMessage");

    // إخفاء الرسائل القديمة
    errorMessage.style.display = "none";
    successMessage.style.display = "none";

    // التحقق من تطابق الباسوردات
    if (newPassword !== confirmPassword) {
      errorMessage.textContent = "Passwords do not match.";
      errorMessage.style.display = "block";
      return;
    }

    const payload = {
      email: email,
      newPassword: newPassword,
    };

    try {
      const token = localStorage.getItem("resetToken"); // إذا عندك توكن
      const response = await fetch(`${BASE_URL}/auth/resetPassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token ? `Bearer ${token}` : "",
        },
        body: JSON.stringify(payload),
      });

      const responseData = await response.json();

      if (response.ok) {
        successMessage.style.display = "block";
        setTimeout(() => {
          window.location.href = "./login_form.html";
        }, 2000);
      } else {
        errorMessage.textContent =
          responseData.message || "Something went wrong.";
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Fetch error:", error);
      errorMessage.textContent = "An error occurred. Please try again later.";
      errorMessage.style.display = "block";
    }
  });
