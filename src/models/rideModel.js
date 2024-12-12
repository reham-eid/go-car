import mongoose from "mongoose";

// Define a sub-schema for location details
const locationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  latitude: { type: Number, required: true },
  longitude: { type: Number, required: true },
});

const rideSchema = new mongoose.Schema(
  {
    startDestination: {
      type: locationSchema,
      required: true,
    },
    endDestination: {
      type: locationSchema,
      required: true,
    },
    rideType: {
      type: String,
      enum: ["share_ride", "single_ride"],
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    carId: { type: mongoose.Schema.Types.ObjectId, ref: "Car", required: true },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["ongoing", "completed", "cancelled"],
      default: "ongoing",
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "online"],
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid"],
      default: "pending",
    },
    totalCost: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Ride = mongoose.model("Ride", rideSchema);

export default Ride;
