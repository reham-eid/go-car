import Joi from "joi";
import generalField from "../../utils/generalFields.js";

const addProductVal = Joi.object({
  title: generalField.name.min(2).max(50).required(),
  description: generalField.name.min(10).max(100).required(),
  price: generalField.count.required(),
  discount: generalField.count.min(0).optional(),
  quantity: generalField.count.min(1).optional(),
  specefication: Joi.object().keys({
    color:Joi.array()
  }).required(),
  createdBy: generalField.id.optional(),
  categoryId: generalField.id.required(),
  subCategoryId: generalField.id.required(),
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
  description: generalField.name.min(10).max(100),
  price: generalField.count,
  priceAfterDiscount: generalField.count.min(0).optional(),
  quantity: generalField.count.min(0).optional(),
  oldimgCoverID:Joi.array().items(generalField.id).optional(),
  oldImgsIDs:generalField.id.optional(),
  createdBy: generalField.id.optional(),

  imgCover: Joi.array().items(generalField.file),
  images: Joi.array().items(generalField.file),
});

export { addProductVal, paramsIdVal, updateProductVal };
