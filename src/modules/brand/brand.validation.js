import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addBrandVal = Joi.object({
  name: generalField.name.min(2).max(50).required(),
  categories: generalField.id.required(),
  image: generalField.file.required(),
}).required();

const paramsIdVal = Joi.object({
  id: generalField.id.required(),
});

const updateBrandVal = Joi.object({
  name: generalField.name.min(2).max(50),
  id: generalField.id.required(),

  image: generalField.file,
});

export { addBrandVal, paramsIdVal, updateBrandVal };
