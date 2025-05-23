import User from "../models/user.model.js";
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

        const existingUser = await User.findOne({ email });
        console.log(existingUser)
        if (existingUser) {
            return res.status(400).json({ error: "User already exists." });
        }

        const salt = await bcryptjs.genSalt(10);
        const hashedPassword = await bcryptjs.hash(password, salt);

        const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // expires in 10 mins

        const newUser = new User({
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
            isVerified: false
        });

        await newUser.save();

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

    if (!user.isVerified)
      return res.status(403).json({ error: "Email not verified. Please verify OTP." });

    generateTokenAndSetCookie(user._id, res);
    res.status(200).json({
      _id: user._id,
      email: user.email,
      name: user.name,
      department: user.department,
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

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "Invalid email." });
        }

        if (user.isVerified) {
            return res.status(400).json({ error: "Email already verified." });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ error: "Invalid or expired OTP." });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        generateTokenAndSetCookie(user._id, res); // if you want to log in directly

        res.status(200).json({ message: "Email verified successfully." });
    } catch (error) {
        console.log("Error in verifyOtp controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
};


export const profile = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const response = {
      _id: user._id,
      email: user.email,
      name: user.name,
      department: user.department,
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
    console.log("Error in login controller", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};