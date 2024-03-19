import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import Product from "../../../../DB/models/product.model.js";
import { productType } from "./productType.js";

export const getOneProduct = new GraphQLObjectType({
  name: "singleProduct",
  description: "Get-One-Product ",
  type: productType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const product = await Product.findById({ _id: args._id });
    return product;
  },
});

export const getAllProducts = new GraphQLObjectType({
  name: "products",
  description: "Get-All-Products ",
  type: new GraphQLList(productType),
  resolve: async () => {
    let products = await Product.find();
    return products;
  },
});
export const productSchema = {
  AllProducts: getAllProducts,
  OneProduct: getOneProduct,
};
//  description: " product schema describtion ",
// name: "productSchema",
// fields: () => ({
