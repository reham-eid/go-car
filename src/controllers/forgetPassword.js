import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import randomstring from "randomstring";
import User from "../models/userModel.js";
import {
  generateToken,
  verifyToken,
} from "../middelware/GenerateAndVerifyToken.js";

dotenv.config();

// Nodemailer mailtrap setup
const transporter = nodemailer.createTransport({
  // host: process.env.E_HOST,
  service: "gmail",
  port: 587,
  auth: {
    user: process.env.E_USER,
    pass: process.env.E_PASSWORD,
  },
  tls: {
    rejectUnauthorized: false, // This bypasses certificate validation
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Connection Error:", error);
  } else {
    console.log("SMTP Connection Verified:", success);
  }
});
// request for password reset
export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check email in DB
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email");

    // Check if email is confirmed
    if (!user.isEmailConfirm)
      return res.status(400).json("Your account is not activated.");

    // Generate plain forgetCode
    const forgetCode = randomstring.generate({ charset: "numeric", length: 5 });

    // Log the plain forgetCode for verification
    console.log("Generated forgetCode (plain):", forgetCode);

    // Hash forgetCode for saving in DB
    const hashedForgetCode = bcryptjs.hashSync(forgetCode, +process.env.SALT);

    // Log the hashed forgetCode for verification
    console.log("Hashed forgetCode:", hashedForgetCode);

    // Save hashed forgetCode to DB
    user.forgetCode = hashedForgetCode;
    await user.save();

    // Send email
    const isSent = await transporter.sendMail({
      to: email,
      subject: "Your Verification Code",
      text: `To reset your password: ${forgetCode}`,
    });

    if (!isSent) {
      return res
        .status(500)
        .json("Failed to send reset password email. Please try again.");
    }

    res.status(200).json({
      message: "Check your email for the reset link.",
      username: user.userName,
    });
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    res.status(500).json("An error occurred. Please try again.");
  }
};

// verify code
export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    const verification = await User.findOne({ email });

    if (!verification) {
      return res
        .status(400)
        .json({ message: "No verification code found for this email" });
    }

    if (verification.forgetCode.toString() === code.toString()) {
      res
        .status(200)
        .json({ message: "Verification code verified successfully" });
    } else {
      res.status(400).json({ message: "Invalid verification code" });
    }
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error verifying the code", error: error.message });
    console.error(error);
  }
};

export const resetPassword = asyncHandler(async (req, res, next) => {
  try {
    //get data from req
    const { newPassword, confirmPassword, email } = req.body;

    // check user
    const user = await User.findOne({ email });
    // console.log("user>>>>>> ",user);

    if (!user) {
      return next(
        new Error("you already reset your password.. try to login now", {
          cause: 400,
        })
      );
    }
    //compare 2-passwords
    const match = bcryptjs.compareSync(newPassword, user.password);
    // hash & update password
    if (match) {
      return next(
        new Error(
          "new password is the same as old password .. please change it",
          { cause: 409 }
        )
      );
    }
    // password to hash
    const hashedPassword = bcryptjs.hashSync(newPassword, 10);

    user.password = hashedPassword;
    user.changePassAt = Date.now();
    user.forgetCode = null;
    const resetPassword = await user.save();

    //send res
    res.status(200).json({
      message: "reset your Password successfuly , try to login now",
      resetPassword,
    });
  } catch (err) {
    console.error("Error in reset Password :", err);
    res.status(500).json("An error occurred. Please try again.");
  }
});
