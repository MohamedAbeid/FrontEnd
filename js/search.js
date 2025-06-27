import { BASE_URL } from "./base_url.js";

const searchInput = document.getElementById("searchInput");
const productsContainer = document.getElementById("productsContainer");

// دالة لعرض المنتجات في الـ container
function displayProducts(products) {
  productsContainer.innerHTML = "";

  if (products.length === 0) {
    productsContainer.innerHTML = "<p>No products found.</p>";
    return;
  }

  products.forEach((product, index) => {
    const oldPrice = product.price;
    const newPrice = product.priceAfterDiscount || product.price;
    const discount = ((oldPrice - newPrice) / oldPrice) * 100;

    const box = document.createElement("div");
    box.className = "box";
    box.setAttribute("data-id", product._id);

    box.innerHTML = `
      <div class="photo">
        <button onclick="location.href='productdes.html?id=${product._id}'">
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
    `;

    productsContainer.appendChild(box);
  });
}

// دالة للبحث أو جلب كل المنتجات
async function searchProducts() {
  const query = searchInput.value.trim();

  try {
    const url =
      query === ""
        ? `${BASE_URL}/products`
        : `${BASE_URL}/products?keyword=${query}`;

    console.log(url);

    const res = await fetch(url);
    const data = await res.json();

    displayProducts(data.data);
  } catch (err) {
    console.error(err);
  }
}

window.searchProducts = searchProducts;
