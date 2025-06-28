import { BASE_URL } from "./base_url.js";

let selectedSize = null;

document.querySelectorAll(".size-box").forEach((box) => {
  box.addEventListener("click", () => {
    document
      .querySelectorAll(".size-box")
      .forEach((b) => b.classList.remove("selected"));
    box.classList.add("selected");
    selectedSize = box.dataset.size;
    console.log("Selected Size:", selectedSize);
  });
});

async function addToCart(productId, color) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first to add to cart!");
      return;
    }

    const body = { productId, color };
    if (selectedSize) {
      body.size = selectedSize;
    }

    console.log("القيم المرسلة:", body);

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok)
      throw new Error("There is a problem connecting to the API");

    const data = await response.json();
    console.log("Added successfully:", data);
    alert("The product has been successfully added to the cart!");
    fetchCart();
  } catch (error) {
    console.error("An error occurred:", error);
    alert("There's a problem, try again!");
  }
}

window.addToCart = addToCart;

//////////////

let appliedCoupon = null; // لازم تعريفه فوق في النطاق العام

async function fetchCart() {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first!");
      return;
    }

    const response = await fetch(`${BASE_URL}/cart`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok)
      throw new Error("There is a problem fetching the basket data.");

    const result = await response.json();
    const cartItems = result.data.cartItems;
    const cartId = result.data._id;
    localStorage.setItem("cartId", cartId);

    for (let item of cartItems) {
      try {
        const productResponse = await fetch(
          `${BASE_URL}/products/${item.product}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (productResponse.ok) {
          const productData = await productResponse.json();
          const product = productData.data;
          item.name = product.title || "unknown";
          item.image = product.imageCover || "Images/default.png";
          item.priceAfterDiscount =
            product.priceAfterDiscount !== undefined
              ? product.priceAfterDiscount
              : product.price;
        } else {
          throw new Error("Product not available");
        }
      } catch (err) {
        console.warn(`Product problems${item.product}:`, err);
        item.name = "Product not available";
        item.image = "Images/default.png";
        item.priceAfterDiscount = item.price;
      }
    }

    displayCart(cartItems);
    updateCartCount(cartItems);
  } catch (error) {
    console.error("An error occurred:", error);
    alert("There is a problem loading the basket!");
  }
}

//////////////////////

function displayCart(cartItems) {
  const cartBody = document.getElementById("cart-body");
  if (!cartBody) return;

  cartBody.innerHTML = "";
  let total = 0;

  cartItems.forEach((item) => {
    const subtotal = item.priceAfterDiscount * item.quantity;
    total += subtotal;

    const sizeDisplay = item.size ? `<div>Size: ${item.size}</div>` : "";

    const colorDisplay = `
      <div style="display: flex; align-items: center; gap: 5px;">
        <span>Color:</span>
        <div style="width: 15px; height: 15px; background-color: ${item.color}; border: 1px solid #000; border-radius: 50%;"></div>
      </div>
    `;

    const row = document.createElement("tr");
    row.innerHTML = `
      <td class="product">
        <img src="${item.image}" alt="${
      item.name
    }" style="width: 50px; height: 50px;">
        <div>
          <span>${item.name}</span>
          ${colorDisplay}
          ${sizeDisplay}
        </div>
      </td>
      <td>$${item.priceAfterDiscount.toFixed(2)}</td>
      <td>
        <input type="number" value="${item.quantity}" min="1"
          onchange="updateQuantity('${item._id}', this.value)">
      </td>
      <td>$${subtotal.toFixed(2)}</td>
      <td>
        <button style="background-color: #db4444; color: #ffffff; padding: 14px; border-radius: 10px; border: none; cursor: pointer;" onclick="removeFromCart('${
          item._id
        }')">Delete</button>
      </td>
    `;
    cartBody.appendChild(row);
  });

  const totalElement = document.querySelector(".cart-total span");
  const priceAfterDiscountElement =
    document.getElementById("priceAfterDiscount");

  if (totalElement) {
    totalElement.textContent = `$${total.toFixed(2)}`;
  }

  // حساب السعر بعد الخصم
  if (appliedCoupon && priceAfterDiscountElement) {
    const discountedTotal = total - (total * appliedCoupon.discount) / 100;
    priceAfterDiscountElement.textContent = `$${discountedTotal.toFixed(2)}`;
  } else if (priceAfterDiscountElement) {
    priceAfterDiscountElement.textContent = `$${total.toFixed(2)}`;
  }
}

////////////////////////////

async function updateQuantity(cartItemId, newQuantity) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in!");
      return;
    }

    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ quantity: parseInt(newQuantity) }),
    });

    if (!response.ok)
      throw new Error("There is a problem updating the quantity.");

    fetchCart();
  } catch (error) {
    console.error("An error occurred:", error);
    alert("There was a problem updating the quantity, try again!");
  }
}
window.updateQuantity = updateQuantity;

async function removeFromCart(cartItemId) {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in!");
      return;
    }

    const response = await fetch(`${BASE_URL}/cart/${cartItemId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) throw new Error("There is a problem with deletion.");

    alert("The product has been removed from the cart!");
    fetchCart();
  } catch (error) {
    console.error("An error occurred:", error);
    alert("There was a problem deleting, try again!");
  }
}

window.removeFromCart = removeFromCart;

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
