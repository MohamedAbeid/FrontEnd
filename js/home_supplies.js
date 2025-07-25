import { BASE_URL } from "./base_url.js";

const categoryName = "Home Supplies";

const token = localStorage.getItem("token");
document.querySelector(".left h2").textContent = categoryName;

async function fetchProductsByCategory() {
  try {
    const response = await fetch(`${BASE_URL}/products?limit=1000`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();
    const allProducts = result.data || [];

    // فلترة حسب اسم الفئة
    const filteredProducts = allProducts.filter(
      (product) => product.category && product.category.name === categoryName
    );

    const container = document.getElementById("productsContainer");
    container.innerHTML = "";

    if (filteredProducts.length === 0) {
      container.innerHTML = "<p>Not Products</p>";
      return;
    }
    // عرض المنتجات
    filteredProducts.forEach((product, index) => {
      const oldPrice = product.price || 0;
      const newPrice = product.priceAfterDiscount || oldPrice;

      const box = document.createElement("div");
      box.classList.add("box");

      box.innerHTML = `
        <div class="box" data-id="${product._id}">
          <div class="photo">
              <img src="${product.imageCover}" alt="${
        product.title
      }" width="190px" />
              ${
                oldPrice !== newPrice
                  ? `<span class="dis">-${Math.round(
                      ((oldPrice - newPrice) / oldPrice) * 100
                    )}%</span>`
                  : ""
              }
              <span class="fev" data-product-id="product${index}">
                <i class="fa-regular fa-heart" id="heart-product${index}"></i>
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
        `;

      container.appendChild(box);
    });
  } catch (error) {
    console.error("❌ Error fetching products:", error);
    document.getElementById("productsContainer").innerHTML =
      "<p style='color:red;'>An error occurred while loading the products..</p>";
  }
}

fetchProductsByCategory();
let searchTimeout; // لتأخير البحث بعد التوقف عن الكتابة (debounce)

function searchProducts() {
  clearTimeout(searchTimeout); // إلغاء أي بحث سابق قبل البدء

  searchTimeout = setTimeout(() => {
    const keyword = document.getElementById("searchInput").value.trim();
    const url = `${BASE_URL}/products?keyword=${encodeURIComponent(keyword)}`;

    fetch(url)
      .then((response) => response.json())
      .then((data) => {
        const resultsDiv = document.getElementsByClassName("scroll");
        resultsDiv.innerHTML = ""; // تفريغ النتائج السابقة

        if (data.length === 0) {
          resultsDiv.innerHTML = "<p>No results found.</p>";
          return;
        }

        data.forEach((product) => {
          const item = document.createElement("div");
          item.textContent = product.name; // أو أي تفاصيل تحب تعرضها
          resultsDiv.appendChild(item);
        });
      })
      .catch((error) => {
        console.error("An error occurred while fetching the products.:", error);
      });
  }, 300); // تأخير التنفيذ 300ms بعد التوقف عن الكتابة
}

window.searchProducts = searchProducts;
