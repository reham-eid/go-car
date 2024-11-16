import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: true,
    tirm: true,
  },
  email: {
    type: String,
    required: true,
    tirm: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  phone: {
    type: Number,
    required: true,
    tirm: true,
  },
  role: {
    type: String,
  },
  token: String,
  provider: {
    type: String,
    enum: [ "System","GOOGLE","GITHUB","FACEBOOK"],
    default: "System",
  },
});

const User = mongoose.model('User', userSchema);
export default User;
