

// Form add btn
document.getElementById(`add-form-btn`).addEventListener("click", () => {
  document.getElementById("add-offer-div").style.display = "block";
});
// Form add btn

// Form cancel btn
document
  .getElementById("add-offer-cancel")
  .addEventListener("click", function () {
    document.getElementById("add-offer-div").style.display = "none";
    const element = document.getElementById("dynamic-type-drop-down");
    const addProBtn = document.getElementById("add-new-product-drop-toggler");

    if (element) {
      element.remove();
    }

    if (addProBtn) {
      addProBtn.remove();
    }

    document.getElementById("add-off-type-input").value = "";
  });
// Form cancel btn

// Add form type
let product = null;
let category = null;

document
  .getElementById("add-off-type-input")
  .addEventListener("change", async function () {
    const value = this.value;
    if (this.value === "Products") {
      const element = document.getElementById("dynamic-type-drop-down");
      if (element) {
        element.remove();
      }

      try {
        if (!product) {
          const response = await axios.get(
            `/admin/api/offers/type?type=${value}`
          );
          product = response.data.data;
        }

        if (product) {
          return createDropdown(product, "yes");
        }

      } catch (err) {
        console.log(`Error while fetching data: ${err.message}`);
      }
    }
    else if (this.value === "Category"){
        const element = document.getElementById("dynamic-type-drop-down");
        const toggler = document.getElementById(`add-new-product-drop-toggler`);
        if (element) {
          element.remove();
        }
        if(toggler){
            toggler.remove();
        }
  
        try {
          if (!category) {
            const response = await axios.get(
              `/admin/api/offers/type?type=${value}`
            );
            category = response.data.data;
          }
  
          if (category) {
            return createDropdown(category);
          }
        } catch (err) {
          console.log(`Error while fetching data: ${err.message}`);
        } 
    }

    function createDropdown(data, product = null) {
      const formGroupDiv = document.createElement("div");
      formGroupDiv.classList.add("form-group");
      formGroupDiv.id = "dynamic-type-drop-down";
      formGroupDiv.setAttribute("type", value);

      const label = document.createElement("label");
      label.textContent = value;

      const select = document.createElement("select");
      select.classList.add("form-control");
      select.id = "add-offfer-type-value";
      select.name = "offer-value";

      const defaultOption = document.createElement("option");
      defaultOption.value = "0";
      defaultOption.textContent = "Select";
      select.appendChild(defaultOption);

      data.forEach((item) => {
        const option = document.createElement("option");
        option.value = item._id;
        option.value = 'options';
        option.textContent = item.name;
        select.appendChild(option);
      });

      formGroupDiv.appendChild(label);
      formGroupDiv.appendChild(select);

      const dropParent = document.getElementById(`type-select-div`);
      dropParent.insertAdjacentElement("afterend", formGroupDiv);

      if (product) {
        const div = document.createElement(`div`);
        div.innerHTML = `
        <button id="add-new-product-drop-toggler" type="button" class="btn btn-secondary mt-2 mb-3">Add New Product</button>
        `;
        dropParent.insertAdjacentElement("afterend", div);
      }
    }
  });
// Add form type

// Add to form product dropdown add
// Add to form product dropdown add

document.addEventListener("click", function (event) {
  if (event.target.matches("#add-new-product-drop-toggler")) {
    addProductDrop(product); // Call the function when the element is clicked
  }
});

function addProductDrop(data) {
  const select = document.createElement("select");
  select.classList.add("form-control");
  select.classList.add("mt-2");
  select.id = "add-offer-type-value";
  select.name = "offer-value";

  const defaultOption = document.createElement("option");
  defaultOption.value = "0";
  defaultOption.textContent = "Select";
  select.appendChild(defaultOption);

  data.forEach((item) => {
    const option = document.createElement("option");
    option.value = item._id;
    option.textContent = item.name;
    select.appendChild(option);
  });

  const parentDiv = document.getElementById("dynamic-type-drop-down");
  parentDiv.appendChild(select);
}

window.onload = function () {
  document.getElementById(`add-off-type-input`).value = "";
};
