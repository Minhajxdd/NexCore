
// Everything Related to form
(function(){
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
        select.classList.add('add-value-drop');
        select.id = "add-offfer-type-value";
        select.name = "offer-value";

        const defaultOption = document.createElement("option");
        defaultOption.value = "";
        defaultOption.textContent = "Select";
        select.appendChild(defaultOption);

        data.forEach((item) => {
          const option = document.createElement("option");
          option.value = item._id;
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
    select.required = true;
    select.classList.add("form-control");
    select.classList.add('add-value-drop');
    select.classList.add("mt-2");
    select.id = "add-offer-type-value";
    select.name = "offer-value";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
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
})();
// Everything Related to form


// Add form Submittion
(function(){
document.getElementById(`add-offer-form`).addEventListener(`submit`, function(e){
    e.preventDefault();


    const errorMessage = document.getElementById('create-form-err-message');
    errorMessage.textContent = '';


    const title = document.getElementById('add-offer-title').value.trim();
    const offerType = document.getElementById('add-off-type-input').value;
    const percentage = document.getElementById('add-offer-percentage').value;
    const expDate = document.getElementById('add-expiration-date').value;
    const values = document.querySelectorAll('.add-value-drop');

    const titleRegex = /^[A-Za-z\s]+$/;
    const minTitleLength = 5;
    const maxTitleLength = 25;

    let errors = [];

    if (!title) {
      errors.push('Offer title is required.');
    }

    if (!titleRegex.test(title)) {
      errors.push('Offer title can only contain letters and spaces.');
    }

    if (title.length < minTitleLength || title.length > maxTitleLength) {
      errors.push(`Offer title must be between ${minTitleLength} and ${maxTitleLength} characters.`);
    }

    if (!offerType) {
      errors.push('Please select an offer type.');
    }

    if (!percentage || percentage < 0 || percentage > 100) {
      errors.push('Discount percentage must be between 0 and 100.');
    }

    if (!expDate) {
      errors.push('Expiration date is required.');
    }

    if(offerType === 'Category'){
        if(!values[0].value){
            errors.push('Select Any Category.');
        }
        var offerValue = [];
        offerValue.push(values[0].value);
    }
    else if(offerType === 'Products'){
        if(!values[0].value){
            errors.push('Select Any Product.');
        }

        var offerValue = [];
        values.forEach((item) => {
            offerValue.push(item.value);
        })
    }

    if (errors.length > 0) {
      errorMessage.innerHTML = errors.join('<br>');
      return;
    }


    const data = {
        title,
        offer_type: offerType,
        discount_percentage: percentage,
        expiry_date: expDate,
        values: offerValue
    }

    axios.post('/admin/api/offers/add', data)
    .then(function(res){
        if(res.data.err_message){
            console.log(`Failed`);
            return errorMessage.innerHTML = res.data.err_message;
        }
        if(res.data.status){
            console.log(`success`);
            addRow(res.data.data);
            hideAddForm();
        }
    })
    .catch(function(err){
        console.log(`error while adding on axios : ${err.message}`);
    })

})

function hideAddForm(){
    document.getElementById(`add-offer-div`).style.display = `none`;
}

function addRow(data){
    const SINo = document.querySelectorAll(`.si-no`).length;

    const tr = document.createElement(`tr`);
    tr.innerHTML = `
        <td class="si-no">${SINo}</td>
        <td>${data.offer_title}</td>
        <td>${data.offer_type}</td>
        <td>${data.offer_available.join(`<br>`)}</td>
        <td>${data.discount_percentage}%</td>
        <td>${ new Date(data.exp_date).toLocaleDateString('en-GB') }</td>
        <td><button id="action-btn" type="button" value="${ data._id }" class="btn btn-outline-danger ">Deactivate</button>
</td>
    `;
    const tbody = document.getElementById(`t-body`);
    tbody.appendChild(tr);

}

})();
// Add form Sbumittion




// Activate Deactivate Buttons
document.getElementById(`t-body`).addEventListener(`click`, function(e){

    if (e.target && e.target.id === 'action-btn') {
        const value = e.target.value;

        axios.get(`/admin/api/offers/toggle?id=${value}`)
        .then(function(res){
            if(!res.data.status){
                return console.log(`failed`);
            };
            changeBtn(e);
            console.log(`success`);
        })
        .catch(function(err){
            console.log(`error while updating status: ${err.message}`);
        })
    }

});

function changeBtn(e) {
    const clickedButton = e.target;

    if(clickedButton.classList.contains('btn-outline-success')){
        clickedButton.innerHTML = 'Deactivate';
        clickedButton.classList.remove('btn-outline-success');
        clickedButton.classList.add('btn-outline-danger');
    }else if(clickedButton.classList.contains('btn-outline-danger')){
        clickedButton.innerHTML = 'Activate';
        clickedButton.classList.remove('btn-outline-danger');
        clickedButton.classList.add('btn-outline-success');
    }


}
// Activate Deactivate Buttons
