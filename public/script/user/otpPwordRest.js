
// Axios request
(function(){
    const form = document.getElementById('form-otp'); 
    form.addEventListener('submit', function(event) {
        event.preventDefault(); 

        
        const form = event.target;
        const formData = new FormData(form); 

        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });

        // Send the POST request u0sing Axios
        axios.post(`/password_resent/otp`, data)
        .then(function(res) {
            
            if(res.data.redirect_url){
                return window.location.href = res.data.redirect_url;
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
