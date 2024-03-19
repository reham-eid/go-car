import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import Category from "../../../../DB/models/category.model.js";
import { categoryType } from "./categoryType.js";

export const getCategories = new GraphQLObjectType({
  name: "AllCategory",
  description: "Get-All-Categories ",
  type: new GraphQLList(categoryType),
  resolve: async () => {
    let categories = await Category.find();
    return categories;
  },
});
export const getOnecategory = new GraphQLObjectType({
  name: "singleCategory",
  description: "Get-One-Category ",
  type: categoryType,
  args: {
    _id: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (parent, args) => {
    const category = await Category.findById({ _id: args._id });
    return category;
  },
});
export const categorySchema = {
  Onecategory: getOnecategory,
  categories: getCategories,
};
