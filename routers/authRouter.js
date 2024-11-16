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
} from "../middelware/validation.js";

import { userAuth } from "../middelware/userMiddleware.js";
import {
  requestPasswordReset,
  verifyCode,
  resetPassword,
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
router.post("/forget-password", userAuth, requestPasswordReset);

// verify code router
router.post("/verify-code", verifyCode);

//reset new password router
router.post("/reset-password", userAuth, loginValidation, resetPassword);

export { router as authRouter };
