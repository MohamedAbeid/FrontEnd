import { BASE_URL } from "./base_url.js";

async function loadCategories() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/categories`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("Failed to fetch data");

    const result = await response.json();
    const categories = result.data;
    const container = document.getElementById("addressesContainer");
    container.innerHTML = "";

    categories.forEach((category) => {
      const card = document.createElement("div");
      card.classList.add("category-card");
      card.style.cssText = `
              width: 220px;
              padding: 15px;
              border: 1px solid #ccc;
              border-radius: 10px;
              background-color: #f9f9f9;
              box-shadow: 0 2px 5px rgba(0,0,0,0.1);
              transition: transform 0.2s;
            `;
      card.innerHTML = `
              <h3>${category.name}</h3>
              <div class="category-actions" style="margin-top: 10px;">
                <button class="delete-btn" data-id="${category._id}" style="width: 100%; background-color: #f44336; color: white; border: none; border-radius: 5px; padding: 6px;">حذف</button>
              </div>
            `;
      container.appendChild(card);
    });

    // زر الحذف
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        if (confirm("Are you sure you want to delete this category?")) {
          try {
            const deleteRes = await fetch(`${BASE_URL}/categories/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (deleteRes.ok || deleteRes.status === 204) {
              alert("Category deleted successfully");
              const card = this.closest(".category-card");
              if (card) card.remove();
            } else {
              const errorData = await deleteRes.json();
              alert(errorData.message || "Category deletion failed");
            }
          } catch (err) {
            console.error(err);
            alert("An error occurred while deleting the category.");
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById("addressesContainer").innerHTML =
      "<p>An error occurred while loading the categories.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadCategories);
