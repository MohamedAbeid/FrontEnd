import { BASE_URL } from "./base_url.js";

document.querySelectorAll(".pic").forEach((img) => {
  img.addEventListener("click", function () {
    document.getElementById("largeImage").src = this.src;
  });
});
//2 js//
// تبديل الصورة عند النقر على صورة صغيرة
document.querySelectorAll(".pic").forEach((img) => {
  img.addEventListener("click", function () {
    document.getElementById("largeImage").src = this.src;

    // إزالة التحديد من جميع الصور الصغيرة
    document
      .querySelectorAll(".pic")
      .forEach((el) => el.classList.remove("selected"));

    // إضافة التحديد للصورة المختارة
    this.classList.add("selected");
  });
});

// ربط الألوان بالصور المناسبة
const colorImages = {
  red: "../Images/home/keyboard/1.png",
  "light-brown": "../Images/home/keyboard/5.png",
  white: "../Images/home/keyboard/4.png",
  Black: "../Images/home/keyboard/3.png",
};

document.querySelectorAll(".color-box").forEach((box) => {
  box.addEventListener("click", function () {
    const selectedColor = this.getAttribute("data-color");
    if (colorImages[selectedColor]) {
      document.getElementById("largeImage").src = colorImages[selectedColor];
    }
  });
});

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  fetch(`${BASE_URL}/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
      const product = data.data;

      // اسم المنتج
      document.querySelector(".d3 h2").textContent = `${product.title}`;

      // السعر والعرض
      document.querySelector(".d3 h3 del").textContent = `$${product.price}`;
      if (product.priceAfterDiscount) {
        document.querySelector(
          ".d3 h3 mark"
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

      product.colors.forEach((color) => {
        const box = document.createElement("div");
        box.className = "color-box";
        box.style.backgroundColor = color;
        box.setAttribute("data-color", color);
        colorContainer.appendChild(box);
      });
    })
    .catch((err) => {
      console.error("Error fetching product data:", err);
    });
} else {
  document.querySelector(".d3 h2").textContent = "Product ID not found in URL.";
}
