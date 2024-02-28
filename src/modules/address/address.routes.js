import { Router } from "express";
import * as addressController from "./address.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import * as JoiVal from "./address.validation.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";

const addressRouter = Router();

addressRouter
  .route("/")
  .patch(
    protectedRoute,
    allowTo("user"),
    validation(JoiVal.addAddressVal),
    addressController.addAddress
  )
  .get(protectedRoute, allowTo("user"), addressController.getaddress);

addressRouter
  .route("/:id")
  .delete(
    protectedRoute,
    allowTo("user", "admin"),
    validation(JoiVal.paramsIdVal),
    addressController.removeAddress
  );

export default addressRouter;
