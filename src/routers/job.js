import express from "express";
import middleware from "../middleware/schemaValidator.js";
import { assignJob, assigned, unassigned } from "../controllers/jobcontroller.js";

const router = express.Router();


// router.post("/api/create",middleware(productSchemas.productcreation), create);
// router.post("/api/create", create);


router.post('/api/assign', assignJob)
router.get('/api/assign', assigned)
router.get('/api/unassign', unassigned)

export default router;

