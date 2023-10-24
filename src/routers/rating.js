import express from "express";
import {
  addRating,
  getRating,
  getRatings,
  deleteRating,
  updateRating,
  getRatingsByCompany,
  getRatingsByProduct,
  getRatingsByStatus,
} from "../controllers/ratingcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
const router = express.Router();

router.post("/api/rating", authToken, addRating);
router.get("/api/rating", getRatings);
//no token defined
router.get("/api/rating/:id", getRating);
router.patch("/api/rating/:id", authToken, updateRating);
router.delete("/api/rating/:id", authToken, deleteRating);
router.get("/api/rating/company/:companyId", getRatingsByCompany);
router.get("/api/rating/product/:productId", getRatingsByProduct);
router.get("/api/rating/status/:status", getRatingsByStatus);

export default router;
