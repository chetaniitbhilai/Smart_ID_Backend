import User from "../models/user.model.js";
import PendingUser from "../models/pendingUser.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, department, studentId , role , professorId, taId } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Passwords don't match." });
        }

        // Check both confirmed users and pending users
        const existingUser = await User.findOne({ email });
        const existingPending = await PendingUser.findOne({ email });
        if (existingUser || existingPending) {
            return res.status(400).json({ error: "User already exists or pending verification." });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

        const pending = new PendingUser({
            email,
            password: hashedPassword,
            name,
            department,
            studentId,
            role,
            professorId,
            taId,
            otp,
            otpExpires,
        });

        await pending.save();

        await sendEmail(email, "Verify your email", `Your OTP is: ${otp}`);

        res.status(201).json({ message: "OTP sent to email. Please verify." });
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcryptjs.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    // Allow login regardless of OTP verification status

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role,
      studentId: user.studentId,
      professorId: user.professorId,
      taId: user.taId,
    });
  } catch (error) {
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};


export const logout = async(req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0}); // cleared the cookie
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}


export const verifyOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        // First, check pending users
        const pending = await PendingUser.findOne({ email });
        if (!pending) {
            return res.status(400).json({ error: "No pending signup found for this email." });
        }

        if (pending.otp !== otp || pending.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        // Create confirmed user from pending
        const createdUser = await User.create({
            email: pending.email,
            password: pending.password,
            name: pending.name,
            department: pending.department,
            studentId: pending.studentId,
            role: pending.role,
            professorId: pending.professorId,
            taId: pending.taId,
            isVerified: true,
        });

        // Remove pending record
        await PendingUser.deleteOne({ _id: pending._id });

        generateTokenAndSetCookie(createdUser._id, res);

        res.status(200).json({ message: "Email verified successfully.", _id: createdUser._id, role: createdUser.role });
    } catch (error) {
        console.log("Error in verifyOtp controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const profile = async (req, res) => {
  try {
    // Get user ID from JWT token (set by auth middleware)
    const userId = req.user?.id || req.user?._id;
    
    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const user = await User.findById(userId);

    if (!user) return res.status(400).json({ error: "User not found" });

    const response = {
      _id: user._id,
      email: user.email,
      name: user.name,
      department: user.department,
      role: user.role,
    };

    if (user.role === "student") {
      response.studentId = user.studentId;
    } else if (user.role === "ta") {
      response.taId = user.taId;
    } else if (user.role === "professor") {
      response.professorId = user.professorId;
    }
    res.status(200).json(response);
  } catch (error) {
    console.log("Error in profile controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};