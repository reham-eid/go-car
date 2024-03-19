import { Router } from "express";
import { validation } from "../../middlewares/validation.middleware.js";
import * as ProductController from "./product.controller.js";
import * as JoiVal from "./product.validation.js";
import { uploadFiles } from "../../services/fileUploads/multer.js";
import reviewRouter from "../review/review.routes.js";
import { allowTo, protectedRoute } from "../../middlewares/auth.js";
import { createHandler } from "graphql-http/lib/use/express";
import ducumentQL from "graphql-playground-middleware-express";
import { systemRoles } from "../../utils/system.roles.js";
const expressPlayground = ducumentQL.default;

const productRouter = Router();


// productRouter.use("/graphql-product", createHandler({ schema: productSchema }));
// productRouter.get("/product-gui", expressPlayground({ endpoint: "/graphql-product" }));

//Merge param
productRouter.use("/:productId/reviews",reviewRouter);


productRouter
  .route("/")
  .post(
    protectedRoute,
    allowTo(systemRoles.admin),
    uploadFiles([
      // req.files >> object
      { name: "imgCover", maxCount: 1 }, // array
      { name: "images", maxCount: 10 },
    ]),
    validation(JoiVal.addProductVal),
    ProductController.addProduct
  )
  .get(ProductController.getAllProduct);

productRouter
  .route("/:id")
  .get(validation(JoiVal.paramsIdVal), ProductController.OneProduct)
  .put(
    protectedRoute,
    allowTo(systemRoles.admin),
    uploadFiles([
      { name: "imgCover", maxCount: 1 },
      { name: "images", maxCount: 10 },
    ]),
    validation(JoiVal.updateProductVal),
    ProductController.updateProduct
  )
  .delete(
    protectedRoute,
    allowTo(systemRoles.admin),
    validation(JoiVal.paramsIdVal),
    ProductController.deleteProduct
  );

export default productRouter;
