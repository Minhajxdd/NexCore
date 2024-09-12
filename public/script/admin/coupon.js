document.getElementById("add-coupon-form").addEventListener("submit", (e) => {
  e.preventDefault();

  let errorMessage = "";

  const couponCode = document.getElementById("add-coupon-code").value;
  const discountPrice = document.getElementById("add-discount-price").value;
  const minimumValue = document.getElementById("add-minimum-value").value;
  const expirationDate = document.getElementById("add-expiration-date").value;
  const limit = document.getElementById("add-limit").value;

  if (!couponCode || couponCode.length < 4) {
    errorMessage +=
      "Coupon code should be at least 4 characters long and contain only letters. ";
  }

  if (isNaN(discountPrice) || discountPrice.trim() === "") {
    errorMessage += "Discount price should be a valid number. ";
  }

  if (isNaN(minimumValue) || minimumValue.trim() === "") {
    errorMessage += "Minimum value should be a valid number. ";
  }

  if (!expirationDate) {
    errorMessage += "Expiration date is required. ";
  }

  if (isNaN(limit) || limit.trim() === "") {
    errorMessage += "Limit should be a valid number. ";
  }

  const errorElement = document.getElementById("create-form-err-message");
  if (errorMessage) {
    errorElement.textContent = errorMessage;
    return;
  }

  errorElement.textContent = "";

  const form = e.target.closest("form");
  const formData = new FormData(form);

  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }

  if(data){
    data.cpCode = data.cpCode.trim();
  }

  const submitBtn = document.getElementById('add-coupon-submit');
  const formElement = document.getElementById('add-coupon-form');

  axios
    .post("/admin/api/coupon/add", data)
    .then(function (res) {
      if (res.data.err_message) {
        console.log("failed");
        return (errorElement.innerHTML = res.data.err_message);
      }

      console.log(res.data.status);
      
      formElement.reset();
      submitBtn.style.display = 'none';

    })
    .catch(function (err) {
      console.log(
        `error while sending axios request for coupon add : ${err.message}`
      );
    });
});


document.getElementById('add-coupon-cancel').addEventListener('click', function(){
    const formDiv = document.getElementById('add-coupon-div');
    const form = document.getElementById('add-coupon-form');

    form.reset();
    formDiv.style.display = 'none';
});

document.getElementById('create-new-coupon-btn').addEventListener('click', function(){
    const formDiv = document.getElementById('add-coupon-div');
    formDiv.style.display = 'block';
});