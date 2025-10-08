import mongoose from "mongoose";

const pendingUserSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    // Store already-hashed password to avoid re-hashing later
    password: { type: String, required: true },
    name: { type: String, required: true },
    department: { type: String, required: true },
    role: { type: String, enum: ["student", "professor", "ta"], required: true },
    studentId: String,
    professorId: String,
    taId: String,
    otp: { type: String, required: true },
    otpExpires: { type: Date, required: true },
  },
  { timestamps: true }
);

const PendingUser = mongoose.model("pending_users", pendingUserSchema);

export default PendingUser;


