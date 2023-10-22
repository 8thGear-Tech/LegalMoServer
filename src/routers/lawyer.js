import express from "express";
import { addPaymentDetails, editPaymentDetails, getPaymentDetails } from "../controllers/lawyercontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();

router.post("/api/add-payment-details", authToken, addPaymentDetails);
router.patch("/api/edit-payment-details", authToken,  editPaymentDetails);
router.get("/api/get-payment-details", authToken,  getPaymentDetails);

export default router;