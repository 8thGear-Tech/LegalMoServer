import express from "express";
import multer from "multer";
import fs from "fs";
import {
  getAllAdmins,
  getAllCompanies,
  getAllLawyers,
  getOneCompany,
  getOneLawyer,
} from "../controllers/usersControllers.js";
import {
  profileBasedOnUserType,
  // authenticateUser,
  isAdminUser,
  updateProfileBasedOnUser,
} from "../controllers/middleware.js";

// Check if uploads directory exists
if (!fs.existsSync("./uploads")) {
  fs.mkdirSync("./uploads");
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

const router = express.Router();

// router.use(authenticateUser);
router.use("/getLawyer", isAdminUser, getOneLawyer);
router.use("/getCompany", isAdminUser, getOneCompany);
router.get("/userprofile", profileBasedOnUserType);
router.get("/lawyers", isAdminUser, getAllLawyers);
router.get("/companies", isAdminUser, getAllCompanies);
router.get("/admins", isAdminUser, getAllAdmins);
router.patch(
  "/updateprofile",
  upload.single("profileImage"),
  updateProfileBasedOnUser
);

// Error handling middleware
router.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    res.status(500).json({ error: err.message });
  } else {
    next(err);
  }
});
export default router;
