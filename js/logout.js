document.addEventListener("DOMContentLoaded", function () {
  const logoutBtn = document.getElementById("logoutBtn");

  logoutBtn.addEventListener("click", async function (e) {
    e.preventDefault();

    try {
      // 1. إرسال طلب تسجيل خروج إلى API (لو عندك endpoint فعلي)
      const token = localStorage.getItem("token");
      // 2. حذف التوكن من التخزين
      localStorage.removeItem("token");

      // 3. إخفاء العناصر
      document.querySelector(".heading").style.display = "none";
      document.querySelector(".search").style.display = "none";
      document.querySelector(".account").style.display = "none";

      // 4. إعادة التوجيه (اختياري)
      window.location.href = "./index.html"; // غير الصفحة حسب اسم صفحة الدخول عندك
    } catch (err) {
      console.error("Error during logout:", err);
    }
  });
});
