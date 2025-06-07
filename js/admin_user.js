window.addEventListener("DOMContentLoaded", function () {
  const role = (localStorage.getItem("role") || "").toLowerCase().trim();

  const navElement = document.querySelector("nav.left_side ul");

  if (navElement) {
    if (role === "admin" || role === "manager") {
      navElement.innerHTML = `
                <li><a href="./MyAccount.html">My profile</a></li>

          <li><a href="./category.html">Category</a></li>
          <li><a href="./coupon.html">Coupon</a></li>
          <li><a href="./AddProduct.html">Add Product</a></li>
          <li><a href="./product.html">Mange Product</a></li>
        `;
    } else {
      navElement.innerHTML = `
          <li><a href="./MyAccount.html">My profile</a></li>
          <li><a href="./MyAddress.html">My Address</a></li>
          <li><a href="./MyAccount.html">My Wishlist</a></li>
          <li><a href="./MyAccount.html">My Order</a></li>
        `;
    }
  } else {
    console.warn("nav.left_side ul not found!");
  }
});
