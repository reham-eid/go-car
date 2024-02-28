import { Router } from "express";
import * as WishListController from "./wishList.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as JoiVal from "./wishList.validation.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const wishListRouter = Router();

wishListRouter
  .route("/")
  .patch(
    protectedRoute,
    allowTo("user"),
    validation(JoiVal.addToWishListVal),
    WishListController.addToWishList
  )
  .get(protectedRoute, allowTo("user"), WishListController.getWishList);

wishListRouter
  .route("/:id")
  .delete(
    protectedRoute,
    allowTo("user", "admin"),
    validation(JoiVal.paramsIdVal),
    WishListController.removeFromWishList
  );

export default wishListRouter;
