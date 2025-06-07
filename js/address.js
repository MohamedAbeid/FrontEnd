import { BASE_URL } from "./base_url.js";

// send
const form = document.getElementById("addressForm");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    alias: document.getElementById("alias").value,
    details: document.getElementById("details").value,
    phone: document.getElementById("phone").value,
    city: document.getElementById("City").value,
    postCode: document.getElementById("PostCode").value,
  };

  // 👇 نجيب التوكن من localStorage
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`${BASE_URL}/addresses`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      const result = await response.json();
      alert("Address saved successfully!");
      console.log(result);
      form.reset(); // Reset form after success
    } else {
      const errorData = await response.json();
      alert("Error: " + (errorData.message || "Something went wrong."));
    }
  } catch (error) {
    alert("Failed to connect to server.");
    console.error(error);
  }
});
