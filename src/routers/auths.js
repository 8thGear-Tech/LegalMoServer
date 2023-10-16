import express from "express";
import { companySignup, lawyerSignup, adminSignup } from "../controllers/authcontrollers.js";
import {confirmEmail} from "../utils/email.js"
import { forgotPassword, resetPassword, resetPasswordToken } from "../controllers/passwords.js";
import { routeBasedOnUserType } from "../controllers/middleware.js";

const router = express.Router();

// Use a route parameter to set the userType based on the route
router.post('/login/:userType', routeBasedOnUserType);

router.post("/company/signup", companySignup);
router.post("/lawyer/signup", lawyerSignup);
router.post("/admin/signup", adminSignup);
router.get("/useremail/confirm/:token", confirmEmail); 
router.post('/forgot-password/:userType', forgotPassword);
router.post("/confirm-reset-token", resetPasswordToken);
router.patch('/reset-password', resetPassword);


export default router;
