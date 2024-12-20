import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyGoogleToken } from "../utils/google.strategy.js";
import { generateToken } from "../middelware/GenerateAndVerifyToken.js";
import { status } from "../utils/system.roles.js";

export const register = async (req, res) => {
  try {
    const { userName, email, address, password, confirmPassword, phone, role } =
      req.body;

    // if (password !== confirmPassword) {
    //   // in validation
    //   return res.status(400).json({ message: "Passwords do not match" });
    // }

    // --> 1) check if email exists in DB
    const isUserExists = await User.findOne({
      email: email,
    });

    if (isUserExists) {
      return res.status(httpStatus.CONFLICT).json({
        message: "Email already exists",
        success: false,
      });
    }
    // --> 3) password to hash
    const hashedPassword = await bcrypt.hash(password, 10);
    // --> 4) inset new user
    const newUser = new User({
      userName,
      email,
      address,
      phone,
      role,
      password: hashedPassword,
    });
    await newUser.save();

    res.status(201).json({ message: "User registered successfully", newUser });
  } catch (error) {
    console.log("new user register error", error);
    res
      .status(404)
      .json({ message: "new user register error", error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password, rememberMe } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const expiresIn = rememberMe ? "30d" : "1h";

    const token = jwt.sign(
      { id: user._id, name: user.userName, role: user.role },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn,
      }
    );

    user.isEmailConfirm = true;
    await user.save();
    res
      .status(200)
      .json({ message: "User login successfully", token, expiresIn });
  } catch (error) {
    console.log("Error in login:", error);
    return res
      .status(500)
      .send({ message: "Error in login", error: error.message });
  }
};

// Utility function to verify tokens based on provider
const verifyTokenId = async (provider, token) => {
  switch (provider) {
    case "GOOGLE":
      return await verifyGoogleToken(token);
    // {
    //   "sub": "1234567890",
    //   "name": "John Doe",
    //   "given_name": "John",
    //   "family_name": "Doe",
    //   "picture": "https://example.com/johndoe.jpg",
    //   "email": "johndoe@example.com",
    //   "email_verified": true,
    //   "locale": "en"
    // }
    case "FACEBOOK":
      // Verify token with Facebook's API
      const fbResponse = await fetch(
        `https://graph.facebook.com/me?access_token=${token}&fields=id,name,email,picture`
      );
      if (!fbResponse.ok) throw new Error("Invalid Facebook token");
      return await fbResponse.json();
    // {
    //   "id": "1234567890123456",
    //   "name": "John Doe",
    //   "email": "johndoe@example.com",
    //   "picture": {
    //     "data": {
    //       "height": 50,
    //       "is_silhouette": false,
    //       "url": "https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=1234567890123456&height=50&width=50&ext=1668393542&hash=AeTfP_YfPGrxZQZ3",
    //       "width": 50
    //     }
    //   }
    // }

    case "GITHUB":
      // Verify token with GitHub's API
      const ghResponse = await fetch("https://api.github.com/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!ghResponse.ok) throw new Error("Invalid GitHub token");
      return await ghResponse.json();
    // ghResponse >> {
    //   "login": "octocat",
    //   "id": 1,
    //   "node_id": "MDQ6VXNlcjE=",
    //   "avatar_url": "https://github.com/images/error/octocat_happy.gif",
    //   "gravatar_id": "",
    //   "url": "https://api.github.com/users/octocat",
    //   "html_url": "https://github.com/octocat",
    //   "followers_url": "https://api.github.com/users/octocat/followers",
    //   ...
    // }

    default:
      throw new Error("Unknown provider");
  }
};

export const signupWithOAuth = async (req, res, next) => {
  const provider = req.headers["provider"]; // Expecting GOOGLE, FACEBOOK, or GITHUB
  const token = req.headers["id-token"]; // Token can be an idToken or accessToken depending on provider

  try {
    // Step 1: Verify Token
    const userData = await verifyTokenId(provider, token);

    console.log("userData>> ", userData);

    // Step 2: Check for required fields (Example: email verification for Google)
    if (provider === "GOOGLE" && userData.email_verified !== true) {
      return res
        .status(400)
        .json({ error: "Email not verified. Use a verified Google account." });
    }

    // Step 3: Check if user already exists in database
    const existingUser = await User.findOne({
      email: userData.email,
      provider,
    });
    if (existingUser) {
      return res
        .status(400)
        .json({ error: "User already exists. Please log in instead." });
    }

    const randomPassword = Math.random().toString(36).slice(-8);
    const hashedPassword = await bcrypt.hash(randomPassword, 10);

    // Step 4: Create a new user
    const newUser = new User({
      email: userData.email,
      userName: userData.name,
      password: hashedPassword,
      provider,
      status: status.online,
      token: "", // You can set this later if you want
    });

    // Step 5: Save the new user to the database
    await newUser.save();

    // Step 6: Generate JWT for the new user
    const jwtToken = generateToken({
      payload: { userId: newUser._id, email: newUser.email },
      expiresIn: "1h",
    });

    // Step 7: Update user with JWT token
    newUser.token = jwtToken;
    await newUser.save();

    // Respond with signup success and user data
    res.status(201).json({
      message: "Signup successful",
      userData: { ...userData, token: jwtToken },
    });
  } catch (error) {
    res.status(401).json({ error: error.message || "Invalid token" });
  }
};

export const loginWithOAuth = async (req, res, next) => {
  const provider = req.headers["provider"]; // Expecting GOOGLE, FACEBOOK, or GITHUB
  const token = req.headers["id-token"]; // Token can be an idToken or accessToken depending on provider

  try {
    // Step 1: Verify Token
    const userData = await verifyTokenId(provider, token);

    // Step 2: Check for required fields (Example: email verification for Google)
    if (provider === "GOOGLE" && userData.email_verified !== true) {
      return res
        .status(400)
        .json({ error: "Email not verified. Use a verified Google account." });
    }

    //check data by email
    const user = await User.findOne({
      email: userData.email,
      provider: "GOOGLE",
    });
    if (!user) return next(new Error("User Not found", { cause: 404 }));
    //generate token
    const token = generateToken({
      payload: { userId: user._id, email: userData.email },
      expiresIn: 40,
    });
    //update the status to online
    user.status = status.online;
    user.token = token;
    await user.save();

    res
      .status(200)
      .json({ message: "login successfully with google", userData });

    // {
    //   "sub": "1234567890",
    //   "name": "John Doe",
    //   "given_name": "John",
    //   "family_name": "Doe",
    //   "picture": "https://example.com/johndoe.jpg",
    //   "email": "johndoe@example.com",
    //   "email_verified": true,
    //   "locale": "en"
    // }

    // Example logic: Check if user exists in DB
    // const user = await User.findOne({ googleId: userData.sub });
    // if (!user) {
    //   // Create new user in DB
    //   const newUser = new User({
    //     googleId: userData.sub,
    //     name: userData.name,
    //     email: userData.email,
    //     picture: userData.picture,
    //   });
    //   await newUser.save();
    // }
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
