import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { addToCart, getCart, deleteCart, clearCart, checkout } from "../controllers/cartcontroller.js";

const router = express.Router();


// router.post("/api/create",middleware(productSchemas.productcreation), create);
// router.post("/api/create", create);

router.route('/api/cart').post(addToCart).get(getCart).delete(deleteCart)
router.post('/api/clear-cart', clearCart)
router.post('/api/checkout', checkout)

export default router;

