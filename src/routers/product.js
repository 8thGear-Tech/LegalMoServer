import express from "express";
import { create } from "../controllers/productcontroller";

const router = express.Router();

router.post("/create", create);

export default router;