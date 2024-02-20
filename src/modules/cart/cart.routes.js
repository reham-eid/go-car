import { Router } from "express";
import * as CartController from "./cart.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { allowTo, protectedRoute } from "../auth/auth.controller.js";
import * as JoiVal from "./cart.validation.js";

const CartRouter = Router();

CartRouter.put("/apply-coupon",
    protectedRoute,
    allowTo("user"),
    validation(JoiVal.applyCouponVal),
    CartController.applyCoupon
  )
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
  .delete(
    protectedRoute,
    allowTo("user", "admin"),
    validation(JoiVal.paramsIdVal),
    CartController.removeItemFromCart
  );

export default CartRouter;
