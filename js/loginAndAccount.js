window.onload = function () {
  const token = localStorage.getItem("token");
  if (token) {
    document.querySelector(".account").style.display = "block";
  }
};
