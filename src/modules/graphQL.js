import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLSkipDirective,
  GraphQLString,
} from "graphql";
import Product from "../../DB/models/product.model.js";
import SubCategory from "../../DB/models/subCategory.model.js";
import Category from "../../DB/models/category.model.js";
import Brand from "../../DB/models/brand.model.js";
import { Cart } from "../../DB/models/cart.model.js";
import Review from "../../DB/models/review.model.js";

const imgType = new GraphQLObjectType({
  name: "imgType",
  fields: () => ({
    id: { type: GraphQLString },
    url: { type: GraphQLString },
  }),
});
const cartItemType = new GraphQLObjectType({
  name: "cartItemType",
  fields: () => ({
    productId: { type: GraphQLID },
    quantity: { type: GraphQLString },
    price: { type: GraphQLInt },

  }),
});
const couponType = new GraphQLObjectType({
  name: "couponType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    discount: { type: GraphQLInt },

  }),
});
const productType = new GraphQLObjectType({
  name: "productType",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    cloudFolder: { type: GraphQLString },
    imgCover: { type: imgType },
    images: { type: new GraphQLList(imgType) },
    price: { type: GraphQLFloat },
    discount: { type: GraphQLInt },
    quantity: { type: GraphQLInt },
    sold: { type: GraphQLInt },
    rateAvg: { type: GraphQLInt },
    rateCount: { type: GraphQLInt },
    createdBy: { type: GraphQLID },
    categoryId: { type: GraphQLID },
    subcategoryId: { type: GraphQLID },
    brandId: { type: GraphQLID },
  }),
});
const subCategoryType = new GraphQLObjectType({
  name: "subCategoryType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    image: { type: imgType },
    createdBy: { type: GraphQLID },
    categoryId: { type: GraphQLID },

  }),
});
const categoryType = new GraphQLObjectType({
  name: "categoryType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    image: { type: imgType },
    createdBy: { type: GraphQLID },
  }),
});
const brandType = new GraphQLObjectType({
  name: "brandType",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    logo: { type: imgType },
    createdBy: { type: GraphQLID },

  }),
});
const cartType = new GraphQLObjectType({
  name: "cartType",
  fields: () => ({
    _id: { type: GraphQLID },
    cartItems: { type: new GraphQLList(cartItemType) },
    totalPrice: { type: GraphQLFloat },
    totalPriceAfterDiscount: { type: GraphQLFloat },
    coupon: { type: couponType },
    user: { type: GraphQLID },

  }),
});
const reviewType = new GraphQLObjectType({
  name: "reviewType",
  fields: () => ({
    _id: { type: GraphQLID },
    text: { type: GraphQLString },
    rate: { type: GraphQLInt },
    userId: { type: GraphQLID },
    productId: { type: GraphQLID },

  }),
});
const rootQuery = new GraphQLObjectType({
  name: "product",
  fields: () => ({
    // OneProduct: {
    //   type: productType,
    //   resolve: async(parent) => {
    //     const product = await Product.findById(req.params.id);
    //     return;
    //   },
    // },

    products: {
      type: new GraphQLList(productType),
      resolve: async () => {
        let products = await Product.find();
        return products;
      },
    },

    categories: {
      type: new GraphQLList(categoryType),
      resolve: async () => {
        let categories = await Category.find();
        return categories;
      },
    },

    brands: {
      type: new GraphQLList(brandType),
      resolve: async () => {
        let brands = await Brand.find();
        return brands;
      },
    },

    subCategories: {
      type: new GraphQLList(subCategoryType),
      resolve: async () => {
        let subCategories = await SubCategory.find();
        return subCategories;
      },
    },

    carts: {
      type: new GraphQLList(cartType),
      resolve: async () => {
        let carts = await Cart.find();
        return carts;
      },
    },

    reviews: {
      type: new GraphQLList(reviewType),
      resolve: async () => {
        let reviews = await Review.find();
        return reviews;
      },
    },

  }),
});

export const schema = new GraphQLSchema({
  query: rootQuery,
});
