import mongoose from "mongoose";
import express from 'express'

// models/User.js
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    department: String,
    studentId: String,
    isVerified: { type: Boolean, default: false },
    role: { 
    type: String, 
    enum: ['student', 'professor' ,'ta'],
    },
    professorId: String,
    taId: String,
    otp: String,
    otpExpires: Date
});

  
const User = mongoose.model("users", userSchema); 
  
export default User;