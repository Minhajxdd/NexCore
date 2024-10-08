// Importing Modules
import randomstring from "randomstring";
import nodemailer from "nodemailer";
import bcrypt from "bcrypt";

// Importing Schemas
import userModel from "../models/userSchema.js";
import otpModel from "../models/otpSchema.js";
import walletModel from "../models/walletSchema.js";

//Generate OTP
export async function generateOTP() {
  return randomstring.generate({ length: 4, charset: "numeric" });
}

// Send OTP
export async function sendOTP(email, otp, fullName) {
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Your OTP for NexCore Signup",
    text: `Dear ${fullName},

    Your OTP for completing your signup is:

    ${otp}

    Please enter this code to verify your account. The code is valid for 1 minutes.

    If you didn’t request this, please ignore this email.

    Thank you,
    NexCore Team`,
  };

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ID, // Your Email Id
      pass: process.env.GMAIL_APP_PASS, // Your Password
    },
    tls: {
      rejectUnauthorized: false, // Disable certificate validation (if necessary)
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("OTP Email sent successfully:", info.response);
    }
  });
}

export async function sendOTPReset(email, otp) {
  const mailOptions = {
    from: process.env.GMAIL_ID,
    to: email,
    subject: "Otp for Reset Password",
    text: `

    Your OTP for ReSetting Password is:

    ${otp}

    Please enter this code to verify your account. The code is valid for 1 minutes.

    If you didn’t request this, please ignore this email.

    Thank you,
    NexCore Team`,
  };

  let transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.GMAIL_ID, // Your Email Id
      pass: process.env.GMAIL_APP_PASS, // Your Password
    },
    tls: {
      rejectUnauthorized: false, // Disable certificate validation (if necessary)
    },
  });

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred:", error);
    } else {
      console.log("OTP Email sent successfully:", info.response);
    }
  });
}

export async function tempUser(body, otp) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(body.password, saltRounds);

    await otpModel.create({
      email: body.email,
      fullname: body.fullname,
      password: hashedPassword,
      phoneNumber: body.phone,
      otp: otp,
      refId: body.refId,
    });
  } catch (err) {
    console.log(
      `otp database addign error at optSerives on createUser ${err.message}`
    );
  }
}

export async function verifyPin(email, otp) {
  try {
    const user = await otpModel.find({ email: email, otp: otp });
    return user;
  } catch (error) {
    console.error(
      "Error fetching userdata from optServices cookieMatch:",
      error
    );
    return false;
  }
}

export async function createUser(email) {
  try {
    var data = await otpModel.find({ email: email });
  } catch (error) {
    console.error(
      "Error while fething data from otpModel on optServices on createUser module:",
      error
    );
    return false;
  }

  try {
    const user = {
        email: data[0].email,
        full_name: data[0].fullname,
        phone_number: data[0].phoneNumber,
        password: data[0].password,
    };

    if(data[0].refId) {
        user.referred = true;
    
        try{
            await walletModel.findOneAndUpdate(
                {user_id: data[0].refId},
                {
                    $push: {
                        transactions: {
                            amount: 100,
                            transaction_type: 'credit',
                            description: `Refered ${data[0].fullname}`
                        }
                    },
                    $inc: {
                        balance_amount: 100
                    }
                },
                { upsert: true }
            );

            await otpModel.findOneAndDelete({ email: email });


        }catch(err) {
            console.log(`error while inserting amount to refered wallet: ${err.message}`);
        }
    }

    await userModel.create(user);

    console.log(`User Created Successfully`);
  } catch (err) {
    console.error(`Error while creating a user on createUser : ${err.message}`);
  }
}

export async function updateOtp(email, otp) {
  try {
    const updatedData = await otpModel.updateOne(
      { email: email },
      { $set: { otp: otp } }
    );
    return updatedData;
  } catch (err) {
    console.log(`error while updating otp on authServices ${err.message}`);
  }
}

export async function validateEmail(email) {
  try {
    const data = await userModel.find({
      email: email,
    });
    return data;
  } catch (err) {
    console.log(`error while checking validateEmail at authServices`);
  }
}

export async function updatePasswordotpStore(email, otp) {
  try {
    await otpModel.create({
      email: email,
      otp: otp,
    });
  } catch (err) {
    console.log("error while updating otp on update Password ${err.message}");
  }
}

export async function emailOtpCheck(email, otp) {
  try {
    const data = await otpModel.findOne({
      email: email,
      otp: otp,
    });
    return data;
  } catch (err) {
    console.log(`error while updating otp on emailOtpCheck ${err.message}`);
  }
}

export async function updatePassword(email, pword) {
  try {
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(pword, saltRounds);

    await userModel.findOneAndUpdate(
      { email: email },
      { $set: { password: hashedPassword } }
    );
  } catch (err) {
    console.log(`Error while updatePassword on authServices ${err.message}`);
  }
}
