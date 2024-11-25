import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI;

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri, {
      // useNewUrlParser: true,
      // useUnifiedTopology: true,
      ssl: true,
      tlsAllowInvalidCertificates: true,
      connectTimeoutMS: 10000,  // 10 seconds timeout
      serverSelectionTimeoutMS: 5000,  // 5 seconds timeout
    });
    console.log("Connected to MongoDB");
  } catch (err) {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  }
};
