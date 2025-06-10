import { BASE_URL } from "./base_url.js";
// Load categories
fetch(`${BASE_URL}/categories`)
  .then((res) => res.json())
  .then((result) => {
    const categories = result.data || [];
    const categorySelect = document.getElementById("category");
    categories.forEach((cat) => {
      const option = document.createElement("option");
      option.value = cat._id || cat.id || cat.name;
      option.textContent = cat.name;
      categorySelect.appendChild(option);
    });
  })
  .catch((err) => {
    console.error("Error fetching categories:", err);
  });

// جلب التوكن والـ role من التخزين المحلي
const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role"); // admin or manager

// تحقق من صلاحية الدخول
if (!token || (userRole !== "admin" && userRole !== "manager")) {
  alert("Access Denied. You must be admin or manager.");
  document.getElementById("addProductForm").style.display = "none";
  throw new Error("Unauthorized access");
}

// 🎨 نظام إضافة الألوان باستخدام input type="color"
const selectedColors = new Set();
const addColorBtn = document.getElementById("addColorBtn");
const colorInput = document.getElementById("customColor");
const selectedColorsContainer = document.getElementById(
  "selectedColorsContainer"
);

addColorBtn.addEventListener("click", () => {
  const color = colorInput.value;

  if (!selectedColors.has(color)) {
    selectedColors.add(color);

    const colorCircle = document.createElement("div");
    colorCircle.className = "color-circle";
    colorCircle.style.backgroundColor = color;
    colorCircle.setAttribute("data-color", color);

    colorCircle.addEventListener("click", () => {
      selectedColors.delete(color);
      selectedColorsContainer.removeChild(colorCircle);
    });

    selectedColorsContainer.appendChild(colorCircle);
  }
});

// 📝 حدث إرسال الفورم
document
  .getElementById("addProductForm")
  .addEventListener("submit", function (e) {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", document.getElementById("title").value);
    formData.append("quantity", document.getElementById("quantity").value);
    formData.append("price", document.getElementById("price").value);
    formData.append(
      "priceAfterDiscount",
      document.getElementById("priceAfterDiscount").value
    );
    formData.append(
      "description",
      document.getElementById("description").value
    );
    formData.append("category", document.getElementById("category").value);
    formData.append(
      "imageCover",
      document.getElementById("imageCover").files[0]
    );

    const images = document.getElementById("images").files;
    for (let i = 0; i < images.length && i < 4; i++) {
      formData.append("images", images[i]);
    }

    // إرسال الألوان المختارة
    selectedColors.forEach((color) => {
      formData.append("colors[]", color);
    });

    // إضافة الأحجام المختارة
    const sizesSelect = document.getElementById("sizes");
    const selectedSizes = Array.from(sizesSelect.selectedOptions).map(
      (option) => option.value
    );
    selectedSizes.forEach((size) => {
      formData.append("size", size); // تكرار نفس المفتاح "size" للـ array
    });

    fetch(`${BASE_URL}/products`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    })
      .then((res) => res.json())
      .then((data) => {
        alert("Product added successfully!");
        console.log(data);
      })
      .catch((err) => {
        console.error("Error adding product:", err);
        alert("Error adding product");
      });
  });
