import express from "express";

import { connectDB } from "./dbConnection/mongoose.js";
import errorHandler from "./middelware/globalErrorHndler.js";
import morgan from "morgan";
import cors from "cors";
import { authRouter } from "./routers/authRouter.js";
import { rideRouter } from "./routers/rideRouter.js";
import { carRouter } from "./routers/carRoutes.js";

const appUse = (app) => {
  // Connect to MongoDB
  // console.log(`DATABASE_URL: ${process.env.DATABASE_URL}`);
  connectDB();

  // Set security HTTP headers
  // app.use(helmet());

  app.use(morgan("dev"));

  app.use(express.json());
  app.use(express.static("public")); // serve static files from the public directory

  // Data sanitization against XSS
  // app.use(sanitizeInput);

  // MongoDB data sanitization
  // app.use(mongoSanitize());

  // handle cors
  app.use(
    cors({
      origin: "*",
      methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
      allowedHeaders: ["Content-Type", "Authorization", "Accept", "Rolemange"],
      // preflightContinue: true,
    })
  );

  // Prevents attackers from identifying the server framework
  app.disable("x-powered-by");

  // set app use
  app.use("/api/auth", authRouter);
  app.use("/api/ride", rideRouter);

  app.use("/api/car", carRouter);


  // Handles requests for routes that do not exist
  app.all("*", (req, res, next) => {
    next(
      new Error(`ops, this route ${req.originalUrl} does not exist,please read the documentation`, { cause: 404 })
    );
  });

  // Global Error Handler
  app.use(errorHandler);
};

export default appUse;
