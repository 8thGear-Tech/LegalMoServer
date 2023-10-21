import express from "express";
import { addToCart, getCart, deleteCart, clearCart, checkout, getAllCart } from "../controllers/cartcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();


router.post('/api/cart', authToken, addToCart)
router.get('/api/cart', authToken, getCart)
router.delete('/api/cart/:id', authToken, deleteCart)
router.post('/api/clear-cart', authToken, clearCart)
router.post('/api/checkout', authToken, checkout)
router.get('/api/allcart', authToken, getAllCart)

export default router;

