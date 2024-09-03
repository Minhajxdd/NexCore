
// Validation and axios of address
(function(){
    
    document.querySelector('#place-order-btn').addEventListener('click', (e) => {
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
                optional_message: document.getElementById('optionalMessage').value.trim(),
                zipcode: zipcode,
                city_town: document.getElementById('city').value.trim(),
                state: state,
                phone_no: phone,
                email: email
            }
        };

            const selectedOption = document.querySelector('input[name="pm"]:checked');
            
            if(selectedOption.value !== 'cod'){
                return alert(`Payment Method Currently Unavailable use Cash On Delivery`);
            }
            data.paymentMethod = selectedOption.value;


            // Send data using Axios
            axios.post('/order/authenticate', data)
            .then(function (res) {
                console.log(res.data);
                if(res.data.success){
                    window.location.href = res.data.redirectUrl;
                }else{
                    window.location.href = 'http://localhost:4000/not-found';
                }
            })
            .catch(function (error) {
                console.log(`An error occurred during axios request ${error.message}`);
            });
        
    });
    
})();