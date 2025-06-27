import { BASE_URL } from "./base_url.js";

document
  .getElementById("verifyCodeForm")
  .addEventListener("submit", async function (event) {
    event.preventDefault(); // منع الـ submit الافتراضي

    const code = document.getElementById("code").value;
    const errorMessage = document.getElementById("errorMessage");

    try {
      const response = await fetch(`${BASE_URL}/auth/verifyResetCode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ resetCode: code }), // افترضت إن الـ API بيستقبل "resetCode" كـ key
      });

      if (response.ok) {
        // لو الاستجابة صحيحة، نروح لصفحة "New Password"
        window.location.href = "./code.html";
      } else {
        // لو الكود غلط أو فيه مشكلة، نعرض رسالة الخطأ
        errorMessage.style.display = "block";
      }
    } catch (error) {
      console.error("Error:", error);
      errorMessage.style.display = "block";
    }
  });
