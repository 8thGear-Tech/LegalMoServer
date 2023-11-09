import express from "express";
import {
  getAllAdmins,
  getAllCompanies,
  getAllLawyers,
} from "../controllers/usersControllers.js";
import {
  profileBasedOnUserType,
  authenticateUser,
  isAdminUser,
  updateProfileBasedOnUser,
} from "../controllers/middleware.js";

const router = express.Router();

// router.use(authenticateUser);
router.get("/api/:userType/:userId", authenticateUser, profileBasedOnUserType);
// router.get("/lawyers", authenticateUser, isAdminUser, getAllLawyers);
router.get("/api/companies", authenticateUser, isAdminUser, getAllCompanies);
router.get("/api/admins", authenticateUser, isAdminUser, getAllAdmins);
router.patch("/api/updateprofile", authenticateUser, updateProfileBasedOnUser);

export default router;
