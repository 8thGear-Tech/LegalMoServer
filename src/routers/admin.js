import express from "express";
import {
  companys,
  lawyers,
  companyProfile,
  lawyerProfile,
  verifiedLawyers,
  unverifiedLawyers,
  verifyLawyer,
} from "../controllers/adminController.js";

const router = express.Router();

router.get("/api/companys", companys);
router.get("/api/lawyers", lawyers);
router.get("/api/company/:id", companyProfile);
router.get("/api/lawyer/:id", lawyerProfile);
router.get("/api/verifiedlawyers", verifiedLawyers);
router.get("/api/unverifiedlawyers", unverifiedLawyers);
router.put("/api/verifylawyer/:id", verifyLawyer);

export default router;
