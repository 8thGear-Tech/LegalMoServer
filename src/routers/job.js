import express from "express";
import { assignJob, assigned, unassigned, allJob } from "../controllers/jobcontroller.js";

const router = express.Router();


// router.post("/api/create", create);


router.post('/api/assign', assignJob)
router.get('/api/assign', assigned)
router.get('/api/unassign', unassigned)
router.get('/api/alljobs', allJob)

export default router;