import { BASE_URL } from "./base_url.js";
async function loadAddresses() {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(`${BASE_URL}/addresses`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) throw new Error("فشل في جلب البيانات");

    const result = await response.json();
    const addresses = result.data;
    const container = document.getElementById("addressesContainer");

    container.innerHTML = "";

    addresses.forEach((address) => {
      const card = document.createElement("div");
      card.classList.add("address-card");
      card.innerHTML = `
              <h3>${address.alias}</h3>
              <p><strong>Details:</strong> ${address.details}</p>
              <p><strong>Phone:</strong> ${address.phone}</p>
              <p><strong>City:</strong> ${address.city}</p>
              <p><strong>PostCode:</strong> ${address.postCode}</p>
              <div class="address-actions">
                <button class="delete-btn" data-id="${address._id}">Delete</button>
              </div>
            `;
      container.appendChild(card);
    });

    // زر التعديل
    const editButtons = document.querySelectorAll(".edit-btn");
    editButtons.forEach((button) => {
      button.addEventListener("click", function () {
        const id = this.getAttribute("data-id");
        // مثال: فتح صفحة تعديل مع إرسال ID كـ query string
        window.location.href = `edit-address.html?id=${id}`;
      });
    });

    // زر الحذف
    const deleteButtons = document.querySelectorAll(".delete-btn");
    deleteButtons.forEach((button) => {
      button.addEventListener("click", async function () {
        const id = this.getAttribute("data-id");
        if (confirm("هل أنت متأكد من حذف هذا العنوان؟")) {
          try {
            const deleteRes = await fetch(`${BASE_URL}/addresses/${id}`, {
              method: "DELETE",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
              },
            });

            if (!deleteRes.ok) throw new Error("فشل حذف العنوان");
            alert("تم حذف العنوان بنجاح");
            loadAddresses(); // تحديث القائمة بعد الحذف
          } catch (err) {
            console.error(err);
            alert("حدث خطأ أثناء حذف العنوان");
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
    document.getElementById("addressesContainer").innerHTML =
      "<p>حدث خطأ أثناء تحميل العناوين.</p>";
  }
}

window.addEventListener("DOMContentLoaded", loadAddresses);
