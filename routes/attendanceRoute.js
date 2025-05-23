import express from "express";
import { add_attendance, check_attendance, update_attendance } from "../controller/attendance.controller.js"

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/add_attendance", add_attendance);
router.get("/check_attendance", check_attendance);
router.post('/update_attendance', update_attendance);

export default router;