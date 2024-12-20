import express from "express";
import dotenv from "dotenv";
import appUse from "./src/appHelper.js";
import { Server } from "socket.io";
import fs from "fs";
import https from "https";
import jwt from "jsonwebtoken";

dotenv.config();

const app = express();

async function bootStrap() {
  try {
    app.get("/api/greeting", (req, res) => {
      console.log("API Greeting endpoint accessed.");
      res.json({ greeting: "Hello Go Car" });
    });

    // Execute middleware and helper setup
    appUse(app);

    // const URL =
    //   process.env.NODE_ENV === "production"
    // ? "https://go-car-drab.vercel.app"
    // : "http://localhost:3001";

    // /* Start server */
    // const serverListen = app.listen(process.env.PORT || 3001, () => {
    //   console.log(`🚀 Server listening on port ${process.env.PORT}`);
    // });

    let serverListen;

    // Check if SSL certificates exist in production
    const hasSSLCert =
      fs.existsSync(process.env.SSL_CERT) && fs.existsSync(process.env.SSL_KEY);

    if (process.env.NODE_ENV === "production" && hasSSLCert) {
      const privateKey = fs.readFileSync(process.env.SSL_KEY);
      const certificate = fs.readFileSync(process.env.SSL_CERT);
      const credentials = { key: privateKey, cert: certificate };

      serverListen = https.createServer(credentials, app);
      console.log("Running with HTTPS (SSL)");
    } else {
      serverListen = app.listen(process.env.PORT);
      console.log("Running with HTTP (No SSL)");
    }

    console.log(`🚀 Server running on port ${process.env.PORT}`);

    const io = new Server(serverListen, {
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
      transports: ["websocket", "polling"],
      reconnection: true,
      reconnectionAttempts: 5,
    });

    // Middleware to authenticate token
    io.use((socket, next) => {
      const authHeader = socket.handshake.headers.authentication;
      const token = authHeader?.split(" ")[1];
      if (!token) {
        return next(new Error("Authentication error: No token provided"));
      }

      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
          return next(new Error("Authentication error: Invalid token"));
        }
        socket.user = decoded; // Attach user data to the socket object
        console.log(socket.user, ">> socket.user ");

        next();
      });
    });

    // Socket.IO Logic
    io.on("connection", (socket) => {
      console.log(`Client connected: ${socket.id}, User: ${socket.user.id}`);

      // Join a support room (user or session-specific)
      socket.on("joinSupportRoom", ({ recipientId, recipientName }) => {
        const roomId = `${socket.user.id}-${recipientId}`;
        const roomName = `${socket.user.name}-${recipientName}`;
        socket.join(roomId);
        console.log(`Socket ${socket.id} joined room: ${roomId} (${roomName})`);
      });

      // Handle message sending to support
      socket.on("sendMessageToSupport", (data) => {
        const { roomId, message } = data;
        console.log(
          `1-Message from ${socket.user.name} (${socket.user.id}) in room ${roomId}: ${message}`
        );

        io.to(roomId).emit("newSupportMessage", {
          senderId: socket.user.id,
          senderName: socket.user.name,
          message,
          timestamp: new Date().toISOString(),
        });
        console.log(
          `2-Message from ${socket.user.name} (${socket.user.id}) in room ${roomId}: ${message}`
        );
      });

      // Handle disconnect
      socket.on("disconnect", () => {
        console.log(`Client disconnected: ${socket.id}`);
      });
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

    console.log(`${process.env.BASE_URL}login/member-password?`);
  } catch (error) {
    console.error(`An error occurred during startup: ${error.message}`);
    process.exit(1);
  }
}

bootStrap();
