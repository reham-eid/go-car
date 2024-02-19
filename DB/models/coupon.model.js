import { Schema, Types, model } from "mongoose";

const CouponSchema = new Schema(
  {
    code: {
      type: String,
      trim: true,
      minLength: 1,
      maxLength: 8,
      unique:true,
      required: true,
    },
    discount: {
      type: Number,
      required: true,
      min: 1,
      max: 80,
    },
    expires: Date,
    createdBy: {
      type: Types.ObjectId,
      ref: "user",
      required: true,
    },
  },
  { timestamps: true, strictQuery: true }
);

const Coupon = model("coupon", CouponSchema);
export default Coupon;
