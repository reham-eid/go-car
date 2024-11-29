import express from "express";
import {
  register,
  login,
  signupWithOAuth,
  loginWithOAuth,
} from "../controllers/authController.js";
import {
  registerValidation,
  loginValidation,
  resetPassValidation,
  forgetPassValidation,
  verifyCodeValidation,
} from "../validation/auth-validation.js";

import {
  requestPasswordReset,
  resetPassword,
  verifyCode,
} from "../controllers/forgetPassword.js";

const router = express.Router();

// Registration Route
router.post("/register", registerValidation, register);

// Login Route
router.post("/login", loginValidation, login);

// login with google router
router.post(
  "/login/with",
  (req, res, next) => {
    console.log("fi ehhhhhhhhh");
    next();
  },
  loginWithOAuth
);

// sign-up with google router
router.post("/sign-up/with", signupWithOAuth);

// request for reset password router
router.post("/forget-password", forgetPassValidation, requestPasswordReset);

// verify code router
router.post("/verify-code", verifyCodeValidation, verifyCode);

//reset new password router
router.put("/reset-password/", resetPassValidation, resetPassword);

export { router as authRouter };
