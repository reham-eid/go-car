import express from "express";
import connectDB from "./DB/dbConnection.js";
import { config } from "dotenv";
import {init} from "./src/server.routes.js";
import cors from "cors";
import morgan from "morgan";

config({ path: "./config/dev.config.env" });

const app = express();
//الترتيب؟؟؟؟؟؟
// DB Connection
await connectDB();

app.use(cors());
app.use((req, res, next) => {
  if (req.originalUrl === "/api/v1/orders/webhook") {
    return next();
  }
  express.json()(req, res, next);
});
app.use(express.urlencoded({ extended: true }));

if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}

// API routes
init(app);

const port = 4001;

app.listen(process.env.PORT || port, () => {
  console.log(`server is running..! `); //port can be string or number
});
