// Importing Modules
import randomstring from 'randomstring';
import nodemailer from 'nodemailer';


// Importing Schemas
import userModel from '../models/userSchema.js';
import otpModel  from '../models/otpSchema.js';


//Generate OTP
export async function generateOTP() {
    return randomstring.generate({ length: 4, charset: 'numeric' });
}

// Send OTP
export async function sendOTP(email, otp, fullName) {
    const mailOptions = {
        from: 'nexcore.ecommerce@gmail.com', 
        to: email,
        subject: 'Your OTP for NexCore Signup',
        text: `Dear ${fullName},

Your OTP for completing your signup is:

${otp}

Please enter this code to verify your account. The code is valid for 1 minutes.

If you didn’t request this, please ignore this email.

Thank you,
NexCore Team`
    };
  
    let transporter = nodemailer.createTransport({
        service: 'Gmail',
        auth: {
            user: 'nexcore.ecommerce@gmail.com', // Your Email Id
            pass: process.env.GMAIL_APP_PASS // Your Password
        },
        tls: {
                rejectUnauthorized: false // Disable certificate validation (if necessary)
            }
    });
  
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log('Error occurred:', error);
        } else {
            console.log('OTP Email sent successfully:', info.response);
        }
    });
}

export async function tempUser(body , otp){
    try{
        await otpModel.create({
            email: body.email,
            fullname: body.fullname,
            password: body.password,
            phoneNumber: body.phone,
            otp: otp,
        })
    }catch(err){
        console.log(`otp database addign error at optSerives on createUser ${err.message}`);
    }
}


export async function verifyPin(email , otp){

    try {
        const user = await otpModel.find({ email: email , otp : otp }); 
        return user;
      } catch (error) {
        console.error('Error fetching userdata from optServices cookieMatch:', error);
        return false;
      }
}


export async function createUser(email){

    try {
        var data = await otpModel.find({ email: email }); 
      } catch (error) {
        console.error('Error while fething data from otpModel on optServices on createUser module:', error);
        return false;
    }

    try{
        await userModel.create({
            email: data[0].email,
            full_name: data[0].fullname,
            phone_number: data[0].phoneNumber,
            password: data[0].password,
              
        })
    } catch(err){
        console.error(`Error while creating a user on createUser ${err.message}`);
    }

    console.log(`User Created Successfully`);
}


