import express from "express";
import { getAllAdmins, getAllCompanies, getAllLawyers } from "../controllers/usersControllers.js";
import { profileBasedOnUserType, authenticateUser, isAdminUser, updateProfileBasedOnUser} from "../controllers/middleware.js";

const router = express.Router();

router.use(authenticateUser)
router.get('/:userType/:userId', profileBasedOnUserType);
router.get("/lawyers", isAdminUser, getAllLawyers);
router.get("/companies", isAdminUser, getAllCompanies);
router.get("/admins", isAdminUser, getAllAdmins);
router.put("/updateprofile/:userType", updateProfileBasedOnUser);

export default router;