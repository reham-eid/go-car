import mongoose from "mongoose";

const carSchema = new mongoose.Schema(
  {
    brand: {
      name: {
        type: String,
        required: true,
      },
      logo: {
        type: String,
      },
    },
    model: { type: Number, required: true },
    rating: { type: Number, default: 0 },
    reviews: { type: Number, default: 0 },
    pricePerHour: { type: Number, required: true },
    imageUrl: { type: String },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Car = mongoose.model("Car", carSchema);

export default Car;
