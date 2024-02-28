import jwt from "jsonwebtoken";
import { asyncHandler } from "./asyncHandler.js";
import User from "../../DB/models/user.model.js";

const protectedRoute = asyncHandler(async (req, res, next) => {
  // get Token
  const { token } = req.headers;
  //token exisit 401
  // verify token
  const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    //check data in payload
    if (!payload?.userId || !payload?.email) {
      return next(new Error("Invalid token payload ", { cause: 400 }));
    }
  // check User by token.userId
  const user = await User.findOne({
    $or: [{ _id: payload.userId }, { email: payload.email }],
  });
  // if not exisit res
  if (!user)
    return next(new Error("there is no user for this token", { cause: 401 }));
  if (user?.changePassAt) {
    // if exisit compare between time Date.now() of User.changePassAt
    // vs token.iat
    const time = parseInt(user?.changePassAt.getTime() / 1000);
    // time > token it means token older (invalid)
    if (time > payload.iat) {
      next(new Error("token expaired... login again ", { cause: 400 }));
    }
  }
  req.user = user;
  next();
});
const allowTo = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(new Error("you are not authorized", { cause: 401 }));
    }
    next();
  });
};

export { protectedRoute, allowTo };
