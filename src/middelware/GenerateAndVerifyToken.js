import jwt from "jsonwebtoken";

const generateToken = ({
  payload = {},
  signature = process.env.JWT_SECRET_KEY,
  expiresIn = "364d",
} = {}) => {
  const token = jwt.sign(payload, signature, {
    expiresIn,
  });
  return token;
};

const verifyToken = ({
  token,
  signature = process.env.JWT_SECRET_KEY,
} = {}) => {
  const payload = jwt.verify(token, signature);
  return payload;
};

export { verifyToken, generateToken };
