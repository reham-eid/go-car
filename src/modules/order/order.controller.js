import { asyncHandler } from "../../middlewares/asyncHandler.js";
import {Cart} from "../../../DB/models/cart.model.js";
import Order from "../../../DB/models/order.model.js";
import Product from "../../../DB/models/product.model.js";
import Stripe from "stripe";
import User from "../../../DB/models/user.model.js";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createCashOrder = asyncHandler(async (req, res, next) => {
  // get cart from user and check
  const cart = await Cart.findById(req.params.id);
  if (!cart) return next(new Error("cart not found", { cause: 404 }));
  // total order price
  let totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  //create order
  const order = new Order({
    user: req.user._id,
    cart: cart.cartItems,
    totalOrderPrice,
    shippingAddress: req.body.address,
  });
  await order.save();
  //increment sold & decrement quantity in products
  let operation = cart.cartItems.map((product) => {
    return {
      updateOne: {
        filter: { _id: product.productId },
        update: {
          $inc: { sold: product.quantity, quantity: -product.quantity },
        },
      },
    };
  });
  const product = await Product.bulkWrite(operation);
  // clear cart
  await Cart.findByIdAndDelete({ user: req.user._id });
  // send res
  res.status(201).json({ message: "order send", order });
});

const OneOrder = asyncHandler(async (req, res, next) => {
  const order = await Order.findOne({ user: req.user._id }).populate(
    "cart.productId"
  );
  !order && next(new Error("no result", { cause: 404 }));
  order && res.status(200).json({ message: "your Order ", order });
});

const allOrders = asyncHandler(async (req, res, next) => {
  const orders = await Order.find({}).populate("cart.productId");
  res.status(200).json({ message: "your Order ", orders });
});

const createCheckoutSession = asyncHandler(async (req, res, next) => {
  // get cart from user and check
  const cart = await Cart.findOne({ user: req.user._id });
  if (!cart) return next(new Error("cart not found", { cause: 404 }));
  // check Order
  const order = await Order.findById(req.params.id);
  if (!order) return next(new Error("order not found", { cause: 404 }));

  // total order price
  order.totalOrderPrice = cart.totalPriceAfterDiscount
    ? cart.totalPriceAfterDiscount
    : cart.totalPrice;
  await order.save();
  // create session
  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: order.totalOrderPrice * 100,
          product_data: {
            user: req.user.username,
          },
        },
        quantity: 1, // already calc totalPrice
      },
    ],
    payment_method_types: ["card"],
    mode: "payment",
    success_url: "",
    cancel_url: "",
    customer_email: req.user.email,
    client_reference_id: req.user._id,
    metadata: {
      shippingAddress: req.body.address,
      order_id: order._id.toString(),
    },
  });
  //send res
  res.status(201).json({ message: "success", session });
});

const createOnlineOrder = async (request, response) => {
  const sig = request.headers["stripe-signature"].toString(); //from bank
  let event;
  try {
    event.stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    return response.status(400).send(`webhook Error: ${error.message}`);
  }
  // Handle the event
  if (event.type == "checkout.session.completed") {
    const checkoutSessionCompleted = event.data.object;
    //change status order
    const orderId = checkoutSessionCompleted.metadata.order_id;
    await Order.findByIdAndUpdate(orderId, { status: "visa payed" });
    card(event.data.object, response);
    return;
  } else {
    const orderId = checkoutSessionCompleted.metadata.order_id;
    await Order.findByIdAndUpdate(orderId, { status: "failed to payed" });
    console.log(`Unhandled event type ${event.type}`);
    return;
  }
};

async function card(e, res) {
  // get cart from user and check
  const cart = await Cart.findById(e.client_reference_id);
  if (!cart) return next(new Error("cart not found", { cause: 404 }));

  const user = await User.findOne({ email: e.customer_email });
  // create order
  const order = new Order({
    user: user._id,
    cart: cart.cartItems,
    totalOrderPrice: e.amount_total / 100,
    shippingAddress: e.metadata.address,
    payment: "card",
    isPaid: true,
    paidAt: Date.now(),
  });
  await order.save();

  if (order) {
    //increment sold & decrement quantity in products
    let operation = cart.cartItems.map((product) => {
      return {
        updateOne: {
          filter: { _id: product.productId },
          update: {
            $inc: { sold: product.quantity, quantity: -product.quantity },
          },
        },
      };
    });
    const product = await Product.bulkWrite(operation);
    // clear cart
    await Cart.findByIdAndDelete({ user: user._id });
    // send res
    return res.status(201).json({ message: "order send", order });
  }
  return next(new Error("order not found", { cause: 404 }));
}
export {
  createCashOrder,
  OneOrder,
  allOrders,
  createCheckoutSession,
  createOnlineOrder,
};
