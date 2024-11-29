import mongoose from 'mongoose';

const verificationCodeSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    code: { type: String, required: true },
    forgetCodeVerified: { type: Boolean, default: false }, // Indicates if code was verified
    createdAt: { type: Date, default: Date.now , expires:300 }, // If the user submits the code after 5 minutes, the record will already have been removed by MongoDB, making the code invalid.
});

const VerificationCode = mongoose.model('VerificationCode', verificationCodeSchema);

export default VerificationCode;

