let couponId = null;

// Validation and axios of address
(function () {
  document.querySelector("#place-order-btn").addEventListener("click", (e) => {
    e.preventDefault();

    const data = {};

    const selectedOption = document.querySelector('input[name="pm"]:checked');

    if (!selectedOption) {
      return alert("Select Payment Method");
    }

    data.paymentMethod = selectedOption.value;

    if (document.getElementById("hidden-one").value === "2") {
      let errorMsg = document.getElementById("error_message");

      errorMsg = "";
      let firstName = document.getElementById("firstName").value.trim();
      let lastName = document.getElementById("lastName").value.trim();
      let address1 = document.getElementById("address1").value.trim();
      let zipcode = document.getElementById("zipcode").value.trim();
      let state = document.getElementById("state").value.trim();
      let phone = document.getElementById("phone").value.trim();
      let email = document.getElementById("email").value.trim();

      if (!firstName || !/^[A-Za-z\s]+$/.test(firstName)) {
        errorMsg +=
          "First Name is required and should only contain letters.<br>";
      }
      if (!lastName || !/^[A-Za-z\s]+$/.test(lastName)) {
        errorMsg +=
          "Last Name is required and should only contain letters.<br>";
      }
      if (!address1) {
        errorMsg += "Address is required.<br>";
      }
      if (!zipcode || !/^\d{6}$/.test(zipcode)) {
        errorMsg += "Valid Zipcode is required (6 digits).<br>";
      }
      if (!state || state === "State") {
        errorMsg += "Please select a valid state.<br>";
      }
      if (!phone || !/^\d{10}$/.test(phone)) {
        errorMsg += "Valid Phone Number is required (10 digits).<br>";
      }
      if (
        !email ||
        !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
      ) {
        errorMsg += "Valid Email Address is required.<br>";
      }

      if (errorMsg) {
        return (document.getElementById("error_message").innerHTML = errorMsg);
      }
      document.getElementById("error_message").innerHTML = "";

      data.formData = {
        firstName: firstName,
        lastName: lastName,
        company: address1,
        street: document.getElementById("address2").value.trim(),
        land_mark: document.getElementById("landmark").value.trim(),
        zipcode: zipcode,
        city_town: document.getElementById("city").value.trim(),
        state: state,
        phone_no: phone,
        email: email,
      };

      const optionalMessage = document
        .getElementById("optionalMessage")
        .value.trim();
      if (optionalMessage) {
        data.optionalMessage = optionalMessage;
      }
    } else {
      document.querySelectorAll(".input-radio").forEach((radio) => {
        if (radio.checked) {
          data.addressId = radio.value;
        }
      });

      const optionalMessage = document
        .getElementById("optional-message-single")
        .value.trim();
      if (optionalMessage) {
        data.optionalMessage = optionalMessage;
      }
    }

    if (couponId) {
      data.couponId = couponId;
    }

    if (data.paymentMethod === "Razer Pay") {
      axios
        .get("/api/order/razorpay/create")
        .then(function (res) {
          const options = {
            key: res.data.key_id, // Replace with your Razorpay Test Key
            amount: res.data.amount, // Amount from backend
            currency: res.data.currency,
            name: "Checkout",
            description: "Test payment integration",
            order_id: res.data.id, // Order ID from backend
            handler: async function (response) {
              const paymentData = {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              };

              // Verify payment in backend
              const verifyResponse = await axios.post(
                "/api/order/razorpay/conform",
                paymentData,
                {
                  headers: { "Content-Type": "application/json" },
                }
              );
              const result = verifyResponse.data;

              if (!result.success) {
                return;
              }

              // Send data using Axios
              axios
                .post("/order/create", data)
                .then(function (res) {
                  console.log(res.data);
                  if (res.data.status === "success") {
                    window.location.href = res.data.redirectUrl;
                  } else {
                    window.location.href = "http://localhost:4000/not-found";
                  }
                })
                .catch(function (error) {
                  console.log(
                    `An error occurred during axios request ${error.message}`
                  );
                });
            },
            theme: {
              color: "#3399cc",
            },
          };

          const rzp1 = new Razorpay(options);
          rzp1.open();
        })
        .catch(function (err) {
          console.log(
            `error while razerpay create axios request: ${err.message}`
          );
        });
      return;
    } else if (data.paymentMethod === "Cash on Delivery") {
      // Send data using Axios
      axios
        .post("/order/create", data)
        .then(function (res) {
          console.log(res.data);
          if (res.data.status === "success") {
            window.location.href = res.data.redirectUrl;
          } else {
            window.location.href = "http://localhost:4000/not-found";
          }
        })
        .catch(function (error) {
          console.log(
            `An error occurred during axios request ${error.message}`
          );
        });
    }
  });
})();

// Apply Coupon
document
  .getElementById("apply-coupon-btn")
  .addEventListener("click", function () {
    const coupon = document.getElementById("coupon-input").value.trim();
    const err = document.getElementById("coupon-err-msg");

    if (!coupon) {
      return (err.innerHTML = "Enter a valid coupon");
    }

    axios
      .post("/api/coupon/auth", {
        coupon: coupon,
      })
      .then(function (res) {
        if (res.data.err_message) {
          return (err.innerHTML = res.data.err_message);
        }

        updateAmount(res.data.couponResponse);
      })
      .catch(function (err) {
        console.log(`error while sending coupon request: ${err.message}`);
      });

    err.innerHTML = "";
  });

// update the dom of coupon
function updateAmount(data) {
  const couponAmount = document.getElementById("coupon-td-amount");
  const finalTotal = document.getElementById("coupon-th-total");

  couponId = data.id;

  couponAmount.innerHTML = `-₹${new Intl.NumberFormat("en-IN").format(
    data.discountPrice
  )}`;
  finalTotal.innerHTML = `₹${new Intl.NumberFormat("en-IN").format(
    data.couponPrice
  )}`;
}
// update the dom of coupon

// updateAmount(data)
