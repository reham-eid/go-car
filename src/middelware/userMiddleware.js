import User from "../models/userModel.js";

export const userAuth = async (req, res, next) => {
  const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ message: "user not found" });
  }
  return next();
};
