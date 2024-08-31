
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
            document.getElementById('error_message').innerHTML = errorMsg;
        } else {
            document.getElementById('error_message').innerHTML = "";
           
            let formData = {
                firstName: firstName,
                lastName: lastName,
                address1: address1,
                address2: document.getElementById('address2').value.trim(),
                landmark: document.getElementById('landmark').value.trim(),
                optionalMessage: document.getElementById('optionalMessage').value.trim(),
                zipcode: zipcode,
                city: document.getElementById('city').value.trim(),
                state: state,
                phone: phone,
                email: email
            };
            console.log(formData);
            // // Send data using Axios
            // axios.post('your-endpoint-url', formData)
            // .then(function (response) {
            //     alert('Form submitted successfully');
            // })
            // .catch(function (error) {
            //     alert('An error occurred during submission');
            // });
        }
    });
    
})();