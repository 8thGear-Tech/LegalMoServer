import express from "express";
import {
  addToCart,
  getCart,
  deleteCart,
  clearCart,
  checkout,
  getAllCart,
  // flutterwaveWebhook,
} from "../controllers/cartcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();

router.post("/api/cart", addToCart);
router.get("/api/cart", getCart);
router.delete("/api/cart/:id", deleteCart);
router.post("/api/clear-cart", clearCart);
router.post("/api/checkout", authToken, checkout);
router.get("/api/allcart", getAllCart);
// router.post("/api/flutterwave-webhook", flutterwaveWebhook);

export default router;
