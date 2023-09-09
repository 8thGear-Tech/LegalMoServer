import express from "express";
import { companySignup, companyLogin, lawyerLogin, lawyerSignup, adminLogin, adminSignup, confirmEmail } from "../controllers/authcontrollers.js";

const router = express.Router();

router.post("/company/signup", companySignup);
router.post("/company/login", companyLogin);
router.post("/lawyer/signup", lawyerSignup);
router.post("/lawyer/login", lawyerLogin);
router.post("/admin/signup", adminSignup);
router.post("/admin/login", adminLogin);
router.get("/useremail/confirm/:token", confirmEmail)

export default router;
