import bcryptjs from "bcryptjs";
import nodemailer from "nodemailer";
import asyncHandler from "express-async-handler";
import dotenv from "dotenv";
import randomstring from "randomstring";
import User from "../models/userModel.js";
import VerificationCode from "../models/verifyCodeModel.js";

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

export const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email");

    // Check if email is confirmed
    if (!user.isEmailConfirm)
      return res.status(400).json("Your account is not activated.");

    // Generate forget code
    const forgetCode = randomstring.generate({ charset: "numeric", length: 5 });

    // Save verification code
    await VerificationCode.create({ email, code: forgetCode });

    // Send email
    await transporter.sendMail({
      to: email,
      subject: "Password Reset Verification Code",
      text: `Your verification code is: ${forgetCode}`,
    });

    res.status(200).json("Verification code sent to your email.");
  } catch (err) {
    console.error("Error in requestPasswordReset:", err);
    res.status(500).json("An error occurred. Please try again.");
  }
};

export const verifyCode = async (req, res) => {
  const { email, code } = req.body;

  try {
    // Find the verification record
    const verification = await VerificationCode.findOneAndUpdate(
      { email, code },
      { forgetCodeVerified: true },
      { new: true }
    );

    if (!verification) {
      return res.status(400).json("Invalid or expired verification code.");
    }

    res.status(200).json("Code verified successfully.");
  } catch (err) {
    console.error("Error in verifyCode:", err);
    res.status(500).json("An error occurred. Please try again.");
  }
};

export const resetPassword = async (req, res) => {
  const { email, newPassword, confirmPassword } = req.body;

  try {
    // Check if verification exists
    const verification = await VerificationCode.findOne({
      email,
      forgetCodeVerified: true,
    });
    if (!verification)
      return res.status(400).json("No active reset request found.");

    // Find user and reset password
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json("Invalid email.");

    //compare 2-passwords
    const match = bcryptjs.compareSync(newPassword, user.password);
    // hash & update password
    if (match) {
      return res.status(409).json(
        "new password is the same as old password .. please change it",

      )
    }

    const hashedPassword = bcryptjs.hashSync(newPassword, 10);
    user.password = hashedPassword;
    user.changePassAt = Date.now();
    await user.save();

    // Delete verification record after successful reset
    await VerificationCode.deleteOne({ email });

    res.status(200).json("Password reset successfully. You can now log in.");
  } catch (err) {
    console.error("Error in resetPassword:", err);
    res.status(500).json("An error occurred. Please try again.");
  }
};
