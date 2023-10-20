import express from "express";
import { assignJob, assigned, unassigned, allJob, removeLawyer, deleteJob,completeJob, viewJobDetails, editJobDetails, pendingJob, completedJob, companyCompletedJob, companyPendingJob, lawyerAssignedJobs, lawyerPendingJobs, lawyerCompletedJobs } from "../controllers/jobcontroller.js";
import { authToken } from "../middleware/AuthToken.js";


const router = express.Router();


// router.post("/api/create", create);

router.get('/api/jobs',authToken, allJob)
router.post('/api/assign',authToken, assignJob)
router.get('/api/assign', authToken, assigned)
router.get('/api/unassign', authToken, unassigned)
router.delete('/api/removelawyer', authToken, removeLawyer)
router.delete('/api/deletejob', authToken, deleteJob)
router.get('/api/pendingjobs', authToken, pendingJob)
router.get('/api/completedjobs', authToken, completedJob)
router.put('/api/completejob',authToken, completeJob)
router.get('/api/viewjobdetails',authToken, viewJobDetails)
router.put('/api/editjobdetails',authToken, editJobDetails)
router.get('/api/company/completedjobs',authToken, companyCompletedJob)
router.get('/api/company/pendingjobs',authToken, companyPendingJob)
router.get('/api/lawyer/assignedjobs',authToken, lawyerAssignedJobs)
router.get('/api/lawyer/pendingjobs',authToken, lawyerPendingJobs)
router.get('/api/lawyer/completedjobs',authToken, lawyerCompletedJobs)


export default router;
