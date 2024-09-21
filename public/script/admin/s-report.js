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

// Summary object
let fieldSummary = {
  totalAmount: 0,
  totalCoupon: 0,
  totalOffer: 0,
};

// Function to inject data in to body
function injectData(value) {
  fieldSummary.totalAmount = 0;
  fieldSummary.totalCoupon = 0;
  fieldSummary.totalOffer = 0;

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
        <td> ${new Intl.NumberFormat("en-IN").format(value.totalPrice)} </td>
        <td> ${value.paymentMethod} </td>
        `;
    body.appendChild(tr);

    fieldSummary.totalAmount += Number(value.totalPrice);
    fieldSummary.totalCoupon += Number(value.coupon || 0);
    fieldSummary.totalOffer += Number(value.offer || 0);
  });

  fieldSummary.totalCount = value.length;
  // Define the order details
  const orderDetails = [
    { description: "Total order count", amount: fieldSummary.totalCount },
    {
      description: "Total order Amount",
      amount: new Intl.NumberFormat("en-IN").format(fieldSummary.totalAmount),
    },
    {
      description: "Total coupon discount",
      amount: new Intl.NumberFormat("en-IN").format(fieldSummary.totalCoupon),
    },
    {
      description: "Total offer discount",
      amount: new Intl.NumberFormat("en-IN").format(fieldSummary.totalOffer),
    },
  ];

  // Iterate through the orderDetails array and generate rows
  orderDetails.forEach((detail) => {
    // Create the row using template literals
    const row = `
    <tr style="background-color: #003366; color: #f0f8ff; border: 'black'">
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td></td>
      <td class="text-right" style="color: #add8e6;"><strong>${detail.description}</strong></td>
      <td class="text-right">${detail.amount}</td>
      <td></td>
    </tr>
  `;

    // Append the row to the tbody
    body.insertAdjacentHTML("beforeend", row);
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

// pdf download using js pdf
function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();

  // Set very small left margin to align the table more to the left
  const margin = { top: 20, left: 2, right: 5 }; // Minimal left margin

  // Add header, center-aligned
  doc.setFontSize(18);
  doc.text("Sales Report", 105, margin.top, { align: "center" });

  // Table headers
  const tableColumn = [
    "SI.NO",
    "Order Id",
    "Billing Name",
    "Date",
    "Coupon",
    "Offer",
    "Total",
    "Payment Method",
  ];

  // Table data
  const tableRows = [];

  fieldData.forEach((val, ind) => {
    const arr = [ind + 1];
    arr.push(`#${val._id}`);
    arr.push(val.billName || "Testing ac");
    arr.push(new Date(val.orderedAt).toLocaleDateString());
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.coupon || 0)}`);
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.offer || 0)}`);
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.totalPrice || 0)}`);
    arr.push(val.paymentMethod);
    tableRows.push(arr);
  });

  // AutoTable with reduced column widths and aligned to the left
  doc.autoTable({
    head: [tableColumn],
    body: tableRows,
    startY: margin.top + 10, // Table starts below the header
    theme: "striped",
    styles: {
      fontSize: 10,
      cellPadding: 2,
      overflow: "linebreak", // Prevent text overflow by wrapping it
    },
    headStyles: {
      fillColor: [22, 160, 133],
      textColor: [255, 255, 255],
    },
    columnStyles: {
      0: { cellWidth: 10 }, // SI.NO
      1: { cellWidth: 30 }, // Order Id
      2: { cellWidth: 35 }, // Billing Name (Reduced)
      3: { cellWidth: 20 }, // Date (Reduced)
      4: { cellWidth: 25 }, // Coupon (Reduced)
      5: { cellWidth: 25 }, // Offer (Reduced)
      6: { cellWidth: 25 }, // Total (Reduced)
      7: { cellWidth: 35 }, // Payment Method (Slightly wider)
    },
    margin: { left: margin.left, right: margin.right }, // Align table close to left margin
  });

  // Get the final Y position after the table ends
  const finalY = doc.lastAutoTable.finalY + 15; // Adjust margin from the table to the footer

  // Footer fields for totals and summary
  const footerFields = [
    { label: "Total Order Count:", value: fieldData.length.toString() },
    {
      label: "Total Order Amount:",
      value: `₹${new Intl.NumberFormat("en-IN").format(
        fieldData.reduce((acc, val) => acc + (val.totalPrice || 0), 0)
      )}`,
    },
    {
      label: "Total Coupon Discount:",
      value: `₹${new Intl.NumberFormat("en-IN").format(
        fieldData.reduce((acc, val) => acc + (val.coupon || 0), 0)
      )}`,
    },
    {
      label: "Total Offer Discount:",
      value: `₹${new Intl.NumberFormat("en-IN").format(
        fieldData.reduce((acc, val) => acc + (val.offer || 0), 0)
      )}`,
    },
  ];

  // Set font size and color for uniformity across all fields
  doc.setFontSize(10);
  doc.setTextColor(40);

  // Left alignment and spacing
  const footerLeftAlignment = 20;
  const lineSpacing = 8;

  // Ensure all text matches the size of "Total Order Count"
  footerFields.forEach((field, index) => {
    const positionY = finalY + index * lineSpacing;
    const text = `${field.label} ${field.value}`;

    // Adjust text size by getting width of the first field ("Total Order Count")
    const totalOrderCountWidth = doc.getTextWidth(
      footerFields[0].label + " " + footerFields[0].value
    );
    const currentTextWidth = doc.getTextWidth(text);

    // Scale the current text if needed (so it stays same size as "Total Order Count")
    if (currentTextWidth > totalOrderCountWidth) {
      doc.setFontSize(10 * (totalOrderCountWidth / currentTextWidth));
    }

    // Draw the text
    doc.text(text, footerLeftAlignment, positionY);

    // Reset font size for consistency
    doc.setFontSize(10);
  });

  // Add dividing line above the footer for clarity
  doc.setLineWidth(0.5);
  doc.line(
    margin.left,
    finalY - 10,
    doc.internal.pageSize.getWidth() - margin.right,
    finalY - 10
  );

  // Save the PDF
  doc.save("sales_report.pdf");
}
// Pdf download with jspdf

// Excel download
function generateExcel() {
  // Define the table headers
  const headers = [
    "SI.NO",
    "Order Id",
    "Billing Name",
    "Date",
    "Coupon",
    "Offer",
    "Total",
    "Payment Method",
  ];

  // Create an array to hold the data rows
  const dataRows = [];

  // Add table rows dynamically
  fieldData.forEach((val, ind) => {
    const arr = [];
    arr.push(ind + 1); // SI.NO
    arr.push(`#${val._id}`); // Order Id
    arr.push(val.billName || "Testing ac"); // Billing Name
    arr.push(new Date(val.orderedAt).toLocaleDateString()); // Date
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.coupon || 0)}`); // Coupon
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.offer || 0)}`); // Offer
    arr.push(`₹${new Intl.NumberFormat("en-IN").format(val.totalPrice || 0)}`); // Total
    arr.push(val.paymentMethod); // Payment Method
    dataRows.push(arr); // Push the row to dataRows array
  });

  // Prepare the final array to include headers and data
  const finalData = [
    ["Sales Report"], // Title row
    [], // Empty row for spacing
    headers, // Header row
    ...dataRows, // Data rows
  ];

  // Calculate summary data
  const totalOrderCount = fieldData.length;
  const totalOrderAmount = fieldData.reduce(
    (acc, val) => acc + (val.totalPrice || 0),
    0
  );
  const totalCouponDiscount = fieldData.reduce(
    (acc, val) => acc + (val.coupon || 0),
    0
  );
  const totalOfferDiscount = fieldData.reduce(
    (acc, val) => acc + (val.offer || 0),
    0
  );

  // Add summary lines to the final data
  finalData.push([]);
  finalData.push([`Total Order Count: ${totalOrderCount}`]);
  finalData.push([
    `Total Order Amount: ₹${new Intl.NumberFormat("en-IN").format(
      totalOrderAmount
    )}`,
  ]);
  finalData.push([
    `Total Coupon Discount: ₹${new Intl.NumberFormat("en-IN").format(
      totalCouponDiscount
    )}`,
  ]);
  finalData.push([
    `Total Offer Discount: ₹${new Intl.NumberFormat("en-IN").format(
      totalOfferDiscount
    )}`,
  ]);

  // Create a new workbook and add the worksheet with the data
  const workbook = XLSX.utils.book_new();
  const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Convert array to sheet

  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(workbook, worksheet, "Sales Report");

  // Generate Excel file and trigger download
  XLSX.writeFile(workbook, "sales_report.xlsx");
}
// Excel download

setTimeout(function () {
  console.log(`This is field data : ${JSON.stringify(fieldData[4])}`);
}, 5000);
