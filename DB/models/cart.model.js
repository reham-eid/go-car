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
    discount: {
      type: Number,
      ref:"product"
    },
    totalPrice: Number,
    totalPriceAfterDiscount: Number,
  },
  {
    timestamps: true,
    strictQuery: true,
  }
);
//virtual ref on product


export const Cart = model("cart", CartSchema);
