import { Schema, Types, model } from "mongoose";

const ReviewSchema = new Schema(
  {
    comment: {
      type: String,
      trim: true,
      required: true,
      minLength: [2, "too short of Review comment "],
      maxLength: [500, "too long of Review comment "],

    },
    rate: {
      type: Number,
      min: 0,
      max: 5,
    },
    productId: {
      type: Types.ObjectId,
      ref: "product",
    },
    userId: {
      type: Types.ObjectId,
      ref: "user",
    },
    orderId: {
      type: Types.ObjectId,
      ref: "order",
    },
    image: {
      id: { type: String, required: true },
      url: { type: String, required: true },
    },
  },
  { timestamps: true, strictQuery: true }
);
ReviewSchema.pre(/^find/, function () {
  //['find','findOne'] it works with all or single
  this.populate("user", "username", "age");
});
const Review = model("review", ReviewSchema);
export default Review;
