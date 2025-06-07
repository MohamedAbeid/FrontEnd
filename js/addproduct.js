import { BASE_URL } from "./base_url.js";

const token = localStorage.getItem("token");
const userRole = localStorage.getItem("role"); // admin or manager

if (!token || (userRole !== "admin" && userRole !== "manager")) {
  alert("Access Denied. You must be admin or manager.");
  document.getElementById("addProductForm").style.display = "none";
  throw new Error("Unauthorized access");
}

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

// Render color options
const colorList = [
  { name: "Red", value: "red" },
  { name: "Blue", value: "blue" },
  { name: "Green", value: "green" },
  { name: "Black", value: "black" },
  { name: "White", value: "white" },
  { name: "Yellow", value: "yellow" },
  { name: "Purple", value: "purple" },
  { name: "Orange", value: "orange" },
  { name: "Gray", value: "gray" },
  { name: "Brown", value: "brown" },
];
const colorOptionsContainer = document.getElementById("colorOptions");
const selectedColors = new Set();

colorList.forEach((color) => {
  const div = document.createElement("div");
  div.classList.add("color-circle");
  div.style.backgroundColor = color.value;
  div.setAttribute("title", color.name);
  div.setAttribute("data-color", color.value);

  div.addEventListener("click", () => {
    if (div.classList.contains("selected")) {
      div.classList.remove("selected");
      selectedColors.delete(color.value);
    } else {
      div.classList.add("selected");
      selectedColors.add(color.value);
    }
  });

  colorOptionsContainer.appendChild(div);
});

// Submit form
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

    selectedColors.forEach((color) => {
      formData.append("colors[]", color);
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
      });
  });
