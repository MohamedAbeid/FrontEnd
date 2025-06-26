import { BASE_URL } from "./base_url.js";
let products = [];
let currentPage = 1;
const productsPerPage = 20;

// تحميل المنتجات من API
async function loadAllProducts() {
  try {
    const response = await fetch(`${BASE_URL}/products`);
    const result = await response.json();
    products = result.data;
    renderProductsPage(currentPage);
    renderPagination();
  } catch (error) {
    console.error("Error loading products:", error);
  }
}

// عرض المنتجات في الصفحة الحالية
function renderProductsPage(page) {
  const scrollContainer = document.querySelector(".month .scroll");
  scrollContainer.innerHTML = "";

  const start = (page - 1) * productsPerPage;
  const end = start + productsPerPage;
  const pageProducts = products.slice(start, end);

  pageProducts.forEach((product, index) => {
    const oldPrice = product.price;
    const newPrice = product.priceAfterDiscount || product.price;
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;

    const boxHTML = `
            <div class="box" data-id="${product._id}">
              <div class="photo">
                <button onclick="location.href='productdes.html?id=${
                  product._id
                }'">
                  <img src="${product.imageCover}" alt="${
      product.title
    }" width="190px" />
                  ${
                    oldPrice !== newPrice
                      ? `<span class="dis">-${Math.round(discount)}%</span>`
                      : ""
                  }
                  <span class="fev" data-product-id="product${index}">
                    <i class="fa-regular fa-heart" id="heart-product${index}"></i>
                  </span>
                </button>
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
}

// إنشاء أزرار الصفحات
function renderPagination() {
  const paginationContainer = document.createElement("div");
  paginationContainer.className = "pagination";
  paginationContainer.style.textAlign = "center";
  paginationContainer.style.marginTop = "20px";

  const totalPages = Math.ceil(products.length / productsPerPage);

  for (let i = 1; i <= totalPages; i++) {
    const pageButton = document.createElement("button");
    pageButton.textContent = i;
    pageButton.className = "page-btn";
    pageButton.style.margin = "0 5px";
    pageButton.style.padding = "5px 10px";
    pageButton.style.cursor = "pointer";
    pageButton.style.borderRadius = "6px";
    pageButton.style.border = "1px solid #ccc";
    pageButton.style.backgroundColor = i === currentPage ? "#333" : "#fff";
    pageButton.style.color = i === currentPage ? "#fff" : "#000";

    pageButton.addEventListener("click", () => {
      currentPage = i;
      renderProductsPage(currentPage);
      updatePaginationButtons();
    });

    paginationContainer.appendChild(pageButton);
  }

  // نضيفه تحت div الشهر
  document.querySelector(".month").appendChild(paginationContainer);
}

// تحديث ألوان الأزرار بعد تغيير الصفحة
function updatePaginationButtons() {
  const buttons = document.querySelectorAll(".pagination .page-btn");
  buttons.forEach((btn, index) => {
    if (index + 1 === currentPage) {
      btn.style.backgroundColor = "#333";
      btn.style.color = "#fff";
    } else {
      btn.style.backgroundColor = "#fff";
      btn.style.color = "#000";
    }
  });
}

// تحميل أول ما الصفحة تفتح
window.addEventListener("DOMContentLoaded", loadAllProducts);
