import User from "../models/userModel.js";
import { verifyToken } from "./GenerateAndVerifyToken.js";

export async function protectedRoute(req, res, next) {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Token not found" });
  }

  try {
    // verify token
    const payload = verifyToken({ token });
    //check data in payload
    if (!payload?.userId) {
      return next(new Error("Invalid token payload ", { cause: 400 }));
    }
    // check User by token.userId
    const user = await User.findById(payload.userId);
    // if not exisit res
    if (!user) return next(new Error("Not register yet..", { cause: 401 }));

    if (!user) {
      return res
        .status(401)
        .json({ status: 0, message: "User Not register yet.." });
    }

    if (user?.changePassAt) {
      const time = parseInt(user?.changePassAt.getTime() / 1000);
      // time > token it means token older (invalid)
      if (time > payload.iat) {
        return res
          .status(400)
          .json("you change your password ... please login again ");
      }
    }
    req.user = user;
    next();
  } catch (error) {
    console.error("Error in verifyToken:", error);
    return res.status(403).json({ message: "Token invalid" });
  }
}
