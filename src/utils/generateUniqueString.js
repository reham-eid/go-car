import { customAlphabet } from "nanoid";

const generateUniqueString = (length) => {
  const nanoid = customAlphabet("0123456789абвгдеё", length || 10);
  return nanoid()
};

export default generateUniqueString
