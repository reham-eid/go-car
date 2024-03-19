import {
  GraphQLFloat,
  GraphQLID,
  GraphQLInt,
  GraphQLList,
  GraphQLObjectType,
  GraphQLString,
} from "graphql";

const imgType = (name) => {
  return new GraphQLObjectType({
    name: name || "image",
    fields: () => ({
      id: { type: GraphQLID },
      url: { type: GraphQLString },
    }),
  });
};

export const productType = new GraphQLObjectType({
  name: "productType",
  description:"object of product",
  fields: () => ({
    _id: { type: GraphQLID },
    title: { type: GraphQLString },
    slug: { type: GraphQLString },
    description: { type: GraphQLString },
    cloudFolder: { type: GraphQLString },
    imgCover: { type: imgType("productCover") },
    images: { type: new GraphQLList(imgType("productImages")) },
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
