import express from "express";
import { assignJob, assigned, unassigned, allJob, removeLawyer, deleteJob,completeJob, viewJobDetails, editJobDetails, pendingJob, completedJob, companyCompletedJob, companyPendingJob, lawyerAssignedJobs, lawyerPendingJobs, lawyerPendingJobs } from "../controllers/jobcontroller.js";

const router = express.Router();


// router.post("/api/create", create);


router.post('/api/assign', assignJob)
router.get('/api/assign', assigned)
router.get('/api/unassign', unassigned)
router.get('/api/alljobs', allJob)
router.delete('/api/removelawyer', removeLawyer)
router.delete('/api/deletejob', deleteJob)
router.get('/api/pendingjobs', pendingJob)
router.get('/api/completedjobs', completedJob)
router.get('/api/viewjobdetails', viewJobDetails)
router.put('/api/editjobdetails', editJobDetails)
router.put('/api/completejob', completeJob)
router.get('/api/company/completedjobs', companyCompletedJob)
router.get('/api/company/pendingjobs', companyPendingJob)
router.get('/api/lawyer/assignedjobs', lawyerAssignedJobs)
router.get('/api/lawyer/pendingjobs', lawyerPendingJobs)
router.get('/api/lawyer/completedjobs', lawyerPendingJobs)


export default router;
