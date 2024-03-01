import { Router } from "express";
import * as CartController from "./cart.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as JoiVal from "./cart.validation.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const CartRouter = Router();

CartRouter.route("/")
  .post(
    protectedRoute,
    allowTo("user"),
    validation(JoiVal.addToCartVal),
    CartController.addCart
  )
  .get(protectedRoute, allowTo("user"), CartController.getLogedUserCart)
  .delete(protectedRoute, allowTo("user"), CartController.clearUserCart);

CartRouter.route("/:id")
  .get(
    protectedRoute,
    allowTo("admin"),
    validation(JoiVal.paramsIdVal),
    CartController.getAllCart
  )
  .put(
    protectedRoute,
    allowTo("user", "admin"),
    validation(JoiVal.paramsIdVal),
    CartController.removeItemFromCart
  );

export default CartRouter;
