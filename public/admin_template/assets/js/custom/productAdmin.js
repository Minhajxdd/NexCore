// Add user toggle
(function () {
  const button = document.getElementById("add-usr-btn");
  const form = document.getElementById("add-products-table");
  const cancel = document.getElementById("add-prd-cancel");

  button.addEventListener("click", () => {
    form.style.display = "block";
  });

  cancel.addEventListener("click", () => {
    form.style.display = "none";
    document.getElementById("product-add-form").reset();
  });
})();
// Add user toggle

// Cropperjs
(function () {
  let cropper;
  let currentImageInput;

  document
    .getElementById("product-add-form")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("cropButton")) {
        currentImageInput = event.target.previousElementSibling; // Get the related input element
        const file = currentImageInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const image = document.getElementById("imagePreview");
            image.src = e.target.result;

            // Destroy previous cropper instance if any
            if (cropper) {
              cropper.destroy();
            }

            // Initialize Cropper.js
            cropper = new Cropper(image, {
              aspectRatio: 1, // Example: square crop
              viewMode: 1,
              scalable: true,
              zoomable: true,
              movable: true,
            });

            // Show the cropper pop-up
            document.getElementById("cropContainer").style.display = "block";
            document.getElementById("overlay").style.display = "block";
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select an image first.");
        }
      }
    });

  document
    .getElementById("cropAndSaveButton")
    .addEventListener("click", function () {
      cropper.getCroppedCanvas().toBlob(function (blob) {
        const file = new File([blob], currentImageInput.files[0].name, {
          type: "image/png",
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        currentImageInput.files = dataTransfer.files;

        // Hide the cropper pop-up
        document.getElementById("cropContainer").style.display = "none";
        document.getElementById("overlay").style.display = "none";
      });
    });

  document
    .getElementById("cancelCropButton")
    .addEventListener("click", function () {
      // Hide the cropper pop-up without saving
      document.getElementById("cropContainer").style.display = "none";
      document.getElementById("overlay").style.display = "none";
    });

  let count = 4;
  document
    .getElementById("addImageButton")
    .addEventListener("click", function () {
      const parentDiv = document.getElementById(
        "add-image-form-new-content-div"
      );
      parentDiv.style.display = "block";
      const container = document.createElement("div");
      container.classList.add("form-group");
      container.innerHTML = `
                <label for="imageInput${count}">Image ${count}</label>
                <input name="image" type="file" class="form-control" id="imageInput${count}" accept="image/*" required>
                <button type="button" class="btn btn-primary mt-2 cropButton">Crop</button>
            `;
      count++;
      parentDiv.appendChild(container);
    });
})();
// Cropperjs

// Create Product
(function () {
  const form = document.getElementById("product-add-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault();

    const errMessage = document.getElementById("err_message_product");
    errMessage.textContent = "";

    const name = document.getElementById("product-name-add").value.trim();
    const ogPrice = parseFloat(
      document.querySelector('input[name="og_price"]').value
    );
    const dsPrice = parseFloat(
      document.querySelector('input[name="ds_price"]').value
    );
    const stock = parseInt(
      document.getElementById("add-product-stock").value,
      10
    );
    const image1 = document.getElementById("imageInput1").files[0];
    const image2 = document.getElementById("imageInput2").files[0];
    const image3 = document.getElementById("imageInput3").files[0];

    if (!name) {
      errMessage.textContent = "Product name is required.";
      return;
    }

    if (isNaN(ogPrice) || ogPrice <= 0) {
      errMessage.textContent = "Original price must be a positive number.";
      return;
    }

    if (!isNaN(dsPrice) && dsPrice >= ogPrice) {
      errMessage.textContent =
        "Discounted price must be less than the original price.";
      return;
    }

    if (isNaN(stock) || stock <= 0) {
      errMessage.textContent = "Stock must be a valid number greater than 0.";
      return;
    }

    if (!image1 || !image2 || !image3) {
      errMessage.textContent = "Please upload all three images.";
      return;
    }

    let formData = new FormData(this);

    const dropDown = document.getElementById("add-usr-category");
    const selectedDropDown = dropDown.options[dropDown.selectedIndex];
    const id = selectedDropDown.getAttribute("data-id");

    // Send the POST request using Axios
    axios
      .post(`/admin/products/add?cat_id=${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (res) {
        document.getElementById("add-products-table").style.display = "none";

        console.log(res.data.status);

        insertNewElement(res.data.product_details);
      })
      .catch(function (error) {
        console.error("Error adding product:", error);
      });
    form.reset();
  });
})();
// Create Product

// New item add
function insertNewElement(data) {
  const length = document.querySelectorAll(".list-index").length;

  const newRow = `
    <tr>
    <td>${length + 1}</td>
    <td><img class="prod-img" src="/uploads/products/${
      data.images[0]
    }" alt="product_image"></td>
    <td id="tb-description2">${data.name}</td>
    <td id="tb-description1">${data.description.substring(0, 300)}...</td>
    <td>
      <h6>Original Price: </h6>
      <p>${data.original_price}</p>
      <h6>Discounted Price: </h6>
      <p>${data.discounted_price}</p>  
    </td>
    <td>${data.stock}</td>
    <td>
      <button class="badge" data-id="${
        data._id
      }" id="btn-action">Delete</button>
      <button class="badge" data-id="${data._id}" id="btn-edit">Edit</button>
    </td>
  </tr>    
  `;
  document
    .getElementById("table-body-list")
    .insertAdjacentHTML("beforeend", newRow);
}
// New item add

// Button Color Change
(function () {
  const buttons = document.querySelectorAll("#btn-action");

  buttons.forEach((button) => {
    if (button.innerHTML === "Delete") {
      button.style.backgroundColor = "red";
    } else {
      button.style.backgroundColor = "green";
    }
  });
})();
// Button Color Change

(function () {
  const buttons = document.querySelectorAll("#btn-action");

  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      if (button.innerHTML === "Delete") {
        button.innerHTML = "Undo";
        button.style.backgroundColor = "green";
      } else {
        button.innerHTML = "Delete";
        button.style.backgroundColor = "red";
      }
      const result = button.getAttribute("data-id");

      axios
        .get(`/admin/product/delete?id=${result}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(`error while axios delete get request ${err.message}`);
        });
    });
  });
})();

(function () {
  const buttons = document.querySelectorAll("#btn-edit");
  const form = document.getElementById("edit-products-table");
  buttons.forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.getAttribute("data-id");

      axios
        .get(`/admin/api/product/get-product?id=${id}`)
        .then((res) => {
          updateEditForm(res.data);
        })
        .catch((err) => {
          console.log(
            `error while edit product details data fetching : ${err.message}`
          );
        });

      form.style.display = "block";
    });
  });

  document.getElementById("edit-prd-cancel").addEventListener("click", () => {
    form.style.display = "none";
    document.getElementById(`product-edit-form-file-inputs-inject`).innerHTML = '';
  });
})();

let count2 = 1;

function updateEditForm(data) {
  
  document.getElementById(`Hidden-Product-id-field`).value = data._id;
  document.getElementById(`Hidden-Category-id-field`).value = data.category;

  document.getElementById("product-name-edit").value = data.name;
  document.getElementById("description-form-edit").value = data.description;
  const categoryDrop = document.getElementById("edit-form-usr-category");

  Array.from(categoryDrop.options).forEach((option) => {
    if (option.getAttribute("data-id") === data.category) {
      option.selected = true;
    }
  });

  document.getElementById("edit-form-original-price").value =
    data.original_price;
  document.getElementById("edit-form-discounted-price").value =
    data.discounted_price;
  document.getElementById("edit-product-stock").value = data.stock;

  const productsDiv = document.getElementById(`product-edit-form-file-inputs-inject`);
  console.log(data.images)

  data.images.forEach((value, indx) => {
      count2++;
    productsDiv.insertAdjacentHTML('beforeend', `
      <div class="form-group">
        <label for="imageInputedit${indx + 1}">Image ${indx + 1}</label><br>
        <img src="/uploads/products/${value}" id="productImageedit${indx + 1}" style="width: 100px;height: 100px; margin-bottom: 5px;" alt="product-image">
        <input name="image" type="file" class="form-control" id="imageInputededit${indx + 1}" accept="image/*">
        <button type="button" class="btn btn-primary mt-2 cropButton" id="cropButton-edit${indx + 1}">Crop</button>
      </div>
    `);
    

  })

}












// Cropperjs edit
(function () {
  let cropper;
  let currentImageInput;

  document
    .getElementById("product-edit-form-file-inputs-inject")
    .addEventListener("click", function (event) {
      if (event.target.classList.contains("cropButton")) {
        currentImageInput = event.target.previousElementSibling;
        const file = currentImageInput.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function (e) {
            const image = document.getElementById("imagePreview-edit");
            image.src = e.target.result;

            // Destroy previous cropper instance if any
            if (cropper) {
              cropper.destroy();
            }

            // Initialize Cropper.js
            cropper = new Cropper(image, {
              aspectRatio: 1, // Example: square crop
              viewMode: 1,
              scalable: true,
              zoomable: true,
              movable: true,
            });

            // Show the cropper pop-up
            document.getElementById("cropContainer-edit").style.display = "block";
            document.getElementById("overlay-edit").style.display = "block";
          };
          reader.readAsDataURL(file);
        } else {
          alert("Please select an image first.");
        }
      }
    });

  document
    .getElementById("cropAndSaveButton-edit")
    .addEventListener("click", function () {
      cropper.getCroppedCanvas().toBlob(function (blob) {
        const file = new File([blob], currentImageInput.files[0].name, {
          type: "image/png",
        });
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        currentImageInput.files = dataTransfer.files;

        // Hide the cropper pop-up
        document.getElementById("cropContainer-edit").style.display = "none";
        document.getElementById("overlay-edit").style.display = "none";
      });
    });

  document
    .getElementById("cancelCropButton-edit")
    .addEventListener("click", function () {
      // Hide the cropper pop-up without saving
      document.getElementById("cropContainer-edit").style.display = "none";
      document.getElementById("overlay-edit").style.display = "none";
    });

  document
    .getElementById("addImageButton-edit")
    .addEventListener("click", function () {
      const parentDiv = document.getElementById(
        "product-edit-form-file-inputs-inject"
      );
      
      const container = document.createElement("div");
      container.classList.add("form-group");
      container.innerHTML = `
                <label for="imageInput${count2}">Image ${count2}</label>
                <input name="image" type="file" class="form-control" id="imageInput${count2}" accept="image/*" required>
                <button type="button" class="btn btn-primary mt-2 cropButton">Crop</button>
            `;
      count2++;
      parentDiv.appendChild(container);
    });
})();
// Cropperjs edit














// Admin Stock Update Axios
document.querySelectorAll(".qty-up").forEach((element, ind) => {
  let inputs = document.querySelectorAll('input[id^="input-value"]');
  element.addEventListener("click", function () {
    let currentInput = inputs[ind];
    let value = parseInt(currentInput.value, 10);
    currentInput.value = value + 1;

    const id = currentInput.getAttribute("data-id");

    axios
      .get(`/admin/api/admin/product/stock?action=add&id=${id}`)
      .then((res) => {
        console.log(res.data);
      })
      .catch((err) => {
        console.log(`error while sending axios requests: ${err.message}`);
      });
  });
});

document.querySelectorAll(".qty-down").forEach((element, ind) => {
  let inputs = document.querySelectorAll('input[id^="input-value"]');
  element.addEventListener("click", function () {
    let currentInput = inputs[ind];
    let value = parseInt(currentInput.value, 10);
    if (value >= 1) {
      currentInput.value = value - 1;

      const id = currentInput.getAttribute("data-id");

      axios
        .get(`/admin/api/admin/product/stock?action=sub&id=${id}`)
        .then((res) => {
          console.log(res.data);
        })
        .catch((err) => {
          console.log(`error while sending axios requests: ${err.message}`);
        });
    }
  });
});
// Admin Stock Update Axios

// Product edit form Submit
document
  .getElementById(`product-edit-form`)
  .addEventListener(`submit`, function (e) {
    e.preventDefault();

    const formData = new FormData(this);

    const categoryDrop = document.getElementById(`edit-form-usr-category`);

    const categoryId =
      categoryDrop.options[categoryDrop.selectedIndex].getAttribute("data-id");
    
      formData.append("categoryId", categoryId);

      console.log(formData);
      
      // Send the POST request using Axios
    axios
      .post(`/admin/api/products/edit`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(function (res) {
        if (!res.data.status) {
          return console.log("failed");
        }

        document.getElementById(`edit-products-table`).style.display = "none";

        console.log(res.data.updateData)
        updateRow(res.data.updateData);
        console.log("success");
      })
      .catch(function (err) {
        console.log(`error while sending axios request: ${err.message}`);
      });
      document.getElementById(`product-edit-form-file-inputs-inject`).innerHTML = '';
  });

// Product edit form Submit

// Update Row
function updateRow(data){
    const trElement = document.getElementById(data._id);

    const tdElements = trElement.querySelectorAll('td');

    const imgElement = tdElements[1].querySelector('img');

    imgElement.src = `/uploads/products/${data.images[0]}`;

    tdElements[2].innerHTML = data.name;
    tdElements[3].innerHTML = data.description;
    tdElements[4].querySelector(`#td-original-price`).innerHTML = data.original_price;
    tdElements[4].querySelector(`#td-discount-price`).innerHTML = data.discounted_price;
    tdElements[5].querySelector('.td-stock-input').value = data.stock;
}
// Update Row