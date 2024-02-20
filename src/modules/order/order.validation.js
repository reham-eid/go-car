import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addOrderVal = Joi.object({
  cartId:generalField.id.required(),

  address:generalField.address.required(),
  payment:generalField.name.valid("cash", "visa")
});

const paramsIdVal = Joi.object({
  id:generalField.id.required(),

  address:generalField.address.required(),
});

const updateOrderVal = Joi.object({
  name: generalField.name.min(2).max(50),
  id: generalField.id.required(),

  image: generalField.file.optional(),
});

export { addOrderVal, paramsIdVal, updateOrderVal };
