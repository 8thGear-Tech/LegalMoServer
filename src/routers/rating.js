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
router.get("/ratings-api/rating", getRatings);
router.get("/api/rating/:id", getRating);
router.patch("/api/rating/:id", authToken, updateRating);
router.delete("/api/rating/:id", authToken, deleteRating);
router.get("/ratings-api/rating/company/:companyId", getRatingsByCompany);
router.get("/ratings-api/rating/product/:productId", getRatingsByProduct);
router.get("/ratings-api/rating/status/:status", getRatingsByStatus);

export default router;
