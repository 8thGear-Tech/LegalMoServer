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

router.use(authenticateUser);
router.get("/userprofile", profileBasedOnUserType);
router.get("/lawyers", isAdminUser, getAllLawyers);
router.get("/companies", isAdminUser, getAllCompanies);
router.get("/admins", isAdminUser, getAllAdmins);
router.patch("/updateprofile", updateProfileBasedOnUser);

// router.get("/:userType/:userId", authenticateUser, profileBasedOnUserType);
// router.get("/lawyers", authenticateUser, isAdminUser, getAllLawyers);
// router.get("/companies", authenticateUser, isAdminUser, getAllCompanies);
// router.get("/admins", authenticateUser, isAdminUser, getAllAdmins);
// router.patch("/updateprofile", authenticateUser, updateProfileBasedOnUser);

export default router;
