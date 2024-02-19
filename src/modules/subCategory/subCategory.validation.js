import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addSubCategoryVal = Joi.object({
  name: generalField.name.min(2).max(50).required(),
  category: generalField.id.required(),
  image: generalField.file.required()
});

const paramsIdVal = Joi.object({
  id: generalField.id.required(),
  category: generalField.id,

});

const updateSubCategoryVal = Joi.object({
  id: generalField.id.required(),

  name: generalField.name.min(2).max(50),
  category: generalField.id,
});

export { addSubCategoryVal, paramsIdVal, updateSubCategoryVal };
