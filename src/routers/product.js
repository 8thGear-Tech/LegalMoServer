import express from "express";
//auth
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config({ path: "./configenv.env" });
//auth

import {
  create,
  getProducts,
  updateProduct,
  deleteProduct,
  singleProduct,
} from "../controllers/productcontroller.js";

// import { authToken } from "../middleware/AuthToken.js";
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

router.get("/api/products", getProducts);
router.get("/api/product/:id", singleProduct);

export const authToken = (req, res, next) => {
  if (!req.headers.authorization) {
    res.status(401).send({ message: "Unauthorized!, You must be signed in" });
    return;
  }
  try {
    // Get the token from the request cookies
    const token = req.headers.authorization.split(" ")[1];
    const jwtsecret = process.env.JWT_SECRET;
    // Verify the token
    const decoded = jwt.verify(token, jwtsecret);
    console.log(decoded);
    // Set user data in the request object for use in route handlers
    req.userId = decoded.id;
    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Invalid or expired token
    res.status(401).json({ message: error });
  }
};

router.post("/api/create", authToken, upload.single("productImage"), create);
router.put("/api/update/:id", authToken, updateProduct);
router.delete("/api/delete/:id", authToken, deleteProduct);

// {
//     "message": "Unidentified user"
// }
// router.get("/api/product/:id", singleProduct);
export default router;
