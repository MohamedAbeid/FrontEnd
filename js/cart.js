import { BASE_URL } from "./base_url.js";

async function addToCart(productId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لازم تسجل دخول الأول عشان تضيف للسلة!");
      return;
    }

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ productId }),
    });

    if (!response.ok) throw new Error("فيه مشكلة في الاتصال بالـ API");

    const data = await response.json();
    console.log("تمت الإضافة بنجاح:", data);
    alert("تم إضافة المنتج للسلة بنجاح!");
    fetchCart(); // نحدث الكارت بعد الإضافة
  } catch (error) {
    console.error("حصل خطأ:", error);
    alert("فيه مشكلة، حاول تاني!");
  }
}

async function fetchCart() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لازم تسجل دخول الأول!");
      return;
    }

    const response = await fetch("http://localhost:8000/cart", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("فيه مشكلة في جلب بيانات السلة");

    const result = await response.json();
    console.log("Cart Response:", result);
    const cartItems = result.data.cartItems;
    const cartId = result.data._id;
    localStorage.setItem("cartId", cartId);

    // جلب تفاصيل كل منتج
    for (let item of cartItems) {
      const productResponse = await fetch(
        `http://localhost:8000/products/${item.product}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (productResponse.ok) {
        const productData = await productResponse.json();
        const product = productData.data;
        item.name = product.title || "غير معروف";
        item.image = product.imageCover || "Images/default.png";
        item.priceAfterDiscount =
          product.priceAfterDiscount !== undefined
            ? product.priceAfterDiscount
            : product.price; // ✅ هنا التعديل فقط
      } else {
        item.name = "منتج غير موجود";
        item.image = "Images/default.png";
        item.priceAfterDiscount = item.price;
      }
    }

    displayCart(cartItems);
    updateCartCount(cartItems);
  } catch (error) {
    console.error("حصل خطأ:", error);
    alert("فيه مشكلة في تحميل السلة!");
  }
}

function displayCart(cartItems) {
  const cartBody = document.getElementById("cart-body");
  if (!cartBody) return;

  cartBody.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const subtotal = item.priceAfterDiscount * item.quantity;
    total += subtotal;

    const row = document.createElement("tr");
    row.innerHTML = `
        <td class="product">
          <img src="${item.image}" alt="${
      item.name
    }" style="width: 50px; height: 50px;">
          <span>${item.name}</span>
        </td>
        <td>$${item.priceAfterDiscount.toFixed(2)}</td>
        <td>
          <input type="number" value="${item.quantity}" min="1"
            onchange="updateQuantity('${item._id}', this.value)">
        </td>
        <td>$${subtotal.toFixed(2)}</td>
        <td>
          <button onclick="removeFromCart('${item._id}')">🗑️</button>
        </td>
      `;
    cartBody.appendChild(row);
  });

  const totalElement = document.querySelector(".cart-total span");
  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }
}

async function updateQuantity(cartItemId, newQuantity) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لازم تسجل دخول!");
      return;
    }

    const response = await fetch(`http://localhost:8000/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
    });

    if (!response.ok) throw new Error("فيه مشكلة في تحديث الكمية");

    fetchCart();
  } catch (error) {
    console.error("حصل خطأ:", error);
    alert("فيه مشكلة في تحديث الكمية، حاول تاني!");
  }
}

async function removeFromCart(cartItemId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("لازم تسجل دخول!");
      return;
    }

    const response = await fetch(`http://localhost:8000/cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("فيه مشكلة في الحذف");

    alert("تم حذف المنتج من السلة!");
    fetchCart();
  } catch (error) {
    console.error("حصل خطأ:", error);
    alert("فيه مشكلة في الحذف، حاول تاني!");
  }
}

function updateCartCount(cartItems = []) {
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartCountElement = document.querySelector(".cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = totalCount;
  }
}

// تحميل تلقائي إذا كانت الصفحة تحتوي على سلة
window.onload = function () {
  if (document.getElementById("cart-body")) {
    fetchCart();
  }
  const token = localStorage.getItem("token");
  if (token) {
    document.querySelector(".account").style.display = "block";
  }
};
