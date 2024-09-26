// Add New Coupon
document
  .getElementById("add-coupon-form")
  .addEventListener("submit", async (e) => {
    e.preventDefault();


    let errorMessage = "";

    const couponCode = document.getElementById("add-coupon-code").value;
    const discountPrice = document.getElementById("add-discount-price").value;
    const minimumValue = document.getElementById("add-minimum-value").value;
    const expirationDate = document.getElementById("add-expiration-date").value;
    const limit = document.getElementById("add-limit").value;

    if (!couponCode || couponCode.length < 4) {
      errorMessage +=
        "Coupon code should be at least 4 characters long and contain only letters. \n";
    }

    if (isNaN(discountPrice) || discountPrice.trim() === "") {
      errorMessage += "Discount price should be a valid number. \n";
    }

    if (isNaN(minimumValue) || minimumValue.trim() === "") {
      errorMessage += "Minimum value should be a valid number. \n";
    }

    if (!expirationDate) {
      errorMessage += "Expiration date is required. \n";
    }

    if (isNaN(limit) || limit.trim() === "") {
      errorMessage += "Limit should be a valid number. \n";
    }

    const errorElement = document.getElementById("create-form-err-message");
    if (errorMessage) {
      errorElement.innerHTML = errorMessage.replace(/\n/g, "<br>");
      return;
    }

    errorElement.textContent = "";

    const form = e.target.closest("form");
    const formData = new FormData(form);

    const data = {};
    for (let [key, value] of formData.entries()) {
      data[key] = value;
    }

    if (data) {
      data.cpCode = data.cpCode.trim();
    }

    const submitBtn = document.getElementById("add-coupon-submit");
    const formElement = document.getElementById("add-coupon-form");

    await axios
      .post("/admin/api/coupon/add", data)
      .then(function (res) {
        console.log(res.data);
        if (res.data.err_message) {
          console.log("failed");
          return errorElement.innerHTML = res.data.err_message;
        }

        console.log(res.data.status);

        formElement.reset();
        submitBtn.style.display = "none";
        window.location.href = "/admin/coupons";
      })
      .catch(function (err) {
        console.log(
          `error while sending axios request for coupon add : ${err.message}`
        );
      });

  });
// Add New Coupon

// Add Form Cancel
document
  .getElementById("add-coupon-cancel")
  .addEventListener("click", function () {
    const formDiv = document.getElementById("add-coupon-div");
    const form = document.getElementById("add-coupon-form");

    form.reset();
    formDiv.style.display = "none";
  });
// Add Form Cancel


document
  .getElementById("create-new-coupon-btn")
  .addEventListener("click", function () {
    const formDiv = document.getElementById("add-coupon-div");
    formDiv.style.display = "block";
  });

document.getElementById("table-body").addEventListener("click", (e) => {
  // Edit Button Click

  if (e.target.matches("#edit-btn")) {
    const id = e.target.getAttribute("data-id");
    console.log(id);

    const row = e.target.closest("tr");
    if (row) {
      const coupon = row.querySelector("#couponCode-body");
      const discount = row.querySelector("#discount-body");
      const minimum = row.querySelector("#minimum-body");
      const dateElement = row.querySelector("#date-body");
      const limit = row.querySelector("#date-limit");

      const date = new Date(dateElement.getAttribute("value"));

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const formattedDate = `${year}-${month}-${day}`;

      document.getElementById('edit-coupon-id').value = id;

      if (coupon) {
        document.getElementById("edit-coupon-code").value = coupon.textContent;
      }

      if (discount) {
        document.getElementById("edit-discount-price").value = parseInt(
          discount.textContent
        );
      }
      if (minimum) {
        document.getElementById("edit-minimum-value").value = parseInt(
          minimum.textContent
        );
      }
      if (date) {
        document.getElementById("edit-expiration-date").value = formattedDate;
      }
      if (limit) {
        document.getElementById("edit-limit").value = parseInt(
          limit.textContent
        );
      }
    }

    const formDiv = document.getElementById("edit-coupon-div");
    formDiv.style.display = "block";
    return;
    // Edit Button Click
  }
  else if(e.target.matches("#delete-btn")){
    
    const id = e.target.getAttribute('data-id');

    axios.get(`/admin/api/coupon/delete?id=${id}`)
    .then(function(res){

      if(res.data.status === 'success'){
        changeBackground()
      }

    })
    .catch(function(err){
      console.log(`error on axios delete request: ${err.message}`);
    })

    function changeBackground(){
      
    if (e.target.style.backgroundColor === 'red') {
      e.target.innerHTML = 'Enable';
      e.target.style.backgroundColor = '#90EE90';
    } else {
      e.target.innerHTML = 'Delete';
      e.target.style.backgroundColor = 'red';
    }

    }

  }
});

// Edit Form Cancel
document.getElementById('edit-coupon-cancel').addEventListener('click', ()=>{
  const form = document.getElementById('edit-coupon-form');
  const formDiv = document.getElementById('edit-coupon-div');
  form.reset();
  formDiv.style.display = 'none';

})
// Edit Form Cancel



// Edit form submit
document.getElementById('edit-coupon-form').addEventListener('submit', async (e) => {
  e.preventDefault();

  let errorMessage = "";

  const couponCode = document.getElementById("edit-coupon-code").value;
  const discountPrice = document.getElementById("edit-discount-price").value;
  const minimumValue = document.getElementById("edit-minimum-value").value;
  const expirationDate = document.getElementById("edit-expiration-date").value;
  const limit = document.getElementById("edit-limit").value;

  if (!couponCode || couponCode.length < 4) {
    errorMessage +=
      "Coupon code should be at least 4 characters long and contain only letters. \n";
  }

  if (isNaN(discountPrice) || discountPrice.trim() === "") {
    errorMessage += "Discount price should be a valid number. \n";
  }

  if (isNaN(minimumValue) || minimumValue.trim() === "") {
    errorMessage += "Minimum value should be a valid number. \n";
  }

  if (!expirationDate) {
    errorMessage += "Expiration date is required. \n";
  }

  if (isNaN(limit) || limit.trim() === "") {
    errorMessage += "Limit should be a valid number. \n";
  }

  const errorElement = document.getElementById("edit-form-err-message");
  if (errorMessage) {
    errorElement.innerHTML = errorMessage.replace(/\n/g, "<br>");
    return;
  }

  errorElement.textContent = "";


  const form = e.target.closest("form");
  const formData = new FormData(form);

  const data = {};
  for (let [key, value] of formData.entries()) {
    data[key] = value;
  }
  
  await axios.post('/admin/api/coupon/edit', data)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(`error while sending data to edit coupon : ${err.message}`);
  });

  // Replace this when integrating proper xhr doms
  window.location.href = "/admin/coupons";


})
// Edit form submit



