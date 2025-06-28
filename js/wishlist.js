import { BASE_URL } from "./base_url.js";
const wishlistContainer = document.getElementsByClassName("scroll")[0];
const token = localStorage.getItem("token");

async function fetchWishlist() {
  if (!token) {
    alert("You must log in first!");
    return;
  }

  try {
    const res = await fetch(`${BASE_URL}/wishlist`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      const wishlist = data.data;

      wishlistContainer.innerHTML = "";

      wishlist.forEach((product, index) => {
        const oldPrice = product.price;
        const newPrice = product.priceAfterDiscount || product.price;
        const discount = ((oldPrice - newPrice) / oldPrice) * 100;

        wishlistContainer.innerHTML += `
          <div class="box" data-id="${product._id}">
    <div class="photo">
      <img src="${product.imageCover}" alt="${product.title}" width="190px" />
      ${
        oldPrice !== newPrice
          ? `<span class="dis">-${Math.round(discount)}%</span>`
          : ""
      }
      <span class="fev" data-product-id="${product._id}">
        <button class="btn-remove" data-product-id="${product._id}" style="
          font-size: 25px;
    color: #db4444;
    cursor: pointer;
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: #e6e6e6;
    border-radius: 50%;
    width: 25px;
    height: 25px;
        ">×</button>
      </span>
      <a href="productdes.html?id=${
        product._id
      }" class="add_cart">View Details</a>
    </div>
    <div class="text">
      <h3>${product.title}</h3>
      <div class="salary">
        <span>$${newPrice}</span>
        ${oldPrice !== newPrice ? `<del>$${oldPrice}</del>` : ""}
      </div>
      <div class="star">
        <img src="Images/Star.svg" alt="star" />
        <img src="Images/Star.svg" alt="star" />
        <img src="Images/Star.svg" alt="star" />
        <img src="Images/Star.svg" alt="star" />
        <img src="Images/Star.svg" alt="star" />
      </div>
    </div>
  </div>
        `;
      });
    } else {
      alert(data.message || "Error loading favorites");
    }
  } catch (err) {
    console.error(err);
    alert("There was an error connecting to the server.");
  }
}

fetchWishlist();

document.addEventListener("click", async function (e) {
  // حذف من الويش ليست
  if (e.target.classList.contains("btn-remove")) {
    const productId = e.target.getAttribute("data-product-id");
    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/wishlist/${productId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();

      if (res.ok) {
        alert("The product has been removed from favorites");
        // إزالة المنتج من الـ DOM بعد الحذف
        const box = e.target.closest(".box");
        if (box) box.remove();
      } else {
        alert(data.message || "An error occurred while deleting");
      }
    } catch (err) {
      console.error(err);
      alert("There was an error connecting to the server.");
    }
  }

  // إضافة للمفضلة عند الضغط على القلب (لو عايز تحتفظ بالكود ده)
  if (e.target.closest("i.fa-heart")) {
    // ... كود الإضافة (اللي كتبناه قبل كده)
  }
});
