import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addCouponVal = Joi.object({

  discount: generalField.count.min(5).max(80).required(),
  expires: generalField.expires.required(),
}).required();

const paramsIdVal = Joi.object({
  code: generalField.name.length(8).required(),
}).required();

const updateCouponVal = Joi.object({
  code: generalField.name.length(8).required(),

  discount: generalField.count.integer().min(5).max(80),
  expires: generalField.expires,
}).required();

export { addCouponVal, paramsIdVal, updateCouponVal };
