(function () {
  const parentElement = document.getElementById("table-body");

  parentElement.addEventListener("change", function (event) {
    // Check if the target is the dropdown
    if (event.target.classList.contains("order-status-dropdown")) {
      const dropDown = event.target;

      // Prepare data for the Axios request
      const data = {
        status: dropDown.value,
        id: dropDown.getAttribute("data-id"),
      };

      // Send Axios POST request to update status
      axios
        .post(`/admin/api/orders/status-update`, data)
        .then(function (res) {
          // On successful status update, update the dropdown options
          updateOptions(dropDown, dropDown.value);
        })
        .catch(function (err) {
          console.log(
            `Error while sending axios request for status update: ${err.message}`
          );
        });
    }
  });

  // More details
  parentElement.addEventListener("click", function (event) {
    if (
      event.target &&
      event.target.classList.contains("more-details-btn-green")
    ) {
      const data = {
        orderId: event.target.value,
      };

      axios
        .post(`/admin/api/order/details`, data)
        .then(function (res) {
          if (!res.data.status) {
            return console.log("failed");
          }
          console.log("succes");

          updateOrderDetails(res.data.data);
        })
        .catch(function (err) {
          console.log(`error while fetching data: ${err.message}`);
        });

      $("#orderDetailsModal").modal("show");

      $(".close-popup").on("click", function () {
        $("#orderDetailsModal").modal("hide");
      });

      $("#modal-close-btn").on("click", function () {
        $("#orderDetailsModal").modal("hide");
      });
    }
  });
  // More details

  function updateOrderDetails(data) {
    const tbody = document.getElementById("pop-up-details-body");

    tbody.innerHTML = "";

    data.productsDetail.forEach((product, indx) => {
      const tr = document.createElement("tr");

      tr.innerHTML = `
        <tr>
          <td>${product.name.substring(0, 30)}...</td>
          <td><img src="/uploads/products/${
            product.images[0]
          }" style="height: 50px; width: 50px;" alt="Product Image"></td>
          <td>${data.products[indx].quantity}</td>
          <td>₹${new Intl.NumberFormat("en-IN").format(
            product.discounted_price
          )}</td>
          <td>₹${new Intl.NumberFormat("en-IN").format(
            product.discounted_price * data.products[indx].quantity
          )}</td>
      </tr>
      `;
      tbody.appendChild(tr);
    });

    document.getElementById(
      `order-details-coupon`
    ).innerHTML = ` ₹${new Intl.NumberFormat("en-IN").format(
      data.coupon || 0
    )}`;
    document.getElementById(
      `order-details-offer`
    ).innerHTML = ` ₹${new Intl.NumberFormat("en-IN").format(data.offer || 0)}`;
    document.getElementById(
      `order-details-delivery`
    ).innerHTML = ` ₹${new Intl.NumberFormat("en-IN").format(
      calculateShipping(data.totalPrice)
    )}`;
    document.getElementById(
      `order-total-price`
    ).innerHTML = ` ₹${new Intl.NumberFormat("en-IN").format(
      data.totalPrice || 0
    )}`;
    document.getElementById(`order-details-payment-method`).innerHTML =
      data.paymentMethod;
    document.getElementById(`order-details-order-status`).innerHTML =
      data.orderStatus;

      console.log(data);

      $('#order-details-address-first-name').html(` ${data.address.first_name}`);
      $('#order-details-address-last-name').html(` ${data.address.last_name}`);
      $('#order-details-address-company').html(` ${data.address.company}`);
      $('#order-total-address-land-mark').html(` ${data.address.land_mark}`);
      $('#order-total-address-city').html(` ${data.address.city_town}`);
      $('#order-total-address-state').html(` ${data.address.state}`);
      $('#order-total-address-zip').html(` ${data.address.zipcode}`);
      $('#order-total-address-phone').html(` ${data.address.phone_no}`);
      $('#order-total-address-email').html(` ${data.address.email}`); 

  }

  // Calculate Shipping
  function calculateShipping(price) {
    if (price < 1000) {
      return 50;
    } else if (price > 1000 && price <= 10000) {
      return 200;
    } else {
      return 0;
    }
  }
  // Calculate Shipping

  function updateOptions(dropDown, selectedStatus) {
    dropDown.innerHTML = "";

    let optionList = [];

    if (selectedStatus === "pending") {
      optionList = [
        { value: "pending", text: "pending", selected: true },
        { value: "cancelled", text: "cancelled" },
        { value: "processed", text: "processed" },
        { value: "shipped", text: "shipped" },
        { value: "delivered", text: "delivered" },
      ];
    } else if (selectedStatus === "processed") {
      optionList = [
        { value: "cancelled", text: "cancelled" },
        { value: "processed", text: "processed", selected: true },
        { value: "shipped", text: "shipped" },
        { value: "delivered", text: "delivered" },
      ];
    } else if (selectedStatus === "shipped") {
      optionList = [
        { value: "cancelled", text: "cancelled" },
        { value: "shipped", text: "shipped", selected: true },
        { value: "delivered", text: "delivered" },
      ];
    } else if (selectedStatus === "delivered") {
      optionList = [
        { value: "delivered", text: "delivered", selected: true },
        { value: "returned", text: "returned" },
      ];
    } else if (selectedStatus === "cancelled") {
      optionList = [{ value: "cancelled", text: "cancelled", selected: true }];
    } else if (selectedStatus === "returned") {
      optionList = [{ value: "returned", text: "returned", selected: true }];
    }

    optionList.forEach(function (optionData) {
      const option = document.createElement("option");
      option.value = optionData.value;
      option.textContent = optionData.text;
      if (optionData.selected) {
        option.selected = true;
      }
      dropDown.appendChild(option);
    });
  }
})();

function togglePopup() {
  const popup = document.getElementById("messagePopup");
  popup.style.display = popup.style.display === "block" ? "none" : "block";
}

// Close the popup if clicking outside of it
window.onclick = function (event) {
  const popup = document.getElementById("messagePopup");
  if (
    event.target !== popup &&
    !popup.contains(event.target) &&
    event.target !== document.querySelector(".fa-envelope")
  ) {
    popup.style.display = "none";
  }
};

// Return request div
document.getElementById("messagePopup").addEventListener("click", async (e) => {
  // Return request accept
  if (e.target.classList.contains("return-accept")) {
    const id = e.target.getAttribute("data-id");

    const data = { id };
    await axios
      .post("/admin/api/orders/return/accept", data)
      .then(function (res) {
        if (!res.data.status) {
          return console.log("failed");
        }

        console.log("success");
        removeRequest();
      })
      .catch(function (err) {
        console.log(
          `error while sending accept reqeust axios : ${err.message}`
        );
      });

    const dropDown = document.getElementById(id);

    dropDown.value = "returned";
    document.getElementById("return-delivery-option").style.display = "none";
    // Return request accept
  } else if (e.target.classList.contains("return-reject")) {
    // Return request reject
    const id = e.target.getAttribute("data-id");

    const data = { id };
    await axios
      .post("/admin/api/orders/return/reject", data)
      .then(function (res) {
        if (!res.data.status) {
          return console.log("failed");
        }

        console.log("success");
        removeRequest();
      })
      .catch(function (err) {
        console.log(
          `error while sending accept reqeust axios : ${err.message}`
        );
      });
    // Return request reject
  }

  function removeRequest() {
    const order = e.target.closest(".order");
    order.style.display = "none";
    const counteElement = document.getElementById("messageCounter-return");
    let count = Number(counteElement.innerHTML);
    if (!isNaN(count) && count > 0) {
      counteElement.innerHTML = --count;
    }
  }
});
// Return request div

// Update the message counter
document.getElementById("messageCounter-return").innerHTML =
  document.getElementById("HiddenMessageCountReview").innerHTML;
// Update the message counter
