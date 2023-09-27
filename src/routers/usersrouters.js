import express from "express";
import { getAllAdmins, getAllCompanies, getAllLawyers } from "../controllers/usersControllers.js";
import { profileBasedOnUserType, authenticateUser } from "../controllers/middleware.js";

const router = express.Router();

router.get('/:userType/:userId', authenticateUser, profileBasedOnUserType);
router.get("/lawyers", getAllLawyers);
router.get("/companies", getAllCompanies);
router.get("/admins", getAllAdmins);

export default router;