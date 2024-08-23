(function (){

    function validateNumber(){
    const otp = document.getElementById('otp').value;
    const errorMessage = document.getElementById('error_message');

    console.log(otp.length)

    // if(Number.isNaN(otp)){
    //     errorMessage.innerHTML = "Otp should be a number!!";
    //     return false;
    // }
    // else if(otp.length == 4){
    //     errorMessage.innerHTML = "";
    //     return true;
    // }
    // else{
    //     errorMessage.innerHTML = "Otp Must be 4 Numbers";
    //     return false;             
    // }


    if (isNaN(otp) || otp.toString().length !== 4) {
    if (otp.trim() === "") {
        errorMessage.innerHTML = "OTP should not be empty!";
    } else {
        errorMessage.innerHTML = "Invalid OTP";
    }
    return false;
}

    // OTP is a number and exactly 4 digits
    errorMessage.innerHTML = "";
    return true;

}
})();

(function (){


// Otp Timer
document.addEventListener("DOMContentLoaded", function() {
const otpTimerElement = document.getElementById('otp-timer');
const resetOtpButton = document.getElementById('reset-otp');
const totalTime = 60; // Total time in seconds for the OTP timer
let timerInterval;

const startTimer = (endTime) => {
const updateTimer = () => {
    const currentTime = Date.now();
    const timeRemaining = Math.floor((endTime - currentTime) / 1000);

    if (timeRemaining >= 0) {
        const minutes = Math.floor(timeRemaining / 60);
        const seconds = timeRemaining % 60;
        otpTimerElement.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    } else {
        clearInterval(timerInterval);
        otpTimerElement.textContent = '00:00';
        localStorage.removeItem('otpEndTime'); // Optionally clear the end time
    }
};

clearInterval(timerInterval); // Clear any previous interval
timerInterval = setInterval(updateTimer, 1000);
updateTimer(); // Initial call to display the correct time immediately
};

const initializeTimer = () => {
let endTime = localStorage.getItem('otpEndTime');
const now = Date.now();

if (!endTime || now > endTime) {
    endTime = now + totalTime * 1000;
    localStorage.setItem('otpEndTime', endTime);
}

startTimer(endTime);
};

// Initialize the timer on page load
initializeTimer();

// Reset OTP and restart the timer when the "Resend OTP" link is clicked
resetOtpButton.addEventListener('click', function(e) {
e.preventDefault();
const now = Date.now();
const newEndTime = now + totalTime * 1000;
localStorage.setItem('otpEndTime', newEndTime);
startTimer(newEndTime); // Restart the timer from the beginning
});
});

})();



// Resent Otp
(function (){

    document.getElementById('reset-otp').addEventListener('click', () => {
        console.log('resent otp button clicked')

        axios.get('/otp/re-sent')
            .then(response => {
                console.log('Axios response received:', response.data); // Log the response data
            })
            .catch(error => {
                console.error('Axios Error:', error);
            });

        
    })

})();
