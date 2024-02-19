import Joi from "joi";
import { validateObjectId } from "../middlewares/validation.middleware.js";

const generalField = {
  name: Joi.string().trim(),
  email: Joi.string()
    .email({
      maxDomainSegments: 2,
      tlds: { allow: ["com", "pro"] },
    })
    .lowercase(),
  password: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")),
  confirmPassword: Joi.valid(Joi.ref("password")),
  age: Joi.number().min(10),
  role: Joi.string().valid("user", "admin"),
  id: Joi.string().custom(validateObjectId),
  address: Joi.object({
    street: Joi.string(),
    phone: Joi.string().pattern(
      new RegExp("^[+]?[(]?[0-9]{3}[)]?[-s.]?[0-9]{3}[-s.]?[0-9]{4,6}$")
    ),
    city: Joi.string(),
  }),
  file: Joi.object({
    fieldname: Joi.string().required(),
    originalname: Joi.string().required(),
    encoding: Joi.string().required(),
    mimetype: Joi.string()
      .valid("image/jpeg", "image/png", "application/pdf")
      .required(),
    size: Joi.number().max(5242880).required(),
    destination: Joi.string().required(),
    filename: Joi.string().required(),
    path: Joi.string().required(),
  }),
  count: Joi.number().integer(),
  expires: Joi.date().greater(Date.now()),
};

export default generalField;
