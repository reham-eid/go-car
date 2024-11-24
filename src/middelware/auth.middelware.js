import User from "../models/userModel.js";
import { verifyToken } from "./GenerateAndVerifyToken.js";

export function protectedRoute(allowedRoles = []) {
  return async (req, res, next) => {
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

      // Check user's role if roles are specified
      if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return res.status(403).json({
          message: "Access denied. You do not have the required permissions.",
        });
      }

      req.user = user;
      next();
    } catch (error) {
      console.error("Error in verifyToken:", error);
      return res.status(403).json({ message: "Token invalid" });
    }
  };
}
