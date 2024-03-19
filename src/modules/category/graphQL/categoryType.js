import {
  GraphQLID,
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

export const categoryType = new GraphQLObjectType({
  name: "categoryType",
  description: "object of category ",
  fields: () => ({
    _id: { type: GraphQLID },
    name: { type: GraphQLString },
    slug: { type: GraphQLString },
    image: { type: imgType("CategoryImage") },
    createdBy: { type: GraphQLID },
  }),
});
