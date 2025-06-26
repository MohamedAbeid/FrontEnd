import { BASE_URL } from "./base_url.js";

const productsList = document.getElementById("productsList");
const totalDiv = document.getElementById("total");
const token = localStorage.getItem("token");

async function fetchProductDetails(productId) {
  try {
    const res = await fetch(`${BASE_URL}/products/${productId}`);
    const data = await res.json();
    return data.data; // المنتج نفسه
  } catch (err) {
    console.error("خطأ أثناء تحميل بيانات المنتج:", err);
    return null;
  }
}

async function getCartItems() {
  try {
    const response = await fetch(`${BASE_URL}/cart`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    const cartItems = data.data.cartItems;

    productsList.innerHTML = "";
    let totalPrice = 0; // لحساب المجموع الكلي

    for (const item of cartItems) {
      const product = await fetchProductDetails(item.product);
      if (!product) continue;

      const subtotal = product.priceAfterDiscount * item.quantity;
      totalPrice += subtotal;

      const productHTML = `
              <div class="content">
                <div class="image">
                  <img src="${product.imageCover}" alt="${product.title}" />
                  <span>${product.title}</span>
                </div>
                <div class="salary">
                  <span>$${subtotal}</span>
                </div>
              </div>
            `;

      productsList.innerHTML += productHTML;
    }

    // ✅ عرض المجموع الكلي داخل العنصر #total
    totalDiv.innerHTML = `$${totalPrice.toFixed(2)}`;
  } catch (error) {
    console.error("فشل في تحميل الكارت:", error);
    productsList.innerHTML = `<p style="color:red;">حدث خطأ أثناء تحميل الكارت.</p>`;
  }
}

getCartItems();

////////////////

document
  .getElementById("placeOrderBtn")
  .addEventListener("click", async function (e) {
    e.preventDefault();

    const paymentMethodInput = document.querySelector(
      'input[name="paymentMethod"]:checked'
    );
    if (!paymentMethodInput) return alert("Please select a payment method");

    const firstName = document.getElementById("fr").value.trim();
    const companyName = document.getElementById("cn").value.trim();
    const streetAddress = document.getElementById("add").value.trim();
    const apartment = document.getElementById("ap").value.trim();
    const city = document.getElementById("to").value.trim();
    const phone = document.getElementById("ph").value.trim();
    const email = document.getElementById("em").value.trim();

    if (!firstName || !streetAddress || !city || !phone || !email) {
      return alert("Please fill in all required shipping fields.");
    }

    const shippingAddress = {
      details: `${streetAddress}${apartment ? ", " + apartment : ""}${
        companyName ? ", " + companyName : ""
      }, ${firstName}`,
      phone: phone,
      city: city,
    };

    const token = localStorage.getItem("token");
    const cartId = localStorage.getItem("cartId");

    if (!token || !cartId) {
      return alert("Missing token or cartId");
    }

    try {
      if (paymentMethodInput.value === "Bank") {
        // دفع Stripe عبر API checkout-session
        const res = await fetch(
          `${BASE_URL}/orders/checkout-session/${cartId}`,
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.message || "Failed to create Stripe session");
        }

        const data = await res.json();
        console.log(data);

        if (data.session && data.session.url) {
          // تحويل لصفحة الدفع Stripe
          window.location.href = data.session.url;
        } else {
          throw new Error("Payment URL not found in response");
        }
      } else if (paymentMethodInput.value === "Cash on delivery") {
        // إنشاء طلب عادي مع الدفع عند الاستلام
        const res = await fetch(`${BASE_URL}/orders/${cartId}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            shippingAddress,
            paymentMethod: paymentMethodInput.value,
          }),
        });

        const data = await res.json();

        if (res.ok) {
          window.location.href = "thanks.html";
          console.log("Order created:", data);
        } else {
          alert("Order failed: " + (data.message || "Unknown error"));
        }
      } else {
        alert("Unknown payment method selected");
      }
    } catch (err) {
      console.error("Error:", err);
      alert("Something went wrong: " + err.message);
    }
  });
