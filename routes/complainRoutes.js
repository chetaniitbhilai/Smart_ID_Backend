import express from "express";
import { add_complain, get_complain, resolve_complain } from "../controller/complain.controller.js";

const router = express.Router();

// Rather than using complete code of APIs here, we can make their different files known as controllers
router.post("/add_complain", add_complain)
router.get("/get_complain", get_complain)
router.post("/resolve_complain", resolve_complain)

export default router;