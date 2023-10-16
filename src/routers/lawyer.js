import express from "express";
import { addPaymentDetails, editPaymentDetails, getPaymentDetails } from "../controllers/lawyercontroller.js";

const router = express.Router();

router.post("/api/add-payment-details", addPaymentDetails);
router.post("/api/edit-payment-details", editPaymentDetails);
router.get("/api/get-payment-details", getPaymentDetails);

export default router;