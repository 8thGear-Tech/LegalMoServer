import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { addToCart, getCart, deleteCart, clearCart } from "../controllers/cartcontroller.js";

const router = express.Router();


// router.post("/api/create",middleware(productSchemas.productcreation), create);
// router.post("/api/create", create);

router.route('/cart').post(addToCart).get(getCart).delete(deleteCart)
router.post('clear-cart').post(clearCart)
export default router;

