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

document.querySelectorAll(".color-box").forEach((box) => {
  box.addEventListener("click", function () {
    const selectedColor = this.getAttribute("data-color");
    if (colorImages[selectedColor]) {
      document.getElementById("largeImage").src = colorImages[selectedColor];
    }
  });
});

document
  .querySelector(".color-options")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("color-box")) {
      // إزالة التحديد من جميع العناصر داخل color-options
      document
        .querySelectorAll(".color-box")
        .forEach((b) => b.classList.remove("selected"));

      // إضافة التحديد للعنصر الذي تم الضغط عليه
      e.target.classList.add("selected");
    }
  });

// عند اختيار سايز
document
  .getElementById("sizeContainer")
  .addEventListener("click", function (e) {
    if (e.target.classList.contains("size-box")) {
      // إزالة التحديد من جميع العناصر
      document
        .querySelectorAll(".size-box")
        .forEach((b) => b.classList.remove("selected"));

      // إضافة التحديد للعنصر الذي تم الضغط عليه
      e.target.classList.add("selected");
    }
  });

// التحكم في عداد المنتج
document.getElementById("increase").onclick = function () {
  const input = document.getElementById("quantity");
  input.value = parseInt(input.value) + 1;
};

document.getElementById("decrease").onclick = function () {
  const input = document.getElementById("quantity");
  if (parseInt(input.value) > 1) {
    input.value = parseInt(input.value) - 1;
  }
};

const urlParams = new URLSearchParams(window.location.search);
const productId = urlParams.get("id");

if (productId) {
  fetch(`${BASE_URL}/products/${productId}`)
    .then((res) => res.json())
    .then((data) => {
      const product = data.data;

      document.querySelector("head title").textContent = `${product.title}`;
      // اسم المنتج
      document.querySelector(".d3 h2").textContent = `${product.title}`;

      // السعر والعرض
      document.querySelector(".d3 h3 del").textContent = `$${product.price}`;
      if (product.priceAfterDiscount) {
        document.querySelector(
          ".d3 h3 span"
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
      // الأحجام المتوفرة
      const sizeWrapper = document.getElementById("sizeWrapper");
      const sizeContainer = document.getElementById("sizeContainer");

      // التحقق من وجود أحجام
      if (product.size && product.size.length > 0) {
        sizeContainer.innerHTML = "";
        product.size.forEach((size) => {
          const sizeBox = document.createElement("span");
          sizeBox.className = "size-box";
          sizeBox.textContent = size;
          sizeContainer.appendChild(sizeBox);
        });
        sizeWrapper.style.display = "block";
      } else {
        // إخفاء القسم كله إذا لم توجد أحجام
        sizeWrapper.style.display = "none";
      }
      sizeBox.addEventListener("click", () => {
        document
          .querySelectorAll(".size-box")
          .forEach((el) => el.classList.remove("selected"));
        sizeBox.classList.add("selected");
      });
    })
    .catch((err) => {
      console.error("Error fetching product data:", err);
    });
} else {
  document.querySelector(".d3 h2").textContent = "Product ID not found in URL.";
}
