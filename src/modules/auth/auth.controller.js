import User from "../../../DB/models/user.model.js";
import { asyncHandler } from "../../middlewares/asyncHandler.js";
import { htmlCode, htmlMail } from "../../services/emails/htmlTemplete.js";
import { sendEmail } from "../../services/emails/sendEmail.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import randomstring from "randomstring";

const signUp = asyncHandler(async (req, res, next) => {
  //get data from req
  let { email, username, password, confirmPassword } = req.body;
  //check data
  const isExisit = await User.findOne({ email });
  if (isExisit) return next(new Error("User already exisit", { cause: 409 }));
  // if not exisit hash pass
  //in user.model.js
  //generate token from email
  const emailToken = jwt.sign({ email }, process.env.JWT_SECRET_KEY);
  // create user
  const user = await User.create({ ...req.body });
  req.savedDocument = { model: User, condition: user._id };
  // create confirmatiom link
  const link = `${process.env.BASE_URL}/api/v1/auth/acctivate_account/${emailToken}`;
  // send confirmation link
  await sendEmail({
    to: email,
    subject: "Acctive your account...",
    html: htmlMail(link),
  });
  // send res
  res.status(201).json({
    message: "sign up successfuly, Now check your email",
    user: user.username,
  });
});

const activeAccount = asyncHandler(async (req, res, next) => {
  //find user by emailToken
  const { emailToken } = req.params;
  const { email } = jwt.verify(emailToken, process.env.JWT_SECRET_KEY);
  //console.log(email);
  //update isEmailConfirm
  const user = await User.findOneAndUpdate(
    { email },
    { isEmailConfirm: true },
    { new: true }
  );
  if (!user) return next(new Error("user Not found", { cause: 404 }));
  //send res
  res.status(200).json({ message: "acctivate your account successfuly", user });
});

const logIn = asyncHandler(async (req, res, next) => {
  //get data from req
  const { email, password } = req.body;
  //check data by email
  const user = await User.findOne({ email });
  if (!user) return next(new Error("User Not found", { cause: 404 }));
  //check isEmailConfirm
  if (!user.isEmailConfirm) {
    return next(new Error("please acctive your account first", { cause: 400 }));
  }
  //compare password
  const match = bcryptjs.compareSync(password, user.password);
  if (!match) {
    return next(new Error("Incorrect Password", { cause: 400 }));
  }
  //generate token
  const token = jwt.sign(
    { email, userId: user._id, role: user.role },
    process.env.JWT_SECRET_KEY
  );

  //send res
  res.status(200).json({ message: "log in successfuly", Token: token });
});

const forgetPass = asyncHandler(async (req, res, next) => {
  // get email from req
  const { email } = req.body;
  // check email in db
  const user = await User.findOne({ email });
  if (!user) return next(new Error("user not found", { cause: 404 }));
  // check isEmailConfirm
  if (!user.isEmailConfirm)
    return next(
      new Error("You should acctivate your account first", { cause: 404 })
    );
  //generate forgetCode
  const forgetCode = randomstring.generate({
    charset: "numeric",
    length: 5,
  });
  //save forgetCode to User model
  user.forgetCode = forgetCode;
  await user.save();
  // send forgetCode (go to api resetPass)
  await sendEmail({
    to: email,
    subject: "Your Forget Code",
    html: htmlCode(forgetCode),
  });
  // send res
  res.status(200).json({
    message:
      "You can Reset your password Now we have send you a code , check your Email",
    username: user.username,
  });
});

const resetPass = asyncHandler(async (req, res, next) => {
  //get data from req
  const { newPassword, confirmPassword, code } = req.body;
  // check user
  const user = await User.findOne(req.user._id);
  if (!user) return next(new Error("Invalid Email", { cause: 404 }));

  //check forgetCode
  if (user.forgetCode !== code)
    return next(new Error("Invalid Code", { cause: 404 }));
  // create new token
  const token = jwt.sign(
    { userId: user._id, role: user.role, email: user.email },
    process.env.JWT_SECRET_KEY
  );
  // hash & update password
  await User.findByIdAndUpdate(
    req.user._id,
    { password: newPassword, changePassAt: Date.now() },
    { new: true }
  );
  //send res
  res.status(200).json({
    message: "reset your Password successfuly , try to login now",
    token,
  });
});

export {
  signUp,
  activeAccount,
  logIn,
  forgetPass,
  resetPass,
};
