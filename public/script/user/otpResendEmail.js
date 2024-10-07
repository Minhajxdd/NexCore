// Axios request
(function(){
    const form = document.getElementById('form-email'); 
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 
        const form = event.target;
        const formData = new FormData(form); 
        
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

    if(validateEmail()){

        
        // Send the POST request u0sing Axios
        axios.post(`/password_reset`, data)
        .then(function(res) {
            
            if (res.data.redirectUrl) {
                return window.location.href = res.data.redirectUrl;
            }
            
            if(res.data.err_message){
                return errorMessagePush(res.data.err_message);
            }
            errorMessageClear();
        })
        .catch(function(error) {
            console.error('Error adding product:', error);
        });
        form.reset();
    }
});
    
function errorMessagePush(msg){
    document.getElementById('err_div').style.display = 'block';
    document.getElementById('err_div_msg').innerHTML = msg;
}

function errorMessageClear(){
    document.getElementById('err_div').style.display = 'none';
    document.getElementById('err_div_msg').innerHTML = '';
}

})();
// Axios request

function validateEmail(){
    let errorLabel = document.getElementById('error_message');
    const email = document.getElementById('email').value;

    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

     // Email validation
     if(!email.match(emailValidate)){
        errorLabel.innerHTML = "Please Enter a valid email";
        return false;
    }
    else{
        errorLabel.innerHTML = "";
        return true;
    }

}