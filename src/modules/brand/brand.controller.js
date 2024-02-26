import slugify from "slugify";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import Brand from "../../../DB/models/brand.model.js";
import { ApiFeature } from "../../utils/ApiFeature.js";
import cloudinary from "../../services/fileUploads/cloudinary.js";
import Category from "../../../DB/models/category.model.js";
import SubCategory from "../../../DB/models/subCategory.model.js";

const addBrand = asyncHandler(async (req, res, next) => {
  const { name } = req.body;
  // check categories [ {electronic},{hoom},{men}] array of objectIds
  const { categoryId, subCategoryId } = req.query;
  // check subCategories in db
  const isSubCategories = await SubCategory.findById(subCategoryId);
  if (!isSubCategories) {
    return next(new Error(`subCategory not founnd `, { cause: 404 }));
  }
  //check dublicate brand
  const isBrand = await Brand.findOne({ name, subCategoryId });
  if (!isBrand) {
    return next(new Error(`brand already exisit `, { cause: 409 }));
  }
  // check subCategoryID belongs to Category
  if (isSubCategories.categoryId !== categoryId) {
    return next(
      new Error(`subCategoryID not belong to this CategoryID ${categoryId} `)
    );
  }

  if (!req.file)
    return next(new Error("brand image is required", { cause: 400 }));
  //upload img in cloudinary
  const { public_id, secure_url } = await cloudinary.uploader.upload(
    req.file.path,
    { folder: `${process.env.CLOUD_FOLDER_NAME}/brand` }
  );
  const brand = await Brand.create({
    name: name,
    slug: slugify(name),
    createdBy: req.user._id,
    logo: { id: public_id, url: secure_url },
  });

  res.status(201).json({ message: "Brand added successfuly", brand });
});

const getAllBrand = asyncHandler(async (req, res) => {
  let apiFeature = new ApiFeature(Brand.find({}), req.query)
    .fields()
    .sort()
    .pagination()
    .filter()
    .search();
  const brand = await apiFeature.mongoQuery;
  res.status(200).json({ message: "All Brand", brand });
});

const OneBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (!brand) return res.status(404).json({ message: "brand Not found" });
  res.status(200).json({ message: "brand of this Id:", brand });
});

const updateBrand = asyncHandler(async (req, res, next) => {
  const { categories, name, subCategories } = req.body;

  // check brand exisit
  const brand = await Brand.findById(req.params.id);
  if (!brand) return res.status(404).json({ message: "brand Not found" });

  categories?.forEach(async (categoryId) => {
    const category = await Category.findById(categoryId);
    if (!category)
      return next(
        new Error(`category with this ID:  ${categoryId} Not found`, {
          cause: 404,
        })
      );
  });
  subCategories?.forEach(async (subCategoryId) => {
    const subCategory = await SubCategory.findById(subCategoryId);
    if (!subCategory)
      return next(
        new Error(`subCategory with this ID:  ${subCategoryId} Not found`, {
          cause: 404,
        })
      );
  });

  if (req.file) {
    //update img in cloudinary
    const { public_id, secure_url } = await cloudinary.uploader.upload(
      req.file.path,
      {
        public_id: brand.logo.id,
      }
    );
    brand.logo = { id: public_id, url: secure_url };
  }
  brand.name = name ? name : brand.name;
  brand.slug = name ? slugify(name) : brand.slug;

  // update categories
  categories?.forEach(async (categoryId) => {
    await Category.findByIdAndUpdate(categoryId, {
      $push: { brands: brand._id },
    });
  });
  // update subCategories
  subCategories?.forEach(async (subCategoryId) => {
    await SubCategory.findByIdAndUpdate(subCategoryId, {
      $push: { brands: brand._id },
    });
  });
  await brand.save();
  res.status(200).json({ message: "brand updated", brand });
});

const deleteBrand = asyncHandler(async (req, res, next) => {
  // check brand
  // delete brand if exisit
  const brand = await Brand.findByIdAndDelete(req.params.id);
  if (!brand) return res.status(404).json({ message: "brand Not found" });
  // delete logo
  await cloudinary.uploader.destroy(brand.logo.id);
  // delete categoreies from Categort Model
  await Category.updateMany({}, { $pull: { brands: brand._id } });
  // send res

  res.status(200).json({ message: "delete brand successfully:", brand });
});

export { addBrand, getAllBrand, OneBrand, deleteBrand, updateBrand };
