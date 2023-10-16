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

const router = express.Router();

router.post("/api/rating", addRating);
router.get("/api/rating", getRatings);
router.get("/api/rating/:id", getRating);
router.patch("/api/rating/:id", updateRating);
router.delete("/api/rating/:id", deleteRating);
router.get("/api/rating/company/:companyId", getRatingsByCompany);
router.get("/api/rating/product/:productId", getRatingsByProduct);
router.get("/api/rating/status/:status", getRatingsByStatus);

export default router;