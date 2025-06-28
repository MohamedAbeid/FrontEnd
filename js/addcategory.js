import { BASE_URL } from "./base_url.js";

document
  .getElementById("categoryForm")
  .addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value.trim();
    const token = localStorage.getItem("token");
    const role = "admin"; // احذفها لو مش مطلوبة

    const data = {
      name: name,
      role: role, // احذفها لو مش مطلوبة
    };

    try {
      const response = await fetch(`${BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        alert("Category saved successfully ✅");
        document.getElementById("categoryForm").reset();
      } else {
        alert("حدث خطأ: " + (result.message || JSON.stringify(result)));
      }
    } catch (error) {
      console.error("Connection error:", error);
      alert("An error occurred while connecting to the server");
    }
  });
