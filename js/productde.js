import { BASE_URL } from "./base_url.js";

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  fetch(`${BASE_URL}/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
      const product = data.data;

      // اسم المنتج
      document.querySelector(".d3 h2").textContent = product.title;

      // السعر والعرض
      document.querySelector(".d3 h3 mark").textContent = `$${product.price}`;
      if (product.priceAfterDiscount) {
        document.querySelector(
          ".d3 h3 del"
        ).textContent = `$${product.priceAfterDiscount}`;
      } else {
        document.querySelector(".d3 h3 del").style.display = "none";
      }

      // وصف المنتج
      document.querySelector(".d3 p:nth-of-type(2)").textContent =
        product.description;

      // حالة التوفر
      const availabilityElement = document.querySelector(
        ".d3 p:nth-of-type(1)"
      );
      availabilityElement.innerHTML = `<b><p style="color: #db4444">Quantity : ${
        product.quantity > 0 ? product.quantity : "Out of Stock"
      }</p></b>`;

      // صور المنتج
      const imageContainer = document.getElementById("thumbnailImages");
      imageContainer.innerHTML = "";
      product.images.forEach((img) => {
        const smallImg = document.createElement("img");
        smallImg.className = "pic";
        smallImg.src = img;
        smallImg.alt = product.title;
        smallImg.addEventListener("click", () => {
          document.getElementById("largeImage").src = img;
        });
        imageContainer.appendChild(smallImg);
      });

      // صورة الغلاف الرئيسية
      document.getElementById("largeImage").src = product.imageCover;

      // الألوان المتوفرة
      const colorContainer = document.querySelector(".color-options");
      colorContainer.innerHTML = "";
      product.availableColors.forEach((color) => {
        const box = document.createElement("div");
        box.className = "color-box";
        box.style.backgroundColor = color;
        box.setAttribute("data-color", color);
        colorContainer.appendChild(box);

        // تغيير الصورة حسب اللون لو فيه ارتباط
        box.addEventListener("click", () => {
          document.getElementById("largeImage").src = product.imageCover; // أو img حسب ربطك
        });
      });
    })
    .catch((err) => {
      console.error("Error fetching product data:", err);
      document.querySelector(".d3 h2").textContent = "Failed to load product.";
    });
} else {
  document.querySelector(".d3 h2").textContent = "Product ID not found in URL.";
}
