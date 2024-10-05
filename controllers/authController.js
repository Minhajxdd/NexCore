import passport from "passport";
import bcrypt from "bcrypt";

// Importing Schemas
import userModel from '../models/userSchema.js';

// Importing Services
import {
  generateOTP,
  sendOTP,
  verifyPin,
  tempUser,
  createUser,
  updateOtp,
  updatePasswordotpStore,
  validateEmail,
  sendOTPReset,
  emailOtpCheck,
  updatePassword,
} from "../services/authServices.js";

import "../services/googleAuth.js";

export const signupGet = (req, res) => {
  res.render("pages/user/signup");
};

export const signupPost = async (req, res) => {
  const { email } = req.body;
  const otp = await generateOTP();

  // Send OTP via email
  await sendOTP(email, otp, req.body.fullname);

  tempUser(req.body, otp);

  res.cookie("email", req.body.email, {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
  });

  res.redirect("/otp");
};

export const getOtp = (req, res) => {
  if (req.query) {
    const errorCode = Number(req.query.error);
    switch (errorCode) {
      case 1:
        return res.render("pages/user/otp", { ERROR_MESSAGE: "Wrong Otp!!" });
    }
  }

  res.render("pages/user/otp", { ERROR_MESSAGE: "" });
};

export const postOtp = async (req, res) => {
  const email = req.cookies.email;
  const otp = req.body.otp;
  const data = await verifyPin(email, otp);

  if (data.length === 0) {
    return res.redirect("/otp?error=1");
  }

  createUser(email);

  res.redirect("/login");
};

export async function reSendOtp(req, res) {
  const email = req.cookies.email;

  const otp = await generateOTP();
  console.log(email + otp);
  const data = await updateOtp(email, otp);
  await sendOTP(email, otp, data.fullname);

  res.json({ status: "success", message: "otp resent successfully" });
}

export const loginGet = (req, res) => {
  if (req.query) {
    const errorCode = Number(req.query.err);
    switch (errorCode) {
      case 1:
        return res.render("pages/user/login", {
          alertMessage: `Email Not Found`,
        });
        break;

      case 2:
        return res.render("pages/user/login", {
          alertMessage: `Incorrect Password`,
        });
        break;

      case 3:
        return res.render("pages/user/login", {
          alertMessage: `User is blocked!`,
        });
        break;
    }
  }

  res.render("pages/user/login", { alertMessage: null });
};

export const loginPost = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await userModel.findOne({ email: email });

    if (!user) {
      return res.redirect("/login?err=1");
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.redirect("/login?err=2");
    }

    if (user.isBlocked) {
      return res.redirect("/login?err=3");
    }

    if (user.cartId) {
      req.session.cartId = userData.cartId;
    }

    req.session.userId = user._id;
    req.session.user = email;
    res.redirect("/");
  } catch (error) {
    console.log(`error while login post : ${error.message}`);
  }
};

export const NotFound = (req, res) => {
  res.render("404");
};

// Google Auth Contollers

export const googleAuth = (req, res, next) => {
  passport.authenticate("google", { scope: ["email", "profile"] })(
    req,
    res,
    next
  );
};

export const googleCallback = (req, res, next) => {
  passport.authenticate("google", {
    successRedirect: "/auth/protected",
    failureRedirect: "/auth/google/failure",
  })(req, res, next);
};

export function protectedRoute(req, res) {
  req.session.user = req.user.googleId;

  res.redirect("/");
}

export const googleFailure = (req, res) => {
  res.send("Something went wrong");
};
// Google Auth Contollers

export function logout(req, res) {
  req.session.user = null;
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/login");
  });
}

export function adminLogout(req, res) {
  if(req.session.admin) {
    req.session.admin = null;
    res.redirect("/admin/login");
  }else {
    res.redirect('/admin/login');
  }
}

// Resent Otp
export function resentEmailOtp(req, res) {
  res.render("pages/user/auth/resetOtpEmail", { err_div: null });
}

export async function resentEmailOtpPost(req, res) {
  // /password_reset
  const { email } = req.body;

  const data = await validateEmail(email);

  if (data.length === 0 || data[0].isBlocked) {
    return res.json({
      status: "failed",
      err_message: "Invalid Email Please Try Again",
    });
  }

  res.cookie("email_reset", email, {
    maxAge: 10 * 60 * 1000,
    httpOnly: true,
  });

  const otp = await generateOTP();
  await updatePasswordotpStore(email, otp);
  await sendOTPReset(email, otp);

  res.json({ status: "Success", redirectUrl: "/password_resent/otp" });
}

export async function resentOtpOtp(req, res) {
  res.render("pages/user/auth/resetPasswordOtpVerification");
}

export async function resentOtpOtpPost(req, res) {
  const validate = await emailOtpCheck(req.cookies.email_reset, req.body.otp);
  if (!validate) {
    return res.json({ status: "failed", err_message: "Invalida Otp" });
  }
  console.log(req.body.pword1);
  await updatePassword(req.cookies.email_reset, req.body.pword1);

  res.json({ status: "success", redirect_url: "/login" });
}

const noCache = (req, res, next) => {
  res.set(
    "Cache-Control",
    "no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0"
  );
  res.set("Pragma", "no-cache");
  res.set("Expires", "0");
  next();
};

export default noCache;
