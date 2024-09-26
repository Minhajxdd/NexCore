const cancel = document.getElementById("order-cancel");
if (cancel) {
  cancel.addEventListener("click", function () {
    const popupContainer = document.getElementById("popupContainer");
    const yesBtn = document.getElementById("yesBtn-cancel");
    const noBtn = document.getElementById("noBtn-cancel");
    const statusBar = document.getElementById("progress-bar-div");

    popupContainer.classList.remove("hidden");

    yesBtn.addEventListener("click", () => {
      const id = cancel.value;

      if (!id) return console.log("Something went wrong");

      axios
        .get(`/api/orders/cancel?id=${id}`)
        .then((res) => {
          console.log(res.data);
          if (res.data.orderStatus === "cancelled") {
            updateStatusBar("cancelled");
          }
        })
        .catch((err) => {
          console.log(
            `error while axios order cancel request : ${err.message}`
          );
        });

      statusBar.style.width = "0%";
      popupContainer.classList.add("hidden");
      cancel.style.display = "none";
    });

    noBtn.addEventListener("click", () => {
      popupContainer.classList.add("hidden");
    });
  });
}

const returnBtn = document.getElementById("order-return");
if (returnBtn) {
  returnBtn.addEventListener("click", function () {
    const popupContainer = document.getElementById("popupReturnContainer");
    const yesBtn = document.getElementById("yesBtn-return");
    const noBtn = document.getElementById("noBtn-return");
    const statusBar = document.getElementById("progress-bar-div");

    popupContainer.classList.remove("hidden");

    yesBtn.addEventListener("click", () => {
      const reasonSelect = document.getElementById("reasonSelect").value;
      const noteInput = document.getElementById("noteInput").value;

      const id = returnBtn.value;

      if (!id) return console.log("Something went wrong");

      if (!reasonSelect) return alert("Provide any reason");

      const data = {
        id: id,
        reason: reasonSelect,
      };

      if (noteInput.trim()) {
        data.note = noteInput.trim();
      }

      axios
        .post(`/api/orders/return`, data)
        .then((res) => {
          if (!res.data.status) {
            return console.log("failed");
          }
          console.log("success");
          const msg = "Return Requested";
          updateStatusBar(msg);
          statusBar.style.width = "50%";
          popupContainer.classList.add("hidden");
          returnBtn.style.display = "none";
        })
        .catch((err) => {
          console.log(
            `error while axios order return request : ${err.message}`
          );
        });
    });

    noBtn.addEventListener("click", () => {
      popupContainer.classList.add("hidden");
    });
  });
}

function updateStatusBar(status) {
  document.getElementById("status-bar").innerHTML = status;
}



// Invoice Download
document
  .getElementById("invoice-download-btn")
  .addEventListener("click", function () {
    const id = this.value;

    axios(`/api/orders/invoice/data?id=${id}`)
      .then((res) => {
        if (!res.data.status) {
          return console.log(`Something went wrong`);
        }

        downloadPdf(res.data.data);
      })
      .catch((err) => {
        console.log(`error while downloading invoice: ${err.message}`);
      });

    function downloadPdf(data) {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();

      doc.setFontSize(18);
      doc.text("NexCore Pvt.Ltd", 14, 20);
      doc.setFontSize(12);
      doc.text("123 Company Address", 14, 30);
      doc.text("Kozhikode, Kerala, 673001", 14, 35);
      doc.text("Phone: (555) 555-5555", 14, 40);
      doc.text("Email: nexcore.ecommerce@gmail.com", 14, 45);

      // Invoice Title
      doc.setFontSize(20);
      doc.text("INVOICE", 160, 20);

      // Invoice Date and Number
      doc.setFontSize(12);
      doc.text("Order Number:", 153, 40);
      doc.setFontSize(10);
      doc.text(`#${data.orders._id}`, 153, 45);

      const originalDate = new Date(data.orders.orderedAt);

      originalDate.setDate(originalDate.getDate() + 1);

      doc.text(`Date: ${originalDate.toISOString().split("T")[0]}`, 153, 50);

      // Billing Information
      doc.setFontSize(14);
      doc.text("Bill To:", 14, 60);

      // Temporary hardcoded values for the billing address fields

      const billingDetails = {
        fullName: `${data.address.first_name} ${data.address.last_name}`,
        company: data.address.company,
        street: data.address.street,
        landmark: data.address.land_mark,
        city: data.address.city_town,
        state: data.address.state,
        zipCode: data.address.zipcode,
        phone: data.address.phone_no,
        email: data.address.email,
      };

      doc.setFontSize(12);
      doc.text(`Full Name: ${billingDetails.fullName}`, 14, 70);
      doc.text(`Company: ${billingDetails.company}`, 14, 75);
      doc.text(`Street: ${billingDetails.street}`, 14, 80);
      doc.text(`Landmark: ${billingDetails.landmark}`, 14, 85);
      doc.text(`City/Town: ${billingDetails.city}`, 14, 90);
      doc.text(`State: ${billingDetails.state}`, 14, 95);
      doc.text(`Zip Code: ${billingDetails.zipCode}`, 14, 100);
      doc.text(`Phone No: ${billingDetails.phone}`, 14, 105);
      doc.text(`Email: ${billingDetails.email}`, 14, 110);

      // Table for Invoice Items
      const tableColumn = ["Item", "Quantity", "Price", "Total"];
      const tableRows = [];

      // Hardcoded items array (replace with dynamic data later)
      const items = [
        { item: "Product 1", quantity: 2, price: 50 },
        { item: "Product 2", quantity: 1, price: 100 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
        { item: "Product 3", quantity: 3, price: 30 },
      ];
      console.log(data);
      let grandTotal = 0;

      // Loop through items and prepare table rows dynamically
      data.orders.products.forEach((item, indx) => {
        const total = item.quantity * data.products[indx].discounted_price;
        grandTotal += total;
        // Push each item's data into tableRows
        tableRows.push([
          data.products[indx].name,
          item.quantity,
          new Intl.NumberFormat("en-IN").format(
            data.products[indx].discounted_price
          ),
          new Intl.NumberFormat("en-IN").format(total),
        ]);
      });

      // Generate the table
      doc.autoTable({
        head: [tableColumn],
        body: tableRows,
        startY: 120, // Starting Y position for the table
        theme: "grid",
        headStyles: { fillColor: [2, 120, 133] },
        margin: { top: 10 },
        columnStyles: {
          2: { cellWidth: 30 }, // Increasing width for Price column (index 2)
          3: { cellWidth: 30 }, // Increasing width for Total column (index 3)
        },
      });

      // Subtotal, Delivery Charge, Coupon, and Total
      let yPosition = doc.lastAutoTable.finalY + 10;

      // Subtotal
      doc.text("Subtotal", 130, yPosition);
      doc.text(grandTotal.toFixed(2), 170, yPosition);

      // Delivery Charge (you can change the value as needed)
      let deliveryCharge = 0; // Example: ₹50 delivery charge
      doc.text("Delivery Charge", 130, yPosition + 10);
      doc.text(deliveryCharge.toFixed(2), 170, yPosition + 10);

      // Calculate total after adding delivery charge
      let totalWithDelivery = grandTotal + deliveryCharge;

      // Optional Coupon
      let couponDiscount = 0; // Default coupon discount is 0

      // Assuming data.coupon holds coupon information
      if (data.coupon && data.coupon.isApplied) {
        couponDiscount = data.coupon.discountAmount || 0; // Example: Coupon discount amount from data
        doc.text(`Coupon (${data.coupon.code})`, 130, yPosition + 20);
        doc.text(couponDiscount.toFixed(2), 170, yPosition + 20);
        totalWithDelivery -= couponDiscount; // Reduce the total by coupon discount
      }

      // Calculate total after applying the coupon (if any)
      doc.setFontSize(14);
      doc.text("Total", 130, yPosition + (couponDiscount ? 30 : 20)); // Adjusting Y position based on whether coupon is applied
      doc.text(
        totalWithDelivery.toFixed(2),
        170,
        yPosition + (couponDiscount ? 30 : 20)
      );

      // Footer with margin top 20 units
      doc.setFontSize(10);
      doc.text("Thank you for your business!", 14, yPosition + 70); // Adding 20 units to yPosition + 50

      // Save the PDF
      doc.save("invoice_with_table.pdf");
    }
  });

// Invoice Download
