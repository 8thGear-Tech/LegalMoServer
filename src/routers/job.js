import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { assignJob } from "../controllers/jobcontroller.js";

const router = express.Router();


// router.post("/api/create",middleware(productSchemas.productcreation), create);
// router.post("/api/create", create);


router.post('/api/assign', assignJob)

export default router;

