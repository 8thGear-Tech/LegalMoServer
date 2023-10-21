import express from "express";
import {
  companys,
  lawyers,
  companyProfile,
  lawyerProfile,
  verifiedLawyers,
  unverifiedLawyers,
  verifyLawyer,
} from "../controllers/admincontroller.js";
import { authToken } from "../middleware/AuthToken.js";

const router = express.Router();

router.get("/api/companys", authToken, companys);
router.get("/api/lawyers", authToken, lawyers);
router.get("/api/company/:id", authToken, companyProfile);
router.get("/api/lawyer/:id", authToken, lawyerProfile);
router.get("/api/verifiedlawyers", authToken, verifiedLawyers);
router.get("/api/unverifiedlawyers", authToken, unverifiedLawyers);
router.put("/api/verifylawyer/:id", authToken, verifyLawyer);

export default router;
