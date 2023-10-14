import express from "express";
import { companys, lawyers, companyProfile, lawyerProfile } from "../controllers/admincontroller.js";

const router = express.Router();

router.get('/api/companys', companys)
router.get('/api/lawyers', lawyers)
router.get('/api/company/:id', companyProfile)
router.get('/api/lawyer/:id', lawyerProfile)

export default router;
