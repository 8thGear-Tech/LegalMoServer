import express from "express";
import {
  assignJob,
  addJobDetails,
  assigned,
  singleJob,
  unassigned,
  allJob,
  removeLawyer,
  deleteJob,
  completeJob,
  viewJobDetails,
  editJobDetails,
  pendingJob,
  completedJob,
  companyCompletedJob,
  companyPendingJob,
  lawyerAssignedJobs,
  lawyerPendingJobs,
  lawyerCompletedJobs,
  requestMoreJobDetails,
  applyForJob,
} from "../controllers/jobcontroller.js";
import { authToken } from "../middleware/AuthToken.js";

const router = express.Router();

router.get("/job-api/jobs", authToken, allJob);
router.get("/job-api/job/:jobId", authToken, singleJob);
router.post("/job-api/job/:jobId", authToken, addJobDetails);
router.post("/job-api/assign", authToken, assignJob);
router.get("/job-api/assign", authToken, assigned);
router.get("/job-api/unassign", authToken, unassigned);
router.delete("/job-api/removelawyer", authToken, removeLawyer);
router.delete("/job-api/deletejob", authToken, deleteJob);
router.get("/job-api/pendingjobs", authToken, pendingJob);
router.get("/job-api/completedjobs", authToken, completedJob);
router.put("/job-api/completejob", authToken, completeJob);
router.get("/job-api/viewjobdetails/:jobId", authToken, viewJobDetails);
router.put("/job-api/editjobdetails/:jobId", authToken, editJobDetails);
router.get("/job-api/company/completedjobs", authToken, companyCompletedJob);
router.get("/job-api/company/pendingjobs", authToken, companyPendingJob);
router.get("/job-api/lawyer/assignedjobs", authToken, lawyerAssignedJobs);
router.get("/job-api/lawyer/pendingjobs", authToken, lawyerPendingJobs);
router.get("/job-api/lawyer/completedjobs", authToken, lawyerCompletedJobs);
router.post(
  "/job-api/requestmorejobdetails/:jobId",
  authToken,
  requestMoreJobDetails
);
router.post("/job-api/applyforjob/:jobId", authToken, applyForJob);

export default router;
