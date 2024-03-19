import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import Product from "../../../DB/models/product.model.js";
import SubCategory from "../../../DB/models/subCategory.model.js";
import Category from "../../../DB/models/category.model.js";
import Brand from "../../../DB/models/brand.model.js";
import { Cart } from "../../../DB/models/cart.model.js";
import Review from "../../../DB/models/review.model.js";
import {categorySchema} from "../category/graphQL/category.shema.js"
import {productSchema} from "../product/graphQL/product.shema.js"

// const imgType = (name) => {
//   return new GraphQLObjectType({
//     name: name || "image",
//     fields: () => ({
//       id: { type: GraphQLString },
//       url: { type: GraphQLString },
//     }),
//   });
// };
// const cartItemType = new GraphQLObjectType({
//   description: "object of cart ",
//   name: "cartItemType",
//   fields: () => ({
//     productId: { type: GraphQLID },
//     quantity: { type: GraphQLString },
//     price: { type: GraphQLInt },
//   }),
// });
// const couponType = new GraphQLObjectType({
//   description: "object of coupon ",
//   name: "couponType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     discount: { type: GraphQLInt },
//   }),
// });
// const productType = new GraphQLObjectType({
//   description: " product schema describtion ",
//   name: "productType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     title: { type: GraphQLString },
//     slug: { type: GraphQLString },
//     description: { type: GraphQLString },
//     cloudFolder: { type: GraphQLString },
//     imgCover: { type: imgType("productCover") },
//     images: { type: new GraphQLList(imgType("productImages")) },
//     price: { type: GraphQLFloat },
//     discount: { type: GraphQLInt },
//     quantity: { type: GraphQLInt },
//     sold: { type: GraphQLInt },
//     rateAvg: { type: GraphQLInt },
//     rateCount: { type: GraphQLInt },
//     createdBy: { type: GraphQLID },
//     categoryId: { type: GraphQLID },
//     subcategoryId: { type: GraphQLID },
//     brandId: { type: GraphQLID },
//   }),
// });
// const subCategoryType = new GraphQLObjectType({
//   description: "object of subCategory ",
//   name: "subCategoryType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     slug: { type: GraphQLString },
//     image: { type: imgType("subCategoryImage") },
//     createdBy: { type: GraphQLID },
//     categoryId: { type: GraphQLID },
//   }),
// });
// const categoryType = new GraphQLObjectType({
//   name: "categoryType",
//   description: "object of category ",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     slug: { type: GraphQLString },
//     image: { type: imgType("CategoryImage") },
//     createdBy: { type: GraphQLID },
//   }),
// });
// const brandType = new GraphQLObjectType({
//   description: "object of brand ",
//   name: "brandType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     name: { type: GraphQLString },
//     slug: { type: GraphQLString },
//     logo: { type: imgType("brandLogo") },
//     createdBy: { type: GraphQLID },
//   }),
// });
// const cartType = new GraphQLObjectType({
//   description: "object of category ",
//   name: "cartType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     cartItems: { type: new GraphQLList(cartItemType) },
//     totalPrice: { type: GraphQLFloat },
//     totalPriceAfterDiscount: { type: GraphQLFloat },
//     coupon: { type: couponType },
//     user: { type: GraphQLID },
//   }),
// });
// const reviewType = new GraphQLObjectType({
//   description: "object of review ",
//   name: "reviewType",
//   fields: () => ({
//     _id: { type: GraphQLID },
//     text: { type: GraphQLString },
//     rate: { type: GraphQLInt },
//     userId: { type: GraphQLID },
//     productId: { type: GraphQLID },
//   }),
// });
// const rootQuery = new GraphQLObjectType({
// name:"we",
//   fields: () => ({
//     OneProduct: {
//       type: productType,
//       args:{
//         _id : { type: new GraphQLNonNull(GraphQLString)}
//       },
//       resolve: async(parent , args) => {
//         const product = await Product.findById({_id: args});
//         return;
//       },
//     },

//     products: {
//       type: new GraphQLList(productType),
//       resolve: async () => {
//         let products = await Product.find();
//         return products;
//       },
//     },

//     categories: {
//       type: new GraphQLList(categoryType),
//       resolve: async () => {
//         let categories = await Category.find();
//         return categories;
//       },
//     },

//     brands: {
//       type: new GraphQLList(brandType),
//       resolve: async () => {
//         let brands = await Brand.find();
//         return brands;
//       },
//     },

//     subCategories: {
//       type: new GraphQLList(subCategoryType),
//       resolve: async () => {
//         let subCategories = await SubCategory.find();
//         return subCategories;
//       },
//     },

//     carts: {
//       type: new GraphQLList(cartType),
//       resolve: async () => {
//         let carts = await Cart.find();
//         return carts;
//       },
//     },

//     reviews: {
//       type: new GraphQLList(reviewType),
//       resolve: async () => {
//         let reviews = await Review.find();
//         return reviews;
//       },
//     },
//   }),
// });

export const schema = new GraphQLSchema({
  query: new GraphQLObjectType({
      name:'QuerySchema',
      description:'Root Query',
      fields:{
          ...categorySchema,
          ...productSchema}
      })
    })