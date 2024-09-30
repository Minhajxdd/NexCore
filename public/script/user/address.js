let card = '';
// Delete Button Axios Request
document.getElementById('address-container-row').addEventListener('click', function(event) {
    
    if (event.target && event.target.matches('.dtl-btn')) {
        
        const button = event.target;

        button.closest('.address-cards').remove();

        const url = `/api/address/delete?id=${button.value}`;
        
        axios.delete(url)
            .then(res => {
                console.log(res.data);
            })
            .catch(error => {
                console.error('Error deleting address axios', error);
            });
    }
    else if(event.target && event.target.matches('.edit-btn')){

        const button = event.target;

        document.getElementById('form-add-btn-edit').value = button.value; 

        card = button.closest('.address-card');

        document.getElementById('firstName-edit').value = card.querySelector('#addressFirstName').innerHTML;
        document.getElementById('lastName-edit').value = card.querySelector('#addressLastName').innerHTML;
        document.getElementById('address1-edit').value = card.querySelector('#addressCompany').innerHTML;
        document.getElementById('address2-edit').value = card.querySelector('#addressStreet').innerHTML;
        document.getElementById('landmark-edit').value = card.querySelector('#addressLandmark').innerHTML;
        document.getElementById('zipcode-edit').value = card.querySelector('#addressZipCode').innerHTML;
        document.getElementById('city-edit').value = card.querySelector('#addressCityTown').innerHTML;
        document.getElementById('state-edit').value = card.querySelector('#addressState').innerHTML;
        document.getElementById('phone-edit').value = card.querySelector('#addressPhone').innerHTML;
        document.getElementById('email-edit').value = card.querySelector('#addressEmail').innerHTML;



        document.getElementById('overlay').style.display = 'block';
        document.getElementById('edit-form-edit').style.display = 'block';

    }


});

// Delete Button Axios Request






document.getElementById('close-form').onclick = function() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('overlay').onclick = function() {
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('edit-form-edit').style.display = 'none';
}


document.getElementById('new-form-btn').addEventListener('click', function() {
    document.getElementById('edit-form').style.display = 'block';
    document.getElementById('overlay').style.display = 'block';
});

function closeForm(){
    document.getElementById('edit-form').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
}

document.getElementById('close-form-edit').addEventListener('click', function(){
    document.getElementById('overlay').style.display = 'none';
    document.getElementById('edit-form-edit').style.display = 'none';
});




// Validation and axios of address
(function(){
    
    document.querySelector('#form-add-btn').addEventListener('click', (e) => {
        e.preventDefault();
    
        let errorMsg = document.getElementById('error_message');
        
        errorMsg = "";
        let firstName = document.getElementById('firstName').value.trim();
        let lastName = document.getElementById('lastName').value.trim();
        let address1 = document.getElementById('address1').value.trim();
        let zipcode = document.getElementById('zipcode').value.trim();
        let state = document.getElementById('state').value.trim();
        let phone = document.getElementById('phone').value.trim();
        let email = document.getElementById('email').value.trim();
    
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
        if (!email || !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)) {
            errorMsg += "Valid Email Address is required.<br>";
        }
    
        if (errorMsg) {
            return document.getElementById('error_message').innerHTML = errorMsg;
        }
            document.getElementById('error_message').innerHTML = "";
           
            const data ={ 
            formData:{
                firstName: firstName,
                lastName: lastName,
                company: address1,
                street: document.getElementById('address2').value.trim(),
                land_mark: document.getElementById('landmark').value.trim(),
                zipcode: zipcode,
                city_town: document.getElementById('city').value.trim(),
                state: state,
                phone_no: phone,
                email: email
            }
        };


            // Send data using Axios
            axios.post('/api/address/create', data)
            .then(function (res) {
                if(res.data.status === `Success`){
                    closeForm();
                    injectAddress(res.data.address._id);
                    console.log('Success')
                }
                console.log(`Failed`);

            })
            .catch(function (error) {
                console.log(`An error occurred during new address axios request ${error.message}`);
            });
        
    });
    
})();

let indxInj = 3;

function injectAddress(id){

    const row = document.getElementById('address-container-row');

    const div = document.createElement('div');
    div.classList.add('col-xs-12', 'col-sm-6', 'address-cards');

    div.innerHTML = `
        <div class="address-card">
            <div class="button-group">
                <button class="btn btn-danger dtl-btn" value="${id}"><i class="fas fa-trash-alt"></i> Delete</button>
                <button class="btn btn-primary" value="${id}"><i class="fas fa-edit"></i> Edit</button>
            </div>
            <h4><i class="fas fa-map-marker-alt" style="color: #4caf50; margin-right: 10px;"></i> Address ${indxInj}:</h4>
            <dl class="address-details">
                <p>
                    <h5 class="d-line key-addr">First Name:</h5>
                    <p class="d-line">${document.getElementById('firstName').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Last Name:</h5>
                    <p class="d-line">${document.getElementById('lastName').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Company:</h5>
                    <p class="d-line">${document.getElementById('address1').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Street:</h5>
                    <p class="d-line">${document.getElementById('address2').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Land Mark:</h5>
                    <p class="d-line">${document.getElementById('landmark').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">City / Tow:</h5>
                    <p class="d-line">${document.getElementById('city').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">State:</h5>
                    <p class="d-line">${document.getElementById('state').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Zipcode:</h5>
                    <p class="d-line">${document.getElementById('zipcode').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Phone Number:</h5>
                    <p class="d-line">${document.getElementById('phone').value.trim()}</p>
                </p>
                <p>
                    <h5 class="d-line key-addr">Email:</h5>
                    <p class="d-line">${document.getElementById('email').value.trim()}</p>
                </p>
            </dl>
        </div>
    `

    row.appendChild(div);
    indxInj++;
}


document.getElementById('form-add-btn-edit').addEventListener('click', function(){
    
    const data ={};
    
    data.formData = {
            firstName: document.getElementById('firstName-edit').value,
            lastName: document.getElementById('lastName-edit').value,
            company: document.getElementById('address1-edit').value,
            street: document.getElementById('address2-edit').value,
            land_mark: document.getElementById('landmark-edit').value,
            zipcode: document.getElementById('zipcode-edit').value,
            city_town: document.getElementById('city-edit').value,
            state: document.getElementById('state-edit').value,
            phone_no: document.getElementById('phone-edit').value,
            email: document.getElementById('email-edit').value
        }
    data.id = event.target.value;

    axios.post('/api/address/update',data)
    .then(function(res){
        if(res.data.status === 'success'){
            console.log(res.data.status);
            updateCard(res.data.data);
        }
    })
    .catch(function(err){
        console.log(`error while updating on axios ${err.message}`);
    });

    document.getElementById('edit-form-edit').style.display = 'none';
    document.getElementById('overlay').style.display = 'none';
});

function updateCard(data){
card.querySelector('#addressFirstName').innerHTML = data.first_name;
card.querySelector('#addressLastName').innerHTML = data.last_name;
card.querySelector('#addressCompany').innerHTML = data.company;
card.querySelector('#addressStreet').innerHTML = data.street;
card.querySelector('#addressLandmark').innerHTML = data.land_mark;
card.querySelector('#addressZipCode').innerHTML = data.zipcode;
card.querySelector('#addressCityTown').innerHTML = data.city_town;
card.querySelector('#addressState').innerHTML = data.state;
card.querySelector('#addressPhone').innerHTML = data.phone_no;
card.querySelector('#addressEmail').innerHTML = data.email;
}