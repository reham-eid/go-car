import express from "express";
import connectDB from "./DB/dbConnection.js";
import { config } from "dotenv";
import {init} from "./src/server.routes.js";
import cors from "cors";
import morgan from "morgan";

config({ path: "./config/dev.config.env" });
const app = express();

// DB Connection
await connectDB();
//morgan
if (process.env.NODE_ENV == "development") {
  app.use(morgan("dev"));
}
app.use(cors());
// API routes
init(app,express);

const port = 4001;

app.listen(process.env.PORT || port, () => {
  console.log(`server is running..! `); //port can be string or number
});
