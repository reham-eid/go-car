import { Cart } from "../../../DB/models/cart.model.js";
import Coupon from "../../../DB/models/coupon.model.js";
import Product from "../../../DB/models/product.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";

const pricCalc = async (model) => {
  let totalPrice = 0;
  model.cartItems.forEach((item) => {
    totalPrice += item.quantity * item.price;
  });
  model.totalPrice = totalPrice;
  await model.save();
};

const addCart = asyncHandler(async (req, res, next) => {
  // check productId if exisit or not
  const product = await Product.findById(req.body.productId);
  !product && next(new Error("product not found", { cause: 404 }));
  // check productQuantity
  if (!product.inStock(req.body.quantity))
    return next(
      new Error(`sorry, only ${product.quantity} items is avaliable`, {
        cause: 400,
      })
    );
  // put product.price in res
  req.body.price = product.price;

  // one cart per user
  const isCart = await Cart.findOne({ user: req.user._id });
  // check if cart exisit or not

  //if not exisit {create cart, push product}
  if (!isCart) {
    const cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
      discount: req.body.discount,
    });
    //calc total price
    await pricCalc(cart);
    if (!cart) return res.status(404).json({ message: "cart Not found" });
    res.status(201).json({ message: "added to cart successfully ", cart });
  } else {
    //if exisit { push product}{if product>> its quantity >> check quantity in db}
    // find if body.product === cartItems.product (same product)
    let item = isCart.cartItems.find((i) => i.productId == req.body.productId); // shallow copy
    //then add one product in quantity
    console.log(item);
    if (item) {
      //check quantity in db مع كل مره بيزود
      if (item.quantity >= product.quantity)
        return next(new Error("product sold out"));
      item.quantity += req.body.quantity || 1;
    }

    // else push new product to cart
    else isCart.cartItems.push(req.body);

    // calc total price
    await pricCalc(isCart);
    // save in db
    // send res
    res
      .status(201)
      .json({ message: "added to cart successfully ", cart: isCart });
  }
});

const applyCoupon = asyncHandler(async (req, res, next) => {
  // check coupon in couponModel
  const coupon = await Coupon.findOne({
    code: req.body.coupon,
    expires: { $gt: Date.now() },
  });
  if (!coupon) return next(new Error("Invalid Coupon", { cause: 404 }));
  // check cart
  const cart = await Cart.findOne({ user: req.user._id });
  // calc totalPriceAfterDiscount
  const totalPrice = cart.totalPrice;
  const totalPriceAfterDiscount = (
    totalPrice -
    (totalPrice * coupon.discount) / 100
  ).toFixed(2);
  cart.totalPriceAfterDiscount = totalPriceAfterDiscount
  await cart.save()
  //send res
  res.status(201).json({message:"apply Coupon siccessfully" , cart})
});
const removeItemFromCart = asyncHandler(async (req, res, next) => {
  // check productId if exisit or not
  const product = await Product.findById(req.params.id);
  !product && next(new Error("product not found", { cause: 404 }));

  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, cartItems: { $elemMatch: req.params.id } }, //
    { $pull: { cartItems: { productId: req.params.id } } }, //{ _id: req.params.id }
    { new: true }
  );
  if (!cart)
    return res
      .status(404)
      .json({ message: "cart Not found or product not found this cart" });
  if (cart.cartItems.length === 0) {
    await cart.deleteOne();
    return res.status(404).json({
      status: "Seccuss",
      message: "cart is empty",
    });
  }
  await pricCalc(cart); // reCalc
  cart && res.status(200).json({ message: "cart updated", cart });
});

const updateQuantity = asyncHandler(async (req, res, next) => {
  // check cart
  // const cart = await Cart.findOne({ user: req.user._id });
  // // if not exisit res
  // !cart && res.status(404).json({ message: "cart Not found" });

  // // get cartItems id for update quantity of certien item
  // let item = cart.cartItems.find((item) => item._id == req.params.id);
  // if (!item) return next(new Error("item not found", { cause: 404 }));
  // // update quantity of item
  // item.quantity = req.body.quantity;

  // check productId if exisit or not
  const product = await Product.findById(req.params.id);
  !product && next(new Error("product not found", { cause: 404 }));

  if (!product.inStock(req.body.quantity))
    return next(
      new Error(`sorry, only ${product.quantity} items is avaliable`, {
        cause: 400,
      })
    );
  // update quantity of this product id
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id, "cartItems.productId": req.params.id },
    { "cartItems.$.quantity": req.body.quantity },
    { new: true }
  );
  if (!cart)
    return res
      .status(404)
      .json({ message: "cart Not found or product not found this cart" });
  // calc price
  await pricCalc(cart);
  // save
  //send res
  res.status(200).json({ message: "cart : ", cart });
});

const getLogedUserCart = asyncHandler(async (req, res) => {
  // check cart
  const cart = await Cart.findOne({ user: req.user._id }).populate([
    { path: "cartItems.productId" },
  ]);
  //send res
  if (!cart) return res.status(404).json({ message: "cart Not found" });
  //cart && error cant set header
  res.status(200).json({ message: "cart : ", cart });
});

const getAllCart = asyncHandler(async (req, res, next) => {
  if (!req.params.id)
    return next(new Error("cart Id is required", { cause: 400 }));
  // check cart
  const cart = await Cart.findById(req.params.id).populate([
    { path: "cartItems.productId" },
  ]);
  //send res
  if (!cart) return res.status(404).json({ message: "cart Not found" });
  res.status(200).json({ message: "cart : ", cart });
});

const clearUserCart = asyncHandler(async (req, res) => {
  // check cart
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  //send res
  if (!cart) return res.status(404).json({ message: "cart Not found" });
  res.status(200).json({ message: "cart deleted successfully ", cart });
});
export {
  addCart,
  applyCoupon,
  removeItemFromCart,
  updateQuantity,
  getAllCart,
  getLogedUserCart,
  clearUserCart,
};
