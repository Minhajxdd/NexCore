// Product Chart
(function () {
  // triggering the api on load
  updateProductChart();

  document.querySelectorAll(".product-chart-filter-radio").forEach((radio) => {
    radio.addEventListener("change", function () {

      updateProductChart(this.value);
      
    });
  });

  const data = {
    labels: [],
    datasets: [
      {
        label: "Best Selling Products",
        data: [],
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(255, 159, 64, 0.2)",
          "rgba(255, 205, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(201, 203, 207, 0.2)",
        ],
        borderColor: [
          "rgb(255, 99, 132)",
          "rgb(255, 159, 64)",
          "rgb(255, 205, 86)",
          "rgb(75, 192, 192)",
          "rgb(54, 162, 235)",
          "rgb(153, 102, 255)",
          "rgb(201, 203, 207)",
        ],
        borderWidth: 2,
      },
    ],
  };

  const productChartElement = document.getElementById("product-chart");
  // Creating product chart
  const productChart = new Chart(productChartElement, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  // Creating product chart

  async function updateProductChart(date = "all-time") {
    try {
      const { data: productResponse } = await axios.get(
        `/admin/api/dashboard/product-data?time=${date}`
      );

      if (!productResponse.status) {
        return console.log(`failed`);
      }

      productChart.data.datasets[0].data = productResponse.productData.map(
        (val) => val.quantity
      );

      productChart.data.labels = productResponse.productData.map((val) => {
        return val.productName.length > 10
          ? val.productName.substring(0, 10) + "..."
          : val.productName;
      });

      productChart.update();
      console.log("success");
    } catch (err) {
      console.log(`error while generating best product chart: ${err.message}`);
    }
  }
})();
// Product Chart

// Category Chart
(function () {
  
  document.querySelectorAll(".category-chart-filter-radio").forEach((radio) => {
    radio.addEventListener("change", function () {

      updateCategoryChart(this.value);
      
    });
  });

  const data = {
    labels: [],
    datasets: [
      {
        label: "Best Selling Categories",
        data: [],
        backgroundColor: [
          "rgba(0, 255, 127, 0.2)",
          "rgba(255, 0, 255, 0.2)",
          "rgba(0, 255, 255, 0.2)",
          "rgba(255, 69, 0, 0.2)",
          "rgba(255, 215, 0, 0.2)",
          "rgba(138, 43, 226, 0.2)",
          "rgba(75, 0, 130, 0.2)",
        ],
        borderColor: [
          "rgb(0, 255, 127)",
          "rgb(255, 0, 255)",
          "rgb(0, 255, 255)",
          "rgb(255, 69, 0)",
          "rgb(255, 215, 0)",
          "rgb(138, 43, 226)",
          "rgb(75, 0, 130)",
        ],        
        borderWidth: 2,
      },
    ],
  };

  const categoryChartElement = document.getElementById("category-chart");
  // Creating product chart
  const categoryChart = new Chart(categoryChartElement, {
    type: "bar",
    data: data,
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
  // Creating product chart
  updateCategoryChart();
  async function updateCategoryChart(date = "all-time") {
    try {
      const { data: categoryResponse } = await axios.get(
        `/admin/api/dashboard/category-data?time=${date}`
      );

      if (!categoryResponse.status) {
        return console.log(`failed`);
      }

      categoryChart.data.datasets[0].data = categoryResponse.categoryData.map(
        (val) => val.quantity
      );

      categoryChart.data.labels = categoryResponse.categoryData.map((val) => {
        return val._id.length > 10
          ? val._id.substring(0, 10) + "..."
          : val._id;
      });

      categoryChart.update();
      console.log("success");
    } catch (err) {
      console.log(`error while generating best category chart: ${err.message}`);
    }
  }


})();
// Category Chart

// check the values on reload
window.onload = () => {
  document.getElementById(`all-time-product-radio`).checked = true;
  document.getElementById(`all-time-category-radio`).checked = true;
};
// check the values on reload