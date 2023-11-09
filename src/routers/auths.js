import express from "express";
import {
  companySignup,
  lawyerSignup,
  adminSignup,
  logoutUser,
  usersLogin,
} from "../controllers/authcontrollers.js";
import { confirmEmail, resendConfirmationEmail } from "../utils/email.js";
import {
  forgotPassword,
  resetPassword,
  resetPasswordToken,
} from "../controllers/passwords.js";

const router = express.Router();

// Use a route parameter to set the userType based on the route
router.post("/api/login", usersLogin);
router.post("/api/company/signup", companySignup);
router.post("/api/lawyer/signup", lawyerSignup);
router.post("/api/admin/signup", adminSignup);
router.get("/api/useremail/confirm/:token", confirmEmail);
router.post("/api/forgot-password", forgotPassword);
router.post("/api/confirm-reset-token", resetPasswordToken);
router.patch("/api/reset-password", resetPassword);
router.post("/api/logout", logoutUser);
router.post("/api/resendconfirmemail", resendConfirmationEmail);

export default router;
