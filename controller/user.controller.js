import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

import sendEmail from "../utils/sendEmail.js"
import crypto from "crypto"

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword, name, department, rollNumber } = req.body;

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
            rollNumber,
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
      rollNumber: user.rollNumber,
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





/*

START CODE
import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import generateTokenAndSetCookie from "../utils/generateToken.js";

export const signup = async (req, res) => {
    try {
        const { email, password, confirmPassword , name , position,responsibility } = req.body;

        if (password !== confirmPassword) {
            return res.status(400).json({ error: "Password don't match." });
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "Username already exists." });
        }
        //HASH the password
        const salt = await bcryptjs.genSalt(10); //higher the value higher the strength but also higher the time to decrypt it 
        const hashedPassword= await bcryptjs.hash(password, salt); // hashing the password


        const newUser = new User({
            email,
            password:hashedPassword,
            name,
            position,
            responsibility
        });
        // generate JWT tokens 

        if(newUser){

            generateTokenAndSetCookie(newUser._id,res);
            await newUser.save();

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                name:newUser.name,
                position:newUser.position,
                responsibility:newUser.responsibility
            });
        }

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const login = async (req, res) => {
    try {
        const {email,password} = req.body;
        const user = await User.findOne({email});
        const isPasswordCorrect=await bcryptjs.compare(password,user?.password || ""); // if user doesn't exist then use empty string to compare 
        console.log(email,password);

        if(!user || !isPasswordCorrect){
            return res.status(400).json({error:"Invalid email or password"});
        }
        generateTokenAndSetCookie(user._id,res);

        res.status(200).json({
            _id:user._id,
            email:user.email,
            password:user.password,
        });

    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" });
    }
}

export const logout = async(req, res) => {
    try {
        res.cookie("jwt","",{maxAge:0}); // cleared the cookie
        res.status(200).json({message:"Logged out successfully"});
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ error: "Internal server error" })
    }
}
*/