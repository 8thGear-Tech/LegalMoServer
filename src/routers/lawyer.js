import express from "express";
import {
  addPaymentDetails,
  editPaymentDetails,
  getPaymentDetails,
  sendOTP,
  confirmOTP,
} from "../controllers/lawyercontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();

router.get("/api/get-payment-details", authToken, getPaymentDetails);
router.post("/api/add-payment-details", authToken, addPaymentDetails);
router.patch("/api/edit-payment-details", authToken, editPaymentDetails);
router.get("/api/get-payment-details", authToken, getPaymentDetails);
router.post("/api/send-otp", authToken, sendOTP);
router.post("/api/confirm-otp", authToken, confirmOTP);

export default router;
