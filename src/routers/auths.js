import express from "express";
import multer from "multer";
import { companySignup, lawyerSignup, adminSignup, logoutUser,usersLogin } from "../controllers/authcontrollers.js";
import {confirmEmail, resendConfirmationEmail} from "../utils/email.js"
import { forgotPassword, resetPassword, resetPasswordToken } from "../controllers/passwords.js";
const upload = multer();

const router = express.Router();

// Use a route parameter to set the userType based on the route
router.post('/login', upload.none(), usersLogin);
router.post("/company/signup", upload.none(), companySignup);
router.post("/lawyer/signup", upload.none(), lawyerSignup);
router.post("/admin/signup", upload.none(), adminSignup);
router.get("/useremail/confirm/:token", confirmEmail); 
router.post('/forgot-password', forgotPassword);
router.post("/confirm-reset-token", resetPasswordToken);
router.patch('/reset-password', resetPassword);
router.post("/logout", logoutUser);
router.post("/resendconfirmemail", resendConfirmationEmail);

export default router;
