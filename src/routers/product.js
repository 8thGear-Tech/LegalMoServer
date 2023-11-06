import express from "express";
import { create, getProducts, updateProduct, deleteProduct, singleProduct } from "../controllers/productcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();


router.get("/api/product/:id", singleProduct);
router.get("/api/products",  getProducts);
router.post("/api/create", authToken, create);
router.put("/api/update/:id",authToken, updateProduct);
router.delete("/api/delete/:id",authToken, deleteProduct);

export default router;

