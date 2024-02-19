import { Schema, Types, model } from "mongoose";

const CartSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
      unique: true, // one cart per user
    },
    cartItems: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
    coupon: {
      id: { type: Types.ObjectId, ref: "coupon" },
      name: { type: String },
      discount: {
        type: Number,
        required: true,
        min: 1,
        max: 80,
      },
    },
    // discount: { // ref Coupn
    //   type: Number,
    //   required: true,
    //   min: 1,
    //   max: 80,
    // },
  },
  { timestamps: true, strictQuery: true }
);

CartSchema.virtual("finalPrice").get(function () {
  return this.coupon
    ? Number.parseInt(
        this.totalPriceAfterDiscount -
          (this.totalPriceAfterDiscount * this.coupon.discount) / 100
      )
    : this.totalPriceAfterDiscount;
});
export const Cart= model("cart", CartSchema);
