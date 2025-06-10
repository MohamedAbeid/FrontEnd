import { BASE_URL } from "./base_url.js";

const token = localStorage.getItem("token");

fetch(`${BASE_URL}/products?limit=1000`, {
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((res) => res.json())
  .then((data) => {
    const container = document.querySelector(".scroll");
    data.data.forEach((product) => {
      const discountPercent = product.priceAfterDiscount
        ? Math.round(
            ((product.price - product.priceAfterDiscount) / product.price) * 100
          )
        : 0;

      const productHTML = `
        <div class="box" id="product-box-${product._id}">
          <div class="photo">
            <button onclick="location.href='product.html?id=${product._id}'">
              <img src="${product.imageCover}" alt="${
        product.title
      }" width="190px" />
              ${
                product.priceAfterDiscount
                  ? `<span class="dis">-${discountPercent}%</span>`
                  : ""
              }
            </button>
          </div>
          <div class="text">
            <h3>${product.title}</h3>
            <div class="salary">
              <span>$${product.priceAfterDiscount || product.price}</span>
              ${
                product.priceAfterDiscount ? `<del>$${product.price}</del>` : ""
              }
            </div>
            <button class="delete-btn"
              onclick="deleteProduct('${product._id}')"
              style="padding: 10px;
                     text-align: center;
                     background-color: #db4444;
                     color: #ffffff;">
              Delete Product
            </button>
          </div>
        </div>
      `;
      container.innerHTML += productHTML;
    });
  })
  .catch((error) => {
    console.error("Error fetching products:", error);
  });

// ✅ دالة حذف المنتج (بعد التصحيح)
function deleteProduct(productId) {
  if (confirm("هل أنت متأكد من حذف هذا المنتج؟")) {
    fetch(`${BASE_URL}/products/${productId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          const productBox = document.getElementById(
            `product-box-${productId}`
          );
          if (productBox) productBox.remove();
          alert("تم حذف المنتج بنجاح");
        } else {
          alert("حدث خطأ أثناء الحذف");
        }
      })
      .catch((err) => {
        console.error("Delete error:", err);
        alert("فشل الاتصال بالخادم");
      });
  }
}

window.deleteProduct = deleteProduct;
