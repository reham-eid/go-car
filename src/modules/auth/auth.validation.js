import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const signUpVal = Joi.object({
  username:generalField.name.required(),
  email: generalField.email.required(),
  password: generalField.password.required(),
  confirmPassword: generalField.confirmPassword.required(),
  age: generalField.age,
  role: generalField.role,
}).required();

const activeAccountVal = Joi.object({
  emailToken: generalField.name.required(),
}).required();

const loginVal = Joi.object({
  email: generalField.email.required(),
  password: generalField.password.required(),
}).required();

const forgetPassVal = Joi.object({
  email: generalField.email.required(),
}).required();

const resetPassVal = Joi.object({
  password: generalField.password.required(),
  confirmPassword: generalField.confirmPassword.required(),
  code: generalField.name.length(5).required(),
}).required();

export { signUpVal, activeAccountVal, loginVal, forgetPassVal, resetPassVal };
