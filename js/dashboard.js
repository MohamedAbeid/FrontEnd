import { BASE_URL } from "./base_url.js";

async function fetchStats() {
  try {
    const token = localStorage.getItem("token");

    // جلب عدد المستخدمين
    const usersRes = await fetch(`${BASE_URL}/users`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const usersData = await usersRes.json();
    const usersCount = usersData.results || usersData.data?.length || 0;

    // جلب الطلبات
    const ordersRes = await fetch(`${BASE_URL}/orders`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const ordersData = await ordersRes.json();
    const orders = ordersData.data || [];
    const ordersCount = orders.length;

    // عمليات الدفع بالكاش
    let cashPaymentsCount = 0;
    let cashTotalAmount = 0;

    orders.forEach((order) => {
      if (order.isPaid && order.paymentMethodType === "cash") {
        cashPaymentsCount++;
        cashTotalAmount += order.totalOrderPrice || 0;
      }
    });

    // جلب بيانات عمليات Stripe
    const stripeRes = await fetch(`${BASE_URL}/checkout-session`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const stripeData = await stripeRes.json();
    const stripePayments = stripeData.data || [];
    const stripePaymentsCount = stripePayments.length;

    let stripeTotalAmount = 0;
    stripePayments.forEach((session) => {
      stripeTotalAmount += session.amount_total / 100 || 0; // المبلغ بالسنتات يتحول للجنيه
    });

    // الإجمالي النهائي
    const totalPaymentsCount = cashPaymentsCount + stripePaymentsCount;
    const totalAmount = cashTotalAmount + stripeTotalAmount;

    // عرض البيانات
    document.getElementById("usersCount").textContent = usersCount;
    document.getElementById("ordersCount").textContent = ordersCount;
    document.getElementById("paymentsCount").textContent = totalPaymentsCount;
    document.getElementById("totalAmount").textContent = totalAmount + " جنيه";

    // رسم بياني
    const ctx = document.getElementById("statsChart").getContext("2d");
    new Chart(ctx, {
      type: "bar",
      data: {
        labels: [
          "المستخدمين",
          "الطلبات",
          "دفع كاش",
          "دفع Stripe",
          "إجمالي المبالغ",
        ],
        datasets: [
          {
            label: "إحصائيات",
            data: [
              usersCount,
              ordersCount,
              cashPaymentsCount,
              stripePaymentsCount,
              totalAmount,
            ],
            backgroundColor: [
              "#007bff",
              "#28a745",
              "#ffc107",
              "#17a2b8",
              "#6f42c1",
            ],
            borderRadius: 10,
          },
        ],
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
  } catch (err) {
    console.error("An error occurred while fetching statistics.:", err);
  }
}

fetchStats();
