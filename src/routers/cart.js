import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { addToCart, getCart, deleteCart, clearCart, checkout, getAllCart } from "../controllers/cartcontroller.js";

const router = express.Router();


router.post('/api/cart', addToCart)
router.get('/api/cart/:id', getCart)
router.delete('/api/cart', deleteCart)
router.post('/api/clear-cart', clearCart)
router.post('/api/checkout', checkout)
router.get('/api/allcart', getAllCart)

export default router;

