import { BASE_URL } from "./base_url.js";

const ordersContainer = document.querySelector(".right");
const token = localStorage.getItem("token");

async function fetchUserOrders() {
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (data.results === 0) {
      ordersContainer.innerHTML = "<p>لا توجد طلبات حتى الآن.</p>";
      return;
    }

    ordersContainer.innerHTML = ""; // مسح أي بيانات قديمة

    data.data.forEach((order) => {
      const card = document.createElement("div");
      card.style.cssText = `
        width: 380px;
        padding: 15px;
        border: 1px solid #ccc;
        border-radius: 10px;
        background-color: #f9f9f9;
        box-shadow: 0 2px 5px rgba(0,0,0,0.1);
        transition: transform 0.2s;
        margin: 10px;
      `;

      card.innerHTML = `
        <h3>Order ID: ${order._id}</h3>
        <p>Status: ${order.status}</p>
        <p>Total Price: ${order.totalOrderPrice}$</p>
        <p>Date : ${new Date(order.createdAt).toLocaleDateString("en")}</p>
      `;

      ordersContainer.appendChild(card);
    });
  } catch (err) {
    console.error(err);
    ordersContainer.innerHTML = "<p>حدث خطأ أثناء تحميل الطلبات.</p>";
  }
}

fetchUserOrders();
