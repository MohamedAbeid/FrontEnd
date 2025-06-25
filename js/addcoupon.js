import { BASE_URL } from "./base_url.js";

const couponForm = document.getElementById("info-form");

couponForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const name = document.getElementById("coupon").value.trim();
  const expire = document.getElementById("expire").value;
  const discount = document.getElementById("discount").value.trim();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("يجب تسجيل الدخول أولاً لإضافة كوبون.");
    return;
  }

  if (!name || !expire || !discount) {
    alert("من فضلك أكمل جميع الحقول.");
    return;
  }

  try {
    const response = await fetch(`${BASE_URL}/coupons`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        name,
        expire,
        discount: Number(discount),
      }),
    });

    const result = await response.json();

    if (response.ok) {
      alert("تمت إضافة الكوبون بنجاح!");
      couponForm.reset();
    } else {
      alert(result.message || "حدث خطأ أثناء إضافة الكوبون.");
    }
  } catch (error) {
    console.error("Error:", error);
    alert("حدث خطأ أثناء الاتصال بالخادم.");
  }
});
