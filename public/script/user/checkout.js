let couponId = null;

// Validation and axios of address
(function () {
  document.querySelector("#place-order-btn").addEventListener("click", (e) => {
    e.preventDefault();

    const data = {};

    const selectedOption = document.querySelector('input[name="pm"]:checked');
    const totalPriceElement = Number(
      document.getElementById(`coupon-th-total`).innerHTML.replace(/[₹,]/g, "")
    );

    if (!selectedOption) {
      return showNotification("Select Payment Method", "red");
    }

    if (
      selectedOption.value === "Cash on Delivery" &&
      totalPriceElement > 1000
    ) {
      return showNotification(
        "Order About 1000 is not applicable for COD!",
        "red"
      );
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

    if (data.paymentMethod === "Razer Pay") {
      axios
        .get(`/api/order/razorpay/create?couponId=${couponId}`)
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
              data.couponId = couponId;

              // Send data using Axios
              axios
                .post("/order/create", data)
                .then(function (res) {
                  if (res.data.status === "success") {
                    window.location.href = res.data.redirectUrl;
                  } else {
                    window.location.href = "http://mohammedminhaj.blog:4000/not-found";
                  }
                })
                .catch(function (error) {
                  console.log(
                    `An error occurred during axios request ${error.message}`
                  );
                });
            },
            modal: {
              ondismiss: function () {
                data.couponId = couponId;
                data.paymentMethod = "Failed Payment";

                axios
                  .post("/order/create", data)
                  .then(function (res) {
                    console.log(res.data);
                    if (res.data.status === "success") {
                      window.location.href = res.data.redirectUrl;
                    } else {
                      window.location.href = "http://mohammedminhaj.blog:4000/not-found";
                    }
                  })
                  .catch(function (error) {
                    console.log(
                      `An error occurred during axios request ${error.message}`
                    );
                  });
              },
            },
            prefille: {
              name: "Customer Name",
              email: "testing@gmail.com",
              contact: "7898778987",
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
      data.couponId = couponId;

      // Send data using Axios
      axios
        .post("/order/create", data)
        .then(function (res) {
          console.log(res.data);
          if (res.data.status === "success") {
            window.location.href = res.data.redirectUrl;
          } else {
            window.location.href = "http://mohammedminhaj.blog:4000/not-found";
          }
        })
        .catch(function (error) {
          console.log(
            `An error occurred during axios request ${error.message}`
          );
        });
    } else if (data.paymentMethod === "Wallet") {
      data.couponId = couponId;

      axios
        .post("/api/checkout/wallet-balance", data)
        .then(function (res) {
          if (res.data.err_message) {
            showNotification(res.data.err_message, "red", "#fff");
            return;
          }

          axios
            .post("/order/create", data)
            .then(function (res) {
              if (res.data.status === "success") {
                window.location.href = res.data.redirectUrl;
              } else {
                window.location.href = "http://mohammedminhaj.blog:4000/not-found";
              }
            })
            .catch(function (error) {
              console.log(
                `An error occurred during creting wallet ${error.message}`
              );
            });
        })
        .catch(function (err) {
          console.log(`error while checking wallet balance: ${err.message}`);
        });
    }
  });
})();

// Apply Coupon
let couponOgAmount = null;
let finalOgAmount = null;
(function () {
  document
    .getElementById("apply-coupon-btn")
    .addEventListener("click", async function () {
      if (this.innerHTML == "Apply") {
        const coupon = document.getElementById("coupon-input").value.trim();
        const err = document.getElementById("coupon-err-msg");

        if (!coupon) {
          return (err.innerHTML = "Enter a valid coupon");
        }

        await axios
          .post("/api/coupon/auth", {
            coupon: coupon,
          })
          .then(function (res) {
            if (res.data.err_message) {
              err.innerHTML = res.data.err_message;
              return Promise.reject();
            }

            updateAmount(res.data.couponResponse);
          })
          .catch(function (err) {
            console.log(`error while sending coupon request: ${err.message}`);
          });
        err.innerHTML = "";
        this.innerHTML = "Remove";
        this.style.backgroundColor = "red";
      } else if (this.innerHTML == "Remove") {
        couponId = null;
        document.getElementById("coupon-td-amount").innerHTML = couponOgAmount;
        document.getElementById("coupon-th-total").innerHTML = finalOgAmount;
        document.getElementById("coupon-input").value = "";
        this.innerHTML = "Apply";
        this.style.backgroundColor = "#1BD31B";
      }
    });

  // update the dom of coupon
  function updateAmount(data) {
    const couponAmount = document.getElementById("coupon-td-amount");
    const finalTotal = document.getElementById("coupon-th-total");
    const shippingAmount = document.getElementById("shipping-td-amount");
    let offerAmount = document.getElementById(`offer-td-amount`).innerHTML;
    couponOgAmount = couponAmount.innerHTML;
    finalOgAmount = finalTotal.innerHTML;

    offerAmount = parseFloat(offerAmount.replace(/[^\d.]/g, ""));

    couponId = data.id;

    couponAmount.innerHTML = `-₹${new Intl.NumberFormat("en-IN").format(
      data.discountPrice
    )}`;

    // console.log(data.couponPrice)
    finalTotal.innerHTML = `₹${new Intl.NumberFormat("en-IN").format(
      Number(data.couponPrice) +
        Number(shippingAmount.innerHTML) -
        (offerAmount || 0)
    )}`;
  }
  // update the dom of coupon

  // updateAmount(data)
})();
// Apply Coupon

// Show notification function
function showNotification(message, bgColor, color) {
  const notification = document.getElementById("notification");

  notification.innerHTML = `<p style="color: #fff;">${message}</p> <button class="close-btn">&times;</button>`;
  notification.style.backgroundColor = bgColor;

  if (color) {
    notification.style.color = color;
  }

  notification.classList.add("show");

  const hideTimeout = setTimeout(() => {
    notification.classList.remove("show");
  }, 3000);

  const closeButton = notification.querySelector(".close-btn");
  closeButton.addEventListener("click", () => {
    clearTimeout(hideTimeout);
    notification.classList.remove("show");
  });
}
// Show notification function

// Zip Code Api
const zipInput = document.getElementById(`zipcode-input`);

if (zipInput) {
  zipInput.addEventListener("input", function () {
    const pin = this.value;

    if (pin.length === 6 && Number(pin)) {
      axios
        .get(`https://api.postalpincode.in/pincode/${pin}`)
        .then(function (res) {
          const [data] = res.data;

          if (data.Status === "Error") {
            return console.log("failed");
          }

          const postOffice = data.PostOffice[0];
          console.log(postOffice);

          document.getElementById("state").value = postOffice.State;
          document.getElementById(`street-address`).value = postOffice.Block;
          document.getElementById(`city-address`).value = postOffice.Region;
        })
        .catch(function (err) {
          console.log(`error while fetching postpincode api: ${err.message}`);
        });
    }
  });
}

// Zip Code Api

// Address Form
const newAddressButtonElement = document.getElementById("new-address-form-btn");

if(newAddressButtonElement) {
  newAddressButtonElement.addEventListener("click", function () {
    document.getElementById("edit-form").style.display = "block";
    document.getElementById("overlay").style.display = "block";
  });

}

document.getElementById("close-form").onclick = function () {
  closeForm();
};

document.getElementById("overlay").onclick = function () {
  closeForm();
};
function closeForm() {
  document.getElementById("edit-form").style.display = "none";
  document.getElementById("overlay").style.display = "none";
}

// Validation and axios of address
(function () {
  document.querySelector("#form-add-btn").addEventListener("click", (e) => {
    e.preventDefault();

    let errorMsg = document.getElementById("error_message");

    errorMsg = "";
    let firstName = document.getElementById("firstName").value.trim();
    let lastName = document.getElementById("lastName").value.trim();
    let address1 = document.getElementById("address1").value.trim();
    let zipcode = document.getElementById("zipcode-input").value.trim();
    let state = document.getElementById("state").value.trim();
    let phone = document.getElementById("phone").value.trim();
    let email = document.getElementById("email").value.trim();

    if (!firstName || !/^[A-Za-z\s]+$/.test(firstName)) {
      errorMsg += "First Name is required and should only contain letters.<br>";
    }
    if (!lastName || !/^[A-Za-z\s]+$/.test(lastName)) {
      errorMsg += "Last Name is required and should only contain letters.<br>";
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

    const data = {
      formData: {
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
      },
    };

    // return;
    // Send data using Axios
    axios
      .post("/api/address/create", data)
      .then(function (res) {

        if (res.data.status === 'Success') {
          injectAddress(res.data.address);
          closeForm();
          console.log('success');
        }

        console.log('failed');
      })
      .catch(function (error) {
        console.log(
          `An error occurred during new address axios request ${error.message}`
        );
      });
  });

  // Validation and axios of address

  // Injecting address
  function injectAddress(data) {

    const label = document.createElement("label");

    label.innerHTML = `
    <div class="address-card-checkout col-xl-1">
    <input
      class="input-radio"
      type="radio"
      name="address"
      value="${ data._id }"
      checked
    />
    <br />
    First Name: ${ data.first_name } <br />
    Last Name : ${ data.last_name } <br />
    Company: ${ data.company } <br />
    Street: ${ data.street } <br />
    Land Mark: ${ data.land_mark } <br />
    Zipcode: ${ data.zipcode } <br />
    City / Town: ${ data.city_town } <br />
    State: ${ data.state } <br />
    Phone Number: ${ data.phone_no } <br />
    Email: ${ data.email }
  </div>
  `;
  
  document.getElementById(`address-body`).appendChild(label);
  }


  // Injecting address
})();
// Address Form
