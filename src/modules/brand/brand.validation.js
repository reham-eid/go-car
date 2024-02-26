import Joi from "joi";
import generalField from "../../utils/generalFields.js";
import { validateObjectId } from "../../middlewares/validation.middleware.js";

const addBrandVal = Joi.object({
  name: generalField.name.min(2).max(50).required(),
  categories: Joi.array().items(Joi.string().custom(validateObjectId).required()),
  subCategories: Joi.array().items(Joi.string().custom(validateObjectId).required()),

  image: generalField.file.required(),
}).required();

const paramsIdVal = Joi.object({
  id: generalField.id.required(),
});

const updateBrandVal = Joi.object({
  name: generalField.name.min(2).max(50),
  id: generalField.id.required(),
  categories: Joi.array().items(Joi.string().custom(validateObjectId).required()),
  subCategories: Joi.array().items(Joi.string().custom(validateObjectId).required()),

  image: generalField.file,
});

export { addBrandVal, paramsIdVal, updateBrandVal };
