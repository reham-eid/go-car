import express from "express";
import dotenv from "dotenv";
import appUse from "./src/appHelper.js";

dotenv.config();

const app = express();


async function bootStrap() {
  try {
    app.get("/api/greeting", (req, res) => {
      res.json({ greeting: "Hello Go Car " });
    });
    // EXECUTE  appUse here
    appUse(app);

    /* Start server */
    const serverListen = app.listen(process.env.PORT || port, () => {
      console.log(`🚀 Server listening on port ${process.env.PORT}`);
    });

    /* Handling rejection outside express */
    process.on("unhandledRejection", (error) => {
      throw error;
    });

    /* Handling exception */
    const uncaughtException = (error) => {
      serverListen.close(() => {
        console.error(
          `The server was shut down due to uncaught exception: ${error.message}`
        );
        process.exit(1);
      });
    };

    process.on("uncaughtException", uncaughtException);

    /* Handle process termination signals */
    const shutdown = () => {
      serverListen.close(() => {
        console.log("The server is shutting down...");
        process.exit(0);
      });
    };

    process.on("SIGTERM", shutdown);
    process.on("SIGINT", shutdown);
  } catch (error) {
    console.error(`An error occurred during startup: ${error.message}`);
    process.exit(1);
  }
  return console.log(`${process.env.BASE_URL}login/member-password?`);
}

bootStrap();
