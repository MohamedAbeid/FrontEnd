import { BASE_URL } from "./base_url.js";

async function updateCartCountOnAllPages() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("مشكلة في جلب عدد السلة");

    const result = await response.json();
    const cartItems = result.data.cartItems || [];

    const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
    const cartCountElement = document.querySelector(".cart-count");
    if (cartCountElement) cartCountElement.textContent = totalCount;
  } catch (error) {
    console.error("خطأ أثناء تحديث عدد السلة:", error);
  }
}

// استدعاء الدالة تلقائيًا
updateCartCountOnAllPages();
