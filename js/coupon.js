import { BASE_URL } from "./base_url.js";

async function loadCoupons() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/coupons`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    const coupons = result.data;
    const container = document.getElementById("addressesContainer");
    container.innerHTML = "";

    coupons.forEach((coupon) => {
      const card = document.createElement("div");
      card.classList.add("coupon-card");
      card.style.cssText = `
              width: 220px;
              padding: 15px;
              border: 1px solid #ccc;
              border-radius: 10px;
              background-color: #f9f9f9;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              transition: transform 0.2s;
            `;
      card.innerHTML = `
              <h3>Name: ${coupon.name}</h3>
              <p>Discount: ${coupon.discount}%</p>
              <p>Expire:  ${coupon.expire.slice(0, 10)} </p>
              <div class="coupon-actions" style="margin-top: 10px;">
                <button class="delete-btn" data-id="${
                  coupon._id
                }" style="width: 100%; background-color: #f44336; color: white; border: none; border-radius: 5px; padding: 6px;">حذف</button>
              </div>
            `;
      container.appendChild(card);
    });

    // زر الحذف
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this coupon?؟")) {
          try {
            const deleteRes = await fetch(`${BASE_URL}/coupons/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (deleteRes.ok || deleteRes.status === 204) {
              alert("The coupon has been successfully deleted.");
              const card = this.closest(".coupon-card");
              if (card) card.remove();
            } else {
              const errorData = await deleteRes.json();
              alert(errorData.message || "فشل حذف الكوبون");
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the coupon.");
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById("addressesContainer").innerHTML =
      "<p>An error occurred while loading the coupons..</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadCoupons);
