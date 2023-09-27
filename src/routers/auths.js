import express from "express";
import { companySignup, companyLogin, lawyerLogin, lawyerSignup, adminLogin, adminSignup, confirmEmail, forgotPassword, resetPassword, resetPasswordToken} from "../controllers/authcontrollers.js";
 import {routeBasedOnUserType } from './../controllers/middleware.js'

const router = express.Router();

router.post('/login/:userType', routeBasedOnUserType);
router.post("/company/signup", companySignup);
router.post("/lawyer/signup", lawyerSignup);
router.post("/admin/signup", adminSignup);
router.get("/useremail/confirm/:token", confirmEmail)
router.post('/forgot-password/:userType', forgotPassword);
router.post("/confirm-reset-token", resetPasswordToken);
router.post('/reset-password', resetPassword);

export default router;
