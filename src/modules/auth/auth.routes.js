import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as authValidation from "./auth.validation.js";
import * as authController from "./auth.controller.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";
import { systemRoles } from "../../utils/system.roles.js";

const authRouter = Router();

authRouter
  .post("/signUp", validation(authValidation.signUpVal), authController.signUp)
  .get(
    "/acctivate_account/:emailToken",
    validation(authValidation.activeAccountVal),
    authController.activeAccount
  )
  .post("/login", validation(authValidation.loginVal), authController.logIn)
  .post("/login-with-google", validation(authValidation.logInWithGoogleVal), authController.logInWithGoogle)

  .patch(
    "/forget-password",
    validation(authValidation.forgetPassVal),
    authController.forgetPass
  )
  .patch(
    "/reset-password",
    validation(authValidation.resetPassVal),
    authController.resetPass
  );

export default authRouter;
