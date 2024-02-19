import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addProductVal = Joi.object({
  title: generalField.name.min(2).max(50).required(),
  description: generalField.name.min(5).max(100).required(),
  price: generalField.count.min(0).required(),
  discount: generalField.count.min(0).optional(),
  quantity: generalField.count.min(1).optional(),

  createdBy: generalField.id.optional(),
  categoryId: generalField.id.required(),
  subcategoryId: generalField.id.required(),
  brandId: generalField.id.required(),

  imgCover: Joi.array().items(generalField.file).required(),
  images: Joi.array().items(generalField.file).required(),
});

const paramsIdVal = Joi.object({
  id: generalField.id.required(),
});

const updateProductVal = Joi.object({
  id: generalField.id.required(),

  title: generalField.name.min(2).max(50),
  description: generalField.name.min(5).max(100),
  price: generalField.count.min(0),
  priceAfterDiscount: generalField.count.min(0).optional(),
  quantity: generalField.count.min(0).optional(),

  createdBy: generalField.id.optional(),
  categoryId: generalField.id,
  subcategoryId: generalField.id,
  brandId: generalField.id,

  imgCover: Joi.array().items(generalField.file),
  images: Joi.array().items(generalField.file),
});

export { addProductVal, paramsIdVal, updateProductVal };
