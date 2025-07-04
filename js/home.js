// call product in Home page

import { BASE_URL } from "./base_url.js";

async function loadDiscountedProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const result = await response.json();
    const products = result.data; // حسب شكل الـ API عندك

    const scrollContainer = document.querySelector(".today .scroll");

    products.forEach((product, index) => {
      const oldPrice = product.price;
      const newPrice = product.priceAfterDiscount || product.price;

      // حساب نسبة الخصم
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;

      if (discount > 30) {
        const boxHTML = `
  <div class="box" data-id="${product._id}">
  <div class="photo">
    <img src="${product.imageCover}" alt="${product.title}" width="190px" />
    ${
      oldPrice !== newPrice
        ? `<span class="dis">-${Math.round(discount)}%</span>`
        : ""
    }
    <span class="fev" data-product-id="product${index}">
        <i class="fa-regular fa-heart" data-product-id="${product._id}"></i>
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

        scrollContainer.innerHTML += boxHTML;
      }
    });
  } catch (error) {
    console.error("Error loading discounted products:", error);
  }
}

// شغل الفنكشن بعد تحميل الصفحة
window.addEventListener("DOMContentLoaded", loadDiscountedProducts);

// call

async function loadLatestProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const result = await response.json();
    const products = result.data;

    // ترتيب حسب الأحدث (من تاريخ الإضافة)
    const sortedProducts = products.sort(
      (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    const scrollContainer = document.querySelector(".month .month .scroll");

    // نعرض آخر 4 منتجات فقط
    sortedProducts.slice(0, 4).forEach((product, index) => {
      const oldPrice = product.price;
      const newPrice = product.priceAfterDiscount || product.price;
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;

      const boxHTML = `
              <div class="box" data-id="${product._id}">
  <div class="photo">
    <img src="${product.imageCover}" alt="${product.title}" width="190px" />
    ${
      oldPrice !== newPrice
        ? `<span class="dis">-${Math.round(discount)}%</span>`
        : ""
    }
    <span class="fev" data-product-id="product${index}">
        <i class="fa-regular fa-heart" data-product-id="${product._id}"></i>
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

      scrollContainer.innerHTML += boxHTML;
    });
  } catch (error) {
    console.error("Error loading latest products:", error);
  }
}

// تشغيل الفنكشن عند تحميل الصفحة
window.addEventListener("DOMContentLoaded", loadLatestProducts);

// call
async function loadRandomProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const result = await response.json();
    const products = result.data;

    // خلط المنتجات عشوائيًا
    const shuffled = products.sort(() => 0.5 - Math.random());
    const randomProducts = shuffled.slice(0, 8);

    const scrollContainer = document.querySelector(".our .scroll");
    scrollContainer.innerHTML = ""; // نفضي المكان قبل ما نحط المنتجات الجديدة

    randomProducts.forEach((product, index) => {
      const oldPrice = product.price;
      const newPrice = product.priceAfterDiscount || product.price;
      const discount = ((oldPrice - newPrice) / oldPrice) * 100;

      const boxHTML = `
              <div class="box" data-id="${product._id}">
  <div class="photo">
    <img src="${product.imageCover}" alt="${product.title}" width="190px" />
    ${
      oldPrice !== newPrice
        ? `<span class="dis">-${Math.round(discount)}%</span>`
        : ""
    }
    <span class="fev" data-product-id="product${index}">
        <i class="fa-regular fa-heart" data-product-id="${product._id}"></i>
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

      scrollContainer.innerHTML += boxHTML;
    });
  } catch (error) {
    console.error("Error loading random products:", error);
  }
}

// أول تحميل عند فتح الصفحة
window.addEventListener("DOMContentLoaded", loadRandomProducts);

// تحديث كل 10 دقايق تلقائيًا
setInterval(loadRandomProducts, 1 * 60 * 1000); // 10 دقائق = 600000 ملي ثانية

///////////

document.addEventListener("click", async function (e) {
  const heartBtn = e.target.closest("i.fa-heart");

  if (heartBtn) {
    const productId = heartBtn.getAttribute("data-product-id");

    if (!productId) return;

    const token = localStorage.getItem("token");
    if (!token) {
      alert("You must log in first.!");
      return;
    }

    try {
      const res = await fetch(`${BASE_URL}/wishlist`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          productId: productId,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("The product has been added to favorites. ❤️");
      } else {
        alert(data.message || "An error occurred while adding.");
      }
    } catch (err) {
      console.error(err);
      alert("There was an error connecting to the server.");
    }
  }
});
