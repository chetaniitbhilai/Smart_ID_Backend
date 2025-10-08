import express from "express";
import { add_course ,get_courses, get_upcoming, register_student, get_course_students } from "../controller/course.controller.js"

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/add_course", add_course);
router.get("/get_courses", get_courses);
router.get("/upcoming", get_upcoming);
router.post("/register", register_student);
router.get("/students", get_course_students);

export default router;