import { Schema, Types, model } from "mongoose";

const orderSchema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "user",
    },
    cart: [
      {
        productId: {
          type: Types.ObjectId,
          ref: "product",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        // name: String,
        itemPrice: Number,
      },
    ],
    shippingAddress: {
      street: String,
      phone: String,
      city: String,
    },
    payment: {
      type: String,
      enum: ["cash", "visa"],
      default: "cash",
    },
    totalOrderPrice: {
      type: Number,
      required: true,
    },
    invoice: {
      url: { type: String },
      id: { type: String },
    },
    status: {
      type: String,
      enum: [
        "placed",
        "shipped",
        "cancled",
        "delivered",
        "refunded",
        "visa payed",
        "failed to payed",
      ],
      default: "placed",
    },
    deliveredAt: Date,
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: Date,
  },
  { timestamps: true, strictQuery: true }
);

// orderSchema.virtual("finalPrice").get(function () {
//   return this.coupon
//     ? Number.parseInt(
//         this.totalOrderPrice -
//           (this.totalOrderPrice * this.coupon.discount) / 100
//       )
//     : this.totalOrderPrice;
// });
const Order = model("order", orderSchema);
export default Order;
