import express from "express";
import { add_attendance, check_attendance, update_attendance, bulk_attendance } from "../controller/attendance.controller.js"

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/add_attendance", add_attendance);
router.post("/check_attendance", check_attendance);
router.post('/update_attendance', update_attendance);
router.post('/bulk_attendance', bulk_attendance);

export default router;