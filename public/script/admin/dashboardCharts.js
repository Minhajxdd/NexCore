// Product Chart
(function () {
  // triggering the api on load
  window.onload = () => {
    updateProductChart();
    document.getElementById(`all-time-product-radio`).checked = true;
  }
  
  
  document.querySelectorAll(".product-chart-filter-radio").forEach((radio) => {
    radio.addEventListener("click", function () {
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

  async function updateProductChart(date = 'all-time') {
    try {
      const { data: productResponse } = await axios.get(
        `/admin/api/dashboard/product-data?time=${date}`
      );

      if (!productResponse.status) {
        return console.log(`failed`);
      }
      
      productChart.data.datasets[0].data = productResponse.productData.map((val) => val.quantity);

      productChart.data.labels = 
      productResponse.productData.map((val) => {
        return val.productName.length > 10
          ? val.productName.substring(0, 10) + "..."
          : val.productName;
      });  

      productChart.update();
      console.log('success');
    } catch (err) {
      console.log(`error while genrating best product chart: ${err.message}`);
    }
  }
})();
// Product Chart
