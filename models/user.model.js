import mongoose from "mongoose";
import express from 'express'

// models/User.js
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    department: String,
    rollNumber: String,
    isVerified: { type: Boolean, default: false },
    otp: String,
    otpExpires: Date
});

  
const User = mongoose.model("users", userSchema); 
  
export default User;