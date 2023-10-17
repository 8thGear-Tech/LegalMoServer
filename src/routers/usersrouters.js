import express from "express";
import { getAllAdmins, getAllCompanies, getAllLawyers, updateProfile } from "../controllers/usersControllers.js";
import { profileBasedOnUserType, authenticateUser, isAdminUser} from "../controllers/middleware.js";

const router = express.Router();

router.use(authenticateUser)
router.get('/:userType/:userId', profileBasedOnUserType);
router.get("/lawyers", isAdminUser, getAllLawyers);
router.get("/companies", isAdminUser, getAllCompanies);
router.get("/admins", isAdminUser, getAllAdmins);
router.patch("/updateprofile/:userType", updateProfile);

export default router;