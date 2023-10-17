import express from "express";
import { assignJob, assigned, unassigned, allJob, removeLawyer, deleteJob, pendingJob, completedJob } from "../controllers/jobcontroller.js";

const router = express.Router();


// router.post("/api/create", create);


router.post('/api/assign', assignJob)
router.get('/api/assign', assigned)
router.get('/api/unassign', unassigned)
router.get('/api/alljobs', allJob)
router.delete('/api/removelawyer', removeLawyer)
router.delete('/api/deletejob', deleteJob)
router.get('/api/pendingjob', pendingJob)
router.get('/api/completedjob', completedJob)

export default router;
