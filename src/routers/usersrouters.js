import express from "express";
import { getAllAdmins, getAllCompanies, getAllLawyers } from "../controllers/usersControllers.js";
import { profileBasedOnUserType } from "../controllers/middleware.js";

const router = express.Router();

router.get('/:userType/:userId', profileBasedOnUserType);
router.get("/lawyers", getAllLawyers);
router.get("/companies", getAllCompanies);
router.get("/admins", getAllAdmins);

export default router;