// Reset Name
function resetName() {
  const fullName = document.getElementById(`full-name-custom`).value;
  const errorLabel = document.getElementById(`full-name-error_message`);

  const numSymValidate = /[0123456789!@#$%^&*()]/;
  
  // Full name validation
  if (fullName.match(numSymValidate)) {
    errorLabel.innerHTML = "Full Name Shouldt include Number or Symbol!!";
    return false;
  } else if (fullName.trim() === "") {
    errorLabel.innerHTML = "Name cant be empty";
    return false;
  } else if (fullName.length < 5) {
    errorLabel.innerHTML = "Full Name should have at lease 4 character";
    return false;
  } else {
    errorLabel.innerHTML = "";
  };

  axios
  .post(`/api/profile/overview?type=name`, { value: fullName })
  .then(function (res) {
    console.log(res.data);
  })
  .catch(function (err) {
    console.log(`error while reset fullname:${err.message}`);
  });

};
// Reset Name


// Rest Number
function resetNumber() {
  const mobileNumber = document.getElementById(`mobile-number-custom`).value;
  const error = document.getElementById("mobil-number-error_message");

  const phoneValidate = /^[0-9]{10}$/;

  if (!mobileNumber.match(phoneValidate)) {
    error.innerHTML = "Please Enter a valid phone number";
    return;
  } else {
    error.innerHTML = "";
  }

  axios
    .post(`/api/profile/overview?type=number`, { value: mobileNumber })
    .then(function (res) {
      console.log(res.data);
    })
    .catch(function (err) {
      console.log(`error while reset number:${err.message}`);
    });
}
// Rest Number
