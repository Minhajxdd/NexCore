function validateSignupForm(){
    const fullName =  document.getElementById('full-name').value;
    const email = document.getElementById('email').value;
    const phoneNumber = document.getElementById('phone-number').value;
    const pword = document.getElementById('password').value;
    const rePword = document.getElementById('re-password').value; 
    let errorLabel = document.getElementById('error-message');
    
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

function validateLoginForm(){
        const email = document.getElementById('email').value;
        const pword = document.getElementById('password').value; 
        let errorLabel = document.getElementById('error_message');
        
        const numSymValidate = /[0123456789!@#$%^&*()]/;
        const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
        // Email validation
        if(!email.match(emailValidate)){
            errorLabel.innerHTML = "Please Enter a valid email";
            return false;
        }
        else{
            errorLabel.innerHTML = "";
        }
        
        // Password Validate
        if(pword.trim() === ''){
            errorLabel.innerHTML = "Password cant be empty";
            return false;
        }
        else if(pword.length <= 7){
            errorLabel.innerHTML = "Password should contians atleast 8 characters";
            return false;
        }
        else if(!pword.match(numSymValidate)){
            errorLabel.innerHTML = "Password should contain numbers and characters";
            return false;
        }
        else{
            errorLabel.innerHTML = "";
            return true;
        }
}

function adminLoginForm(){
    const uname = document.getElementById('user-name').value;
    const pword = document.getElementById('password').value; 
    let errorLabel = document.getElementById('error-message');
    
    const numSymValidate = /[0123456789!@#$%^&*()]/;
    const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // User Name validation
    if(uname.match(numSymValidate)){
        errorLabel.innerHTML = "User Name Shouldt include Number or Symbol!!";
        return false;
    }
    else if(uname.trim() === ''){
        errorLabel.innerHTML = "user name cant be empty";
        return false;
    }
    else if(uname.length < 5){
        errorLabel.innerHTML = "user name should have at lease 4 character"
        return false;
    }
    else{
         errorLabel.innerHTML = "";
     }
    
    // Password Validate
    if(pword.trim() === ''){
        errorLabel.innerHTML = "Password cant be empty";
        return false;
    }
    else if(pword.length <= 7){
        errorLabel.innerHTML = "Password should contians atleast 8 characters";
        return false;
    }
    else if(!pword.match(numSymValidate)){
        errorLabel.innerHTML = "Password should contain numbers and characters";
        return false;
    }
    else{
        errorLabel.innerHTML = "";
        return true;
    }
}


//  function logInValidate(){
//     const email = document.getElementById('email-login').value;
//     const pword = document.getElementById('password-login').value;
//     let errorLabel = document.getElementById('error-label-login');
    
//     const emailValidate = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     const numSymValidate = /[0123456789!@#$%^&*()]/;

//     // Email validation
//     if(!email.match(emailValidate)){
//         errorLabel.innerHTML = "Please Enter a valid email";
//         return false;
//     }else{
//         errorLabel.innerHTML = "";
//     }


//     // Password Validate
//     if(pword.length <= 7){
//         errorLabel.innerHTML = "Password should contians atleast 8 characters";
//         return false;
//     }
//     else if(pword.trim() === ''){
//         errorLabel.innerHTML = "Password can't be whitespace";
//         return false;
//     }
//     else if(!pword.match(numSymValidate)){
//         errorLabel.innerHTML = "Password should contain number's and characters";
//         return false;
//     }
//     else{
//         errorLabel.innerHTML = "";
//     }

     
//      return true;
 
//  }


//  function adminValidate(){
//     const userName = document.getElementById('uname').value;
//     const pword = document.getElementById('password').value;
//     let errorLabel = document.getElementById('error-label');

//     const numSymValidate = /[0123456789!@#$%^&*()]/;

//     // User name validate
//     if(userName.match(numSymValidate)){
//         errorLabel.innerHTML = "User name Should't include Number or Symbol!!";
//         return false;
//     }
//     else if(userName.trim() === ''){
//         errorLabel.innerHTML = "User name can't be empty";
//         return false;
//     }
//     else if(userName.length < 5){
//         errorLabel.innerHTML = "User name should have at lease 4 character"
//         return false;
//     }
//     else{
//          errorLabel.innerHTML = "";
//      }

//     //  Password validate
//     if(pword.trim() === ''){
//         errorLabel.innerHTML = "Password can't be whitespace";
//         return false;
//     }
//     else if(pword.length <= 7){
//         errorLabel.innerHTML = "Password should contians atleast 8 characters";
//         return false;
//     }
//     else if(!pword.match(numSymValidate)){
//         errorLabel.innerHTML = "Password should contain number's and characters";
//         return false;
//     }
//     else{
//         errorLabel.innerHTML = "";
//     }

//     return true;
// }