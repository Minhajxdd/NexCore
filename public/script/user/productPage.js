
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












let page = 1;

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
        
        if(res.data.status === 'Success'){
          review(page);
          
          document.getElementById('review-submit-btn').innerText = 'EDIT';
          document.getElementById(`review-delete-btn`).style.display = 'inline-block';
          
          return console.log('Sucess');
        }
        console.log('failed');

      })
      .catch(function (err) {
        console.log(`error while fetching data: ${err.message}`);
      });
  });
// Add or edit review form 




// Review Pagenation
document.querySelectorAll('.review-pagenation').forEach((val) => {
  val.addEventListener('click', () => {
    review(val.value);
  })
})
// Review Pagenation

fillTheForm();
// Function to fill the form
function fillTheForm(){

  const productId = document
      .getElementById(`review-submit-btn`)
      .getAttribute(`data-id`);

  axios.post('/api/product/review/get', { productId: productId })
  .then(function(res){
    console.log(res.data);

    if(res.data.status === 'Success'){
      updateReviewForm(res.data.result.reviews[0]);
    }
  })
  .catch(function(err){
    console.log(`error while feching form review: ${err.message}`);
  });
};

// Function to fill the form


// Function to update review form
function updateReviewForm(data){
  document.getElementById(`review-text-area`).value = data.comment;

  document.querySelectorAll('.review-form-stars').forEach((val) => {
    if(val.value == data.rating){
      val.checked = true;
    }
  });
  document.getElementById('review-submit-btn').innerText = 'EDIT';
  document.getElementById(`review-delete-btn`).style.display = 'inline-block';

}
// Function to update review form


// Delete Review
document.getElementById(`review-delete-btn`).addEventListener('click', function(){

  const productId = this
  .getAttribute(`data-id`);


  axios.post('/api/product/review/delete', { productId: productId})
  .then(function(res){
    if(res.data.status == 'Success'){
      review();

     
      document.getElementById(`review-text-area`).value = '';

      document.querySelectorAll('.review-form-stars').forEach((val) => {
        if(val.checked == true){
          val.checked = false;
        }
      });

      document.getElementById('review-submit-btn').innerText = 'Submit';
      document.getElementById(`review-delete-btn`).style.display = 'none';


      return console.log('success');
    }

    console.log('failed');

  })
  .catch(function(err){
    console.log(`error while delete request: ${err.message}`);
  });

});

// Delete Review