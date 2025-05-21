import express from "express";
import { login, logout, signup, verifyOtp } from "../controller/user.controller.js"; // .js is important here

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post('/verify-otp', verifyOtp);  // <-- This is the new route



export default router;