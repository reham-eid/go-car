import { Router } from "express";
import * as OrderController from "./order.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as JoiVal from "./order.validation.js";
import { allowTo, protectedRoute } from "../auth/auth.controller.js";
import express from "express";
const orderRouter = Router();

orderRouter.post(
  "/webhook",
  express.json({ type: "application/json" }), // req.body>>buffer data
  OrderController.createOnlineOrder
); //stripe

orderRouter
  .route("/:cartId")
  .post(
    protectedRoute,
    allowTo("user"),
    validation(JoiVal.addOrderVal),
    OrderController.createCashOrder
  );
orderRouter.post(
  "/checkout/:id",
  protectedRoute,
  allowTo("user"),
  validation(JoiVal.paramsIdVal),
  OrderController.createCheckoutSession
);
orderRouter.get(
  "/all",
  protectedRoute,
  allowTo("admin"),
  OrderController.allOrders
);
orderRouter
  .route("/")
  .get(protectedRoute, allowTo("user"), OrderController.OneOrder);

export default orderRouter;
