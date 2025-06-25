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
  .addEventListener("click", async function () {
    const paymentMethodInput = document.querySelector(
      'input[name="paymentMethod"]:checked'
    );
    if (!paymentMethodInput) return alert("Please select a payment method");

    const firstName = document.getElementById("fr").value;
    const companyName = document.getElementById("cn").value;
    const streetAddress = document.getElementById("add").value;
    const apartment = document.getElementById("ap").value;
    const city = document.getElementById("to").value;
    const phone = document.getElementById("ph").value;
    const email = document.getElementById("em").value;

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
    const cartId = localStorage.getItem("cartId"); // تأكد إنك حفظته قبل كده بعد جلب السلة

    if (!token || !cartId) {
      return alert("Missing token or cartId");
    }

    try {
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
        // redirect or success message
      } else {
        alert("Order failed: " + (data.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Order Error:", err);
      alert("Something went wrong while placing the order.");
    }
  });
