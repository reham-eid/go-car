import { Router } from "express";
import * as CouponController from "./coupon.controller.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { allowTo, protectedRoute } from "../auth/auth.controller.js";
import * as JoiVal from "./coupon.validation.js";

const couponRouter = Router();

couponRouter.use(protectedRoute, allowTo("admin"));
couponRouter
  .route("/")
  .post(validation(JoiVal.addCouponVal), CouponController.addCoupon)
  .get(CouponController.allCoupons);

couponRouter
  .route("/:code")
  .get(validation(JoiVal.paramsIdVal), CouponController.OneCoupon)
  .put(
    validation(JoiVal.updateCouponVal),
    CouponController.updateCoupon // BIG PROPLEM
  )
  .delete(
    validation(JoiVal.updateCouponVal),
    validation(JoiVal.paramsIdVal),
    CouponController.deleteCoupon
  );

export default couponRouter;
