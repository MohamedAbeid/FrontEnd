import { BASE_URL } from "./base_url.js";

const couponForm = document.getElementById("info-form");

couponForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("coupon").value.trim();
  const expire = document.getElementById("expire").value;
  const discount = document.getElementById("discount").value.trim();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("You must log in first to add a coupon.");
    return;
  }

  if (!name || !expire || !discount) {
    alert("Please complete all fields.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        expire,
        discount: Number(discount),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("Coupon added successfully!");
      couponForm.reset();
    } else {
      alert(result.message || "An error occurred while adding the coupon.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("An error occurred while connecting to the server.");
  }
});
