import { BASE_URL } from "./base_url.js";

document.addEventListener("DOMContentLoaded", function () {
  const token = localStorage.getItem("token");

  // جلب البيانات الحالية
  fetch(`${BASE_URL}/users/getMe`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("فشل في جلب البيانات");
      return res.json();
    })
    .then((data) => {
      const userData = data.data;
      document.getElementById("name").value = userData.name || "";
      document.getElementById("email").value = userData.email || "";
      document.getElementById("user-name").textContent = userData.name || "!";
    })
    .catch((error) => {
      console.error("Error fetching user data:", error);
    });

  // ✅ إرسال تعديل البيانات الشخصية
  document.getElementById("info-form").addEventListener("submit", function (e) {
    e.preventDefault();
    const updatedName = document.getElementById("name").value;
    const updatedEmail = document.getElementById("email").value;

    fetch(`${BASE_URL}/users/updateMe`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify({
        name: updatedName,
        email: updatedEmail,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Data updated successfully");
      })
      .catch((err) => {
        console.error("Error updating info:", err);
        alert("An error occurred while updating data.");
      });
  });

  // ✅ إرسال تغيير كلمة المرور
  document
    .getElementById("password-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      const currentPassword = document.getElementById("currentPassword").value;
      const newPassword = document.getElementById("newPassword").value;
      const confirmPassword = document.getElementById("confirmPassword").value;

      if (newPassword !== confirmPassword) {
        return alert("The new password and confirmation do not match.");
      }

      fetch(`${BASE_URL}/users/changeMyPassword`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify({
          passwordCurrent: currentPassword,
          password: newPassword,
          passwordConfirm: confirmPassword,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          alert("Password changed successfully");
        })
        .catch((err) => {
          console.error("Error changing password:", err);
          alert("An error occurred while changing your password.");
        });
    });
});
