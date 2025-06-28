import { BASE_URL } from "./base_url.js";

const token = localStorage.getItem("token");
const ordersContainer = document.getElementById("ordersContainer");

async function getAllOrders() {
  try {
    const response = await fetch(`${BASE_URL}/orders`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();

    displayOrders(data.data);
  } catch (err) {
    console.error("Error fetching orders:", err);
  }
}

function displayOrders(orders) {
  ordersContainer.innerHTML = "";

  orders.forEach((order) => {
    ordersContainer.innerHTML += `
      <div style="width:400px" class="order-box" data-id="${order._id}">
        <p><strong>Order ID:</strong> ${order._id}</p>
        <p><strong>Total Price:</strong> ${order.totalOrderPrice} EGP</p>
        <p><strong>Payment Status:</strong> ${
          order.isPaid ? "✅ Paid" : "❌ Not Paid"
        }</p>
        <p><strong>Delivery Status:</strong> ${
          order.isDelivered ? "✅ Delivered" : "❌ Not Delivered"
        }</p>

        <button class="pay-btn" ${
          order.isPaid ? "disabled" : ""
        }>Mark as Paid</button>
        <button class="deliver-btn" ${
          order.isDelivered ? "disabled" : ""
        }>Mark as Delivered</button>
      </div>
    `;
  });
}

ordersContainer.addEventListener("click", async (e) => {
  const orderBox = e.target.closest(".order-box");
  if (!orderBox) return;

  const orderId = orderBox.getAttribute("data-id");

  if (e.target.classList.contains("pay-btn")) {
    await markOrderAsPaid(orderId);
  }

  if (e.target.classList.contains("deliver-btn")) {
    await markOrderAsDelivered(orderId);
  }
});

async function markOrderAsPaid(orderId) {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/pay`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      getAllOrders();
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error updating order status");
    }
  } catch (err) {
    console.error(err);
  }
}

async function markOrderAsDelivered(orderId) {
  try {
    const response = await fetch(`${BASE_URL}/orders/${orderId}/deliver`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.ok) {
      getAllOrders();
    } else {
      const errorData = await response.json();
      alert(errorData.message || "Error updating order status");
    }
  } catch (err) {
    console.error(err);
  }
}

getAllOrders();
