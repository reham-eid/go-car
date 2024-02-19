import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addReviewVal = Joi.object({
  text: generalField.name.min(2).max(200).required(),
  rate: generalField.count.min(0).max(5).required(),
  productId: generalField.id.required(),
});

const paramsIdVal = Joi.object({
  id: generalField.id.required(),
});

const updateReviewVal = Joi.object({
  text: generalField.name.max(200),
  rate: generalField.count.min(0).max(5),
  productId: generalField.id,
});

export { addReviewVal, paramsIdVal, updateReviewVal };
