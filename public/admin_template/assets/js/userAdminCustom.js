
// Select all elements with the class 'btn-action'
const buttons = document.querySelectorAll('#btn-action');

buttons.forEach(button => {
    if(button.innerHTML === 'Block') {
        button.style.backgroundColor = 'red';
    } else if(button.innerHTML === 'Un Block') {
        button.style.backgroundColor = 'green';
    }
});


// Toggle for form 

(function (){
        const btn = document.getElementById('new-user-btn');
        const cancel = document.getElementById('form-cancel');
        const form = document.querySelector('.form-table');
    
        btn.addEventListener('click', () => {
            form.style.display = 'block';
        })
    
        cancel.addEventListener('click', () => {
            form.style.display = 'none';
        })
})();



// Toglle edit form
    
(function (){
    const buttons = document.querySelectorAll('.btn-action-edit');
    const cancel = document.getElementById('form-cancel-edit');
    const form = document.querySelector('.form-table-edit');

    cancel.addEventListener('click', () => {
        form.style.display = 'none';
    })

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            var idBtn = button;

            await axios.get(`/admin/users/form/edit?id=${idBtn.value}`)
            .then(response => {
                const data = JSON.stringify(response.data, null, 2)
                changeFormValues(data);
            })
            .catch(error => {
                console.error(`Axios Data Fetching Error`);
            });


            form.style.display = 'block';
        })
    });

})(); 


// Form Change Function
function changeFormValues(data){
    data = JSON.parse(data);
    const fullName = document.getElementById('full-name-edit');
    const email = document.getElementById('email-edit');
    const phone = document.getElementById('phone-number-edit');
    const id = document.getElementById('id-edit');

    fullName.value = data.full_name;
    email.value = data.email;
    phone.value = data.phone_number;
    id.value = data._id;
}


// Change Blocked Button
(function (){
    const buttons = document.querySelectorAll('#btn-action');

    buttons.forEach((button) => {
        button.addEventListener('click', async () => {
            const data = {
                id: button.value,
            }

            await axios.patch('/admin/users/edit/block', data)
            .then(response => {

                if(button.innerHTML === 'Block'){
                    button.innerHTML = 'Un Block';
                }else{
                    button.innerHTML = 'Block';
                }
    
                if(button.innerHTML === 'Block') {
                    button.style.backgroundColor = 'red';
                } else if(button.innerHTML === 'Un Block') {
                    button.style.backgroundColor = 'green';
                }

            })
            .catch(error => {
                console.error(`Axios Data Updating error`);
            });

        })
    })
})();


// Validation for signup
function validateSignupFormEdit(){
    const fullName =  document.getElementById('full-name-edit').value;
    const email = document.getElementById('email-edit').value;
    const phoneNumber = document.getElementById('phone-number-edit').value;
    const pword = document.getElementById('password-edit').value;
    const rePword = document.getElementById('re-password-edit').value; 
    let errorLabel = document.getElementById('error-message-edit');
    
    const numSymValidate = /[0123456789!@#$%^&*()]/;
    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneValidate = /^[0-9]{10}$/;

    // Full name validation
    if(fullName.match(numSymValidate)){
        errorLabel.innerHTML = "Full Name Shouldt include Number or Symbol!!";
        return false;
    }
    else if(fullName.trim() === ''){
        errorLabel.innerHTML = "Name cant be empty";
        return false;
    }
    else if(fullName.length < 5){
        errorLabel.innerHTML = "Full Name should have at lease 4 character"
        return false;
    }
    else{
         errorLabel.innerHTML = "";
     }



    // Email validation
    if(!email.match(emailValidate)){
        errorLabel.innerHTML = "Please Enter a valid email";
        return false;
    }
    else{
        errorLabel.innerHTML = "";
    }

    // Phone number validation
    if (!phoneNumber.match(phoneValidate)) {
        errorLabel.innerHTML = "Please Enter a valid phone number";
        return false;
    } else {
        errorLabel.innerHTML = "";
    }

    function password(pwordFunction){
        // Password Validate
        if(pwordFunction.trim() === ''){
            errorLabel.innerHTML = "Password can't be empty";
            return false;
        }
        else if(pwordFunction.length <= 7){
            errorLabel.innerHTML = "Password should contians atleast 8 characters";
            return false;
        }
        else if(!pwordFunction.match(numSymValidate)){
            errorLabel.innerHTML = "Password should contain number's and characters";
            return false;
        }
        else{
            errorLabel.innerHTML = "";
            return true;
        }
     
    }

    if(pword && rePword){
        if(pword === rePword){
            const pwordResult = password(pword);
            const rePwordResult = password(rePword);

            return pwordResult && rePwordResult;
        }
        else{
            errorLabel.innerHTML = "Both Password should be same";
            return false;
        }
    }

}