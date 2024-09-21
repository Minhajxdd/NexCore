let fieldData = null;
// Sort by date
document.getElementById("sort-date").addEventListener("change", function () {

  // Custom Drop Toggle Date
  if (this.value === "custom") {
    document.getElementById("custom-date-div").style.display = "flex";
    return;
  } else {
    document.getElementById("custom-date-div").style.display = "none";
  }

  const data = {
    by: this.value,
  };

  axios
    .post(`/admin/api/sales-report`, data)
    .then(function (res) {
      if (!res.data.status) {
        return console.log("failed");
      }
      injectData(res.data.data);
      fieldData = res.data.data;
      console.log("success");
    })
    .catch(function (err) {
      console.log(`error while fetching api data : ${err.message}`);
    });
});

// Sort by date

// Generate custom date
document
  .getElementById("generate-custom-btn")
  .addEventListener("click", function () {
    const startDate = document.getElementById("start-date").value;
    const endDate = document.getElementById("end-date").value;

    if (!startDate || !endDate) {
      alert("Please select both start and end dates.");
      return;
    }

    if (new Date(startDate) > new Date(endDate)) {
      alert("End date must be after the start date.");
      return;
    }
    const data = {
      by: "custom",
      sDate: startDate,
      eDate: endDate,
    };

    axios
      .post(`/admin/api/sales-report`, data)
      .then(function (res) {
        if (!res.data.status) {
          return console.log("failed");
        }
        injectData(res.data.data);
        fieldData = res.data.data;
        console.log("success");
      })
      .catch(function (err) {
        console.log(`error while fetching api data : ${err.message}`);
      });
  });
// Generate custom date

// Function to inject data in to body
function injectData(value) {
  const body = document.getElementById("table-body");
  body.innerHTML = "";
  value.forEach((value, indx) => {
    const tr = document.createElement("tr");

    tr.innerHTML = `
        <td>${indx + 1}</td>
        <td>
        #${value._id}
        </td>
        <td> ${value.billName ? value.billName : "Testing"} </td>
        <td> ${new Date(value.orderedAt)
          .toLocaleDateString("en-GB")
          .replace(/\//g, "/")} </td>
        <td> ${value.coupon ? value.coupon : "0.00"} </td>
        <td> ${value.offer ? value.offer : "0.00"} </td>
        <td> ${value.totalPrice} </td>
        <td> ${value.paymentMethod} </td>
        `;
    body.appendChild(tr);
  });
}
// Function to inject data in to body

// Reset Form
window.onload = function () {
  document.getElementById("sort-date").value = "all";

  axios
    .post(`/admin/api/sales-report`, { by: "all" })
    .then(function (res) {
      if (!res.data.status) { 
        return console.log("failed");
      }
      injectData(res.data.data);
      fieldData = res.data.data;
      console.log("success");
    })
    .catch(function (err) {
      console.log(`error while fetching api data : ${err.message}`);
    });
};
// Reset Form

setTimeout(function(){
  console.log(`This is field data : ${JSON.stringify(fieldData[0])}`);
},5000)