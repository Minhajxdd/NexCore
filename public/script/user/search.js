// add to cart button
(function () {
  const cartContainer = document.querySelector("#product-container");
  if (cartContainer) {
    cartContainer.addEventListener("click", (event) => {
      const button = event.target.closest(".add-to-cart-btn");
      const wishlist = event.target.closest(".add-to-wishlist-btn");
      if (button) {
        const data = {};
        data.id = button.getAttribute("data-id");
        axios
          .post("/cart/product/add", data)
          .then((res) => {
            console.log(res.data);
            if (res.data.status === "success") {
              return showPopup("Item added to cart successfully!", "#4CAF50");
            }
            return showPopup(res.data.error_message, "red");
          })
          .catch((err) => {
            console.log(err.message);
          });
      } else if (wishlist) {
        const productId = event.target.getAttribute("data-id");

        axios
          .get(`/api/wishlist/add?productId=${productId}`)
          .then(function (res) {
            if (res.data.status) {
              console.log("success");
              return showPopup(
                "Item added to wishlist successfully!",
                "#4CAF50"
              );
            }
          })
          .catch(function (err) {
            console.log(`error while axios add to wishlist : ${err.message}`);
          });
      }
    });
  }
})();

// add to cart button

// Api request Handler's

let limit = 6;
let page = 1;
let LtH = null;
let minPrice = null;
let maxPrice = null;
let categories = [];

// Category Query On load Search Select
window.onload = function () {
  const queryString = window.location.search;

  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has("category")) {
    const categoryValue = urlParams.get("category");
    if (categoryValue !== "0") {
      // categories.push(categoryValue);
      categories = categoryValue;
    }
    document.getElementById("nav-search-category-select").value = categoryValue;
  }
  filterReqSent(page, limit);
};
// Category Query On load Search Select

// Pagenation Buttons
document.querySelectorAll(".pagenation-btns").forEach((button) => {
  button.addEventListener("click", () => {
    page = button.textContent;

    filterReqSent(page, limit, LtH, minPrice, maxPrice);
  });
});
// Pagenation Buttons

// Show items limit
document
  .getElementById("itemsPerPageSelect")
  .addEventListener("change", function () {
    document.querySelectorAll(".pagenation-btns").forEach((btn) => {
      if (btn.style.backgroundColor === "#D10024") {
        page = btn.textContent;
      }
    });

    // Get the toggle value
    limit = parseInt(itemsPerPageSelect.value);

    // Sent Axios request
    filterReqSent(page, limit, LtH, minPrice, maxPrice);
  });
// Show items limit

// Assign toggle values
export default function assignPrice(min, max) {
  minPrice = min;
  maxPrice = max;
  filterReqSent(page, limit, LtH, minPrice, maxPrice);
}

document.getElementById("itemSortingSelect").addEventListener("change", () => {
  const value = Number(itemSortingSelect.value);
  switch (value) {
    case 1:
      LtH = 1;
      break;
    case 2:
      LtH = 2;
      break;
    default:
      LtH = null;
  }

  filterReqSent(page, limit, LtH, minPrice, maxPrice);
});

document.querySelectorAll(".category-check-boxes").forEach((checkbox) => {
  checkbox.addEventListener("change", () => {
    if (categories.includes(checkbox.value)) {
      categories = categories.filter((item) => item !== checkbox.value);
    } else {
      categories.push(checkbox.value);
    }

    filterReqSent(page, limit, LtH, minPrice, maxPrice);
  });
});

// Pagenation api request
function filterReqSent(
  page,
  limit,
  LtH = null,
  minPrice = null,
  maxPrice = null
) {
  const apiPath = `/api/search`;

  const params = new URLSearchParams(window.location.search);

  // const category = params.get("category");
  const search = params.get("search").replace(/ /g, "+");

  const data = {
    categories: categories,
  };

  axios
    .post(
      `${apiPath}?search=${search}&page=${page}&limit=${limit}&LtH=${LtH}&minp=${minPrice}&maxp=${maxPrice}`,
      data
    )
    .then((res) => {
      // console.log(res.data.result.status);

      if (res.data.result.results.length === 0) {
        return noItems();
      }

      changeProductDetails(res.data.result.results);
    })
    .catch((err) => {
      console.log("error axios request fetching : " + err.message);
    });
}
// Pagenation api request

// Product details injection
function changeProductDetails(data) {
  const container = document.querySelector("#product-container");
  container.innerHTML = "";

  data.forEach((product, index) => {
    const productDiv = document.createElement("div");
    productDiv.classList.add("product-divs", "col-md-4", "col-xs-6");

    if (product.stock > 0) {
      productDiv.innerHTML = `
              <div class="product">
                  <div class="product-img">
                      <img class="prd-img-align" src="/uploads/products/${
                        product.images[0]
                      }" alt="Product Image!!">
                      ${
                        product.offer
                          ? `
                      <div class="product-label">
                        <span class="sale">-${product.offer.discount_percentage}%</span>
                      </div>
                      `
                          : ""
                      }
                  </div>
                  <div class="product-body">
                      <p class="product-category">${product.category_name}</p>
                      <h3 class="product-name"><a href="/product?id=${
                        product._id
                      }">${product.name.substring(0, 40)}...</a></h3>
                      ${
                        product.offer
                          ? `
                      <h4 class="product-price">₹ ${new Intl.NumberFormat(
                        "en-IN"
                      ).format(
                        product.discounted_price -
                          product.discounted_price *
                            (product.offer.discount_percentage / 100)
                      )}
                          <del class="product-old-price">${new Intl.NumberFormat(
                            "en-IN"
                          ).format(product.discounted_price)}</del>
                      </h4> `
                          : `
                      <h4 class="product-price">₹ ${new Intl.NumberFormat(
                        "en-IN"
                      ).format(product.discounted_price)}
                          <del class="product-old-price">${new Intl.NumberFormat(
                            "en-IN"
                          ).format(product.original_price)}</del>
                      </h4> `
                      }
                      <div class="product-btns">
                          <button class="add-to-wishlist">
                              <i class="fa-regular fa-heart add-to-wishlist-btn" data-id="${
                                product._id
                              }"></i>
                              <span class="tooltipp">add to wishlist</span>
                          </button>
                          <button class="quick-view">
                              <a href="/product?id=${
                                product._id
                              }" target="_blank">
                                  <i class="fa fa-eye"></i>
                              </a>
                              <span class="tooltipp">quick view</span>
                          </button>
                      </div>
                  </div>
                  <div class="add-to-cart">
                      <button class="add-to-cart-btn" data-id="${
                        product._id
                      }"><i class="fa fa-shopping-cart"></i> add to cart</button>
                  </div>
              </div>
          `;
    } else {
      productDiv.innerHTML = `
     
      <div class="product out-of-stock-product">
          <div class="product-img">
              <img class='prd-img-align' src="/uploads/products/${
                        product.images[0]
                      }" alt="Out of stock image">
              ${
                  product.offer
                    ? `
                <div class="product-label">
                  <span class="sale">-${product.offer.discount_percentage}%</span>
                </div>
                `
                    : ""
                }
              <div class="out-of-stock-overlay">
                  <p class="out-of-stock-text">Out of Stock</p>
              </div>
          </div>
          <div class="product-body">
              <p class="product-category">${product.category_name}</p>
              <h3 class="product-name">
                  <a href="/product?id=${
                        product._id
                      }">${product.name.substring(0, 40)}...</a>
              </h3>
${
                product.offer
                  ? `
              <h4 class="product-price">₹ ${new Intl.NumberFormat(
                "en-IN"
              ).format(
                product.discounted_price -
                  product.discounted_price *
                    (product.offer.discount_percentage / 100)
              )}
                  <del class="product-old-price">${new Intl.NumberFormat(
                    "en-IN"
                  ).format(product.discounted_price)}</del>
              </h4> `
                  : `
              <h4 class="product-price">₹ ${new Intl.NumberFormat(
                "en-IN"
              ).format(product.discounted_price)}
                  <del class="product-old-price">${new Intl.NumberFormat(
                    "en-IN"
                  ).format(product.original_price)}</del>
              </h4> `
              }
             
              <div class="product-btns">
                  <button class="add-to-wishlist add-to-wishlist-btn" data-id="${
                                product._id
                              }">
                      <i class="fa-regular fa-heart"></i>
                      <span class="tooltipp">add to wishlist</span>
                  </button>
                  <button class="quick-view add-to-wishlist-btn" data-id="<%= val._id %>">
                    <a href="/product?id=${
                      product._id
                    }" target="_blank">
                        <i class="fa fa-eye"></i>
                    </a>
                    <span class="tooltipp">quick view</span>

                  </button>
              </div>
          </div>
          <div class="add-to-cart">
              <button class="add-to-cart-btn out-of-stock-btn" disabled>
                  <i class="fa fa-ban"></i> Out of Stock
              </button>
          </div>
      </div>
 
      `;
    }

    container.appendChild(productDiv);
  });
}
// Product details injection

// Item Not Found
function noItems() {
  const container = document.querySelector("#product-container");
  container.innerHTML = "";

  const notFoundDiv = document.createElement("div");

  notFoundDiv.innerHTML = `
    <div class="container">
        <div class="item-not-found">
            <i class="fa fa-exclamation-circle" aria-hidden="true"></i>
            <h2>Item Not Found</h2>
            <p>Sorry, we couldn't find the item you're looking for.</p>
        </div>
    </div>
    `;
  container.appendChild(notFoundDiv);
}

// Item Not Found

// Pagenation button color change
document.querySelectorAll(".pagenation-btns").forEach((button) => {
  button.addEventListener("click", () => {
    document
      .querySelectorAll(".pagenation-btns")
      .forEach((btn) => (btn.style.backgroundColor = "white"));
    button.style.backgroundColor = "#D10024";
  });
});
// Pagenation button color change

// Wishlist Popup
function showPopup(msg, color) {
  const popup = document.getElementById("popup-wishlist");
  popup.innerHTML = msg;
  popup.classList.add("show");
  popup.style.backgroundColor = color;

  // Hide after 2 seconds
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}
// Wishlist Popup
