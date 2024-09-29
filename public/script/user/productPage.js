
function cartAddedPopup() {
  const popup = document.getElementById("cart-popup");
  popup.style.display = "block";

  setTimeout(function () {
    popup.style.display = "none";
  }, 2000);
}

// Add to cart axios
(function () {
  cartForm = document.getElementById("cart-form");

  if (cartForm) {
    cartForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const form = event.target;
      const formData = new FormData(form);

      const data = {};
      formData.forEach((value, key) => {
        data[key] = value;
      });
      data.quantity = document.getElementById("input-value").value;

      axios
        .post("/cart/product/add", data)
        .then((res) => {
          if (res.data.error_message) {
            console.log("failed");
            return popup(res.data.error_message);
          }
          cartAddedPopup();
          const stockCount = document.getElementById("product-stock-count");
          const newStock =
            Number(stockCount.innerHTML.match(/\d+/)[0]) -
            Number(data.quantity);
          stockCount.innerHTML = ` Stock : ${newStock}`;

          console.log(res.data.status);
        })
        .catch((err) => {
          console.log(`Error while sending axios cart request ${err}`);
        });
    });
  }
})();

function popup(error_message) {
  const popup = document.getElementById("popup");
  popup.classList.remove("hidden");
  popup.innerHTML = error_message;
  popup.classList.add("show");

  setTimeout(() => {
    popup.classList.remove("show");
    popup.classList.add("hidden");
  }, 3000);
}

// add to cart button
(function () {
  const cartBtns = document.querySelectorAll(".add-to-cart-btn-btm");
  cartBtns.forEach((button) => {
    button.addEventListener("click", () => {
      const data = {};
      data.id = button.getAttribute("data-id");
      axios
        .post("/cart/product/add", data)
        .then((res) => {
          if (res.data.error_message) {
            console.log("failed");
            return popup(res.data.error_message);
          }
          console.log(res.data.status);
        })
        .catch((err) => {
          console.log(err.message);
        });
    });
  });
})();
// add to cart button
review();

// reviewApi
function review(page = 1){
  const productId = document
  .getElementById(`review-submit-btn`)
  .getAttribute(`data-id`);

  axios.get(`/api/product/review/get?productId=${ productId }&page=${ page }`)
  .then(function(res){

    if(res.data.status === 'Failed'){
      return console.log(`failed`);
    }

    if(res.data.result.status === `Success`){
      return injectReview(res.data.result.data);
    }

  })
  .catch(function(){
    console.log(`error while fetching review data :${err.message}`);
  });

}


function injectReview(data){
  const container = document.getElementById(`reviews-container`);
  container.innerHTML = '';
  console.log(data);  
  data[0].reviews.forEach((val) => {

    const li = document.createElement('li');
    li.innerHTML = `
      <div class="review-heading">
        <h5 class="name">${ val.username }</h5>
        <p class="date">${ new Date( val.updated_at ).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true }).replace(',', '') }</p>
        <div class="review-rating">
        ${ starLoop(Number( val.rating )) }
        </div>
    </div>
    <div class="review-body">
        <p>${ val.comment }</p>
    </div>
    `
    container.appendChild(li);

  });

  function starLoop(n){
    let str = '';
    for(let i = 0; i < n; i++){
      str += `<i class="fa fa-star"></i>`;
    }
    return str;
  }


}

// reviewApi






// Add or edit review form 
document
  .getElementById("add-review-form")
  .addEventListener(`submit`, function (e) {
    e.preventDefault();

    const formData = new FormData(e.target);

    const data = {};

    formData.forEach((value, key) => {
      data[key] = value;
    });

    const errorMessage = document.getElementById("error-message");

    errorMessage.textContent = "";

    data.review = data.review.trim();

    if (!data.review) {
      errorMessage.textContent = "Please enter your review.";
      return;
    }

    if (!data.rating) {
      errorMessage.textContent = "Please select a rating.";
      return;
    }

    data.productId = document
      .getElementById(`review-submit-btn`)
      .getAttribute(`data-id`);

    axios
      .post(`/api/product/review`, data)
      .then(function (res) {
        console.log(res.data);
      })
      .catch(function (err) {
        console.log(`error while fetching data: ${err.message}`);
      });
  });
// Add or edit review form 



