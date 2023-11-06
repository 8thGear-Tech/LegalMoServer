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
router.post("/login", usersLogin);
router.post("/company/signup", companySignup);
router.post("/lawyer/signup", lawyerSignup);
router.post("/admin/signup", adminSignup);
router.get("/useremail/confirm/:token", confirmEmail);
router.post("/forgot-password", forgotPassword);
router.post("/confirm-reset-token", resetPasswordToken);
router.patch("/reset-password", resetPassword);
router.post("/logout", logoutUser);
router.post("/resendcomfirmemail", resendConfirmationEmail);

export default router;
