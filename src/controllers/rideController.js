import Ride from "../models/rideModel.js";
import Stripe from "stripe";

// console.log("Stripe API Key:", process.env.STRIPE_SECRET_KEY);

const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-08-16",
});
// Create a new ride
export const createRide = async (req, res) => {
  try {
    const { carId } = req.params;
    const {
      startDestination,
      endDestination,
      rideType,
      brand,
      paymentMethod,
      totalCost,
    } = req.body;
    if (!startDestination || !endDestination || !paymentMethod || !totalCost) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const newRide = new Ride({
      carId,
      startDestination,
      endDestination,
      rideType,
      brand,
      user: req.user._id, // token
      paymentMethod,
      totalCost,
    });

    if (paymentMethod === "online") {
      // Create a Stripe Payment Intent
      const paymentIntent = await stripeInstance.paymentIntents.create({
        amount: totalCost * 100,
        currency: "egp",
        automatic_payment_methods: {
          enabled: true,
        },
      });

      newRide.paymentStatus = "pending";
      await newRide.save();

      return res.status(201).json({
        message: "Ride created, complete online payment",
        ride: newRide,
        paymentIntentClientSecret: paymentIntent.client_secret,
      });
    } else {
      // Cash payment
      newRide.paymentStatus = "pending"; // Payment is handled manually
      await newRide.save();

      return res.status(201).json({
        message: "Ride created, payment expected in cash",
        ride: newRide,
      });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating ride", error: err });
  }
};

// Cancel a ride
export const cancelRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, user: req.user._id },
      { status: "cancelled" },
      { new: true }
    );

    if (!ride) {
      return res
        .status(404)
        .json({ message: "Ride not found or unauthorized" });
    }

    res.status(200).json({ message: "Ride cancelled successfully", ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error cancelling the ride" });
  }
};

// End a ride
export const endRide = async (req, res) => {
  try {
    const rideId = req.params.rideId;

    const ride = await Ride.findOneAndUpdate(
      { _id: rideId, user: req.user._id },
      { status: "completed" },
      { new: true }
    );

    if (!ride) {
      return res
        .status(404)
        .json({ message: "Ride not found or unauthorized" });
    }

    res.status(200).json({ message: "Ride ended successfully", ride });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error ending the ride" });
  }
};
