import { body } from "express-validator";
import { validatorHandlerMiddleware } from "../middelware/validatorHandlerMiddleware.js";

// validation for register method
export const registerValidation = [
  body("userName").notEmpty().withMessage("userName is required"),
  body("address").notEmpty().withMessage("address is required"),
  body("email").isEmail().withMessage("email is invalid"),
  body("password")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.password) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  body("phone").isNumeric().withMessage("Phone number must be numeric"),
  body("role").optional().isString().withMessage("Role must be a string"),
  validatorHandlerMiddleware,
];

// validation for login method
export const loginValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("rememberMe")
    .optional()
    .isBoolean()
    .toBoolean()
    .withMessage("Remember Me must be a boolean"),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  validatorHandlerMiddleware,
];

// validation for Forget Password method
export const forgetPassValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  validatorHandlerMiddleware,
];
// validation for verify Code method
export const verifyCodeValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("code").notEmpty().isNumeric().withMessage("code is required"),
  validatorHandlerMiddleware,
];
// validation for Reset Password method
export const resetPassValidation = [
  body("email").isEmail().withMessage("Invalid email address"),
  body("newPassword")
    .isLength({ min: 8 })
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage(
      "Password must contain at least one uppercase letter, one lowercase letter, and one number"
    ),
  body("confirmPassword").custom((value, { req }) => {
    if (value !== req.body.newPassword) {
      throw new Error("Passwords do not match");
    }
    return true;
  }),
  validatorHandlerMiddleware,
];
