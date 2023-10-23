import express from "express";
import { create, getProducts, updateProduct, deleteProduct, singleProduct } from "../controllers/productcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();


router.post("/api/create", authToken, create);
router.get("/api/products",  getProducts);
router.put("/api/update/:id",authToken, updateProduct);
router.delete("/api/delete/:id",authToken, deleteProduct);
router.get("/api/product/:id", singleProduct);
export default router;

