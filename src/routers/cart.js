import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { addToCart, getCart, deleteCart } from "../controllers/cartcontroller.js";

const router = express.Router();


// router.post("/api/create",middleware(productSchemas.productcreation), create);
router.post("/api/create", create);
export default router;

