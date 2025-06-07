// دالة لتغيير الوضع
function toggleMode() {
  document.body.classList.toggle("dark-mode");

  // حفظ الحالة في localStorage
  if (document.body.classList.contains("dark-mode")) {
    localStorage.setItem("mode", "dark");
  } else {
    localStorage.setItem("mode", "light");
  }
}

// تطبيق الوضع عند تحميل الصفحة
window.onload = function () {
  const mode = localStorage.getItem("mode");
  if (mode === "dark") {
    document.body.classList.add("dark-mode");
  } else {
    document.body.classList.remove("dark-mode");
  }
};

// اختيار عناصر DOM
const scrollContainer = document.querySelector(".today .scroll"); // قسم المنتجات في Flash Sales
const leftArrow = document.querySelector(".today .icon img:nth-child(1)"); // السهم الأيسر
const rightArrow = document.querySelector(".today .icon img:nth-child(2)"); // السهم الأيمن

// مقدار التمرير (يمكنك تعديله حسب الحجم المناسب)
const scrollAmount = 300;

// وظيفة التمرير لليمين
rightArrow.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: scrollAmount,
    behavior: "smooth", // تأثير التمرير السلس
  });
});

// وظيفة التمرير لليسار
leftArrow.addEventListener("click", () => {
  scrollContainer.scrollBy({
    left: -scrollAmount,
    behavior: "smooth", // تأثير التمرير السلس
  });
});

// First timer
function updateCountdown() {
  const dayDisplay = document.getElementById("Days");
  const hoursDisplay = document.getElementById("Hours");
  const minutesDisplay = document.getElementById("Minutes");
  const secondsDisplay = document.getElementById("Seconds");

  const targetDate = new Date("April 20, 2025 00:00:00"); // Set your target date here
  const now = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = targetDate - now;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format and display the countdown
  dayDisplay.textContent = `${days}`;
  hoursDisplay.textContent = hours.toString().padStart(2, "0");
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");

  // If the countdown is finished, display a message
  if (timeDifference <= 0) {
    clearInterval(countdownInterval);
    dayDisplay.textContent = "Countdown finished!";
    hoursDisplay.textContent = "";
    minutesDisplay.textContent = "";
    secondsDisplay.textContent = "";
  }
}
// Call the function to set the initial countdown
updateCountdown();
// Update the countdown every second
const countdownInterval = setInterval(updateCountdown, 1000);

// Second Timer
function updateCountdownSecond() {
  const dayDisplay = document.getElementById("day");
  const hoursDisplay = document.getElementById("hour");
  const minutesDisplay = document.getElementById("min");
  const secondsDisplay = document.getElementById("second");

  const targetDate = new Date("April 18, 2025 00:00:00"); // Set your target date here
  const now = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = targetDate - now;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format and display the countdown
  dayDisplay.textContent = `${days}`;
  hoursDisplay.textContent = hours.toString().padStart(2, "0");
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");

  // If the countdown is finished, display a message
  if (timeDifference <= 0) {
    clearInterval(countdownIntervall);
    dayDisplay.textContent = "Countdown finished!";
    hoursDisplay.textContent = "";
    minutesDisplay.textContent = "";
    secondsDisplay.textContent = "";
  }
}
// Call the function to set the initial countdown
updateCountdownSecond();
// Update the countdown every second
const countdownIntervall = setInterval(updateCountdownSecond, 1000);

// Second Timer
function updateCountdownSecondd() {
  const dayDisplay = document.getElementById("dayy");
  const hoursDisplay = document.getElementById("hourr");
  const minutesDisplay = document.getElementById("minn");
  const secondsDisplay = document.getElementById("secondd");

  const targetDate = new Date("April 20, 2025 00:00:00"); // Set your target date here
  const now = new Date();

  // Calculate the difference in milliseconds
  const timeDifference = targetDate - now;

  // Calculate days, hours, minutes, and seconds
  const days = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDifference % (1000 * 60)) / 1000);

  // Format and display the countdown
  dayDisplay.textContent = `${days}`;
  hoursDisplay.textContent = hours.toString().padStart(2, "0");
  minutesDisplay.textContent = minutes.toString().padStart(2, "0");
  secondsDisplay.textContent = seconds.toString().padStart(2, "0");

  // If the countdown is finished, display a message
  if (timeDifference <= 0) {
    clearInterval(countdownIntervalll);
    dayDisplay.textContent = "Countdown finished!";
    hoursDisplay.textContent = "";
    minutesDisplay.textContent = "";
    secondsDisplay.textContent = "";
  }
}
// Call the function to set the initial countdown
updateCountdownSecondd();
// Update the countdown every second
const countdownIntervalll = setInterval(updateCountdownSecondd, 1000);

let currentSlide = 0;
const slides = document.querySelectorAll(".slide");
const totalSlides = slides.length;

function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.remove("active");
    if (i === index) {
      slide.classList.add("active");
    }
  });
}

function nextSlide() {
  currentSlide = (currentSlide + 1) % totalSlides;
  showSlide(currentSlide);
}

setInterval(nextSlide, 4000); // تغيير الصورة كل 10 ثوانٍ

// عرض الشريحة الأولى عند التحميل
showSlide(currentSlide);

// المسئولة عن اضهار الايقونة بتاع المستخدم
