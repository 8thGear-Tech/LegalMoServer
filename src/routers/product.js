import express from "express";
import {
  create,
  getProducts,
  updateProduct,
  deleteProduct,
  singleProduct,
} from "../controllers/productcontroller.js";
import { authToken } from "../middleware/AuthToken.js";
import multer from "multer";

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

router.post("/api/create", authToken, upload.single("productImage"), create);
router.get("/api/products", getProducts);
router.put("/api/update/:id", authToken, updateProduct);
router.delete("/api/delete/:id", authToken, deleteProduct);
router.get("/api/product/:id", singleProduct);
export default router;
