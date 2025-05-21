import express from "express";
import { add_course } from "../controller/course.controller.js"

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/add_course", add_course);

export default router;