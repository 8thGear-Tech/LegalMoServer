import express from "express";
import {
  assignJob,
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
} from "../controllers/jobcontroller.js";
import { authToken } from "../middleware/AuthToken.js";

const router = express.Router();

// router.post("/api/create", create);

router.get("/job-api/jobs", authToken, allJob);
// router.get("/api/jobs", authToken, allJob);
//endpoint rename
router.get("/job-api/job/:id", authToken, singleJob);
// router.get("/api/company/:id", authToken, companyProfile);
router.post("/api/assign", authToken, assignJob);
router.get("/api/assign", authToken, assigned);
router.get("/api/unassign", authToken, unassigned);
router.delete("/api/removelawyer", authToken, removeLawyer);
router.delete("/api/deletejob", authToken, deleteJob);
router.get("/api/pendingjobs", authToken, pendingJob);
router.get("/api/completedjobs", authToken, completedJob);
router.put("/api/completejob/:jobId", authToken, completeJob);
router.get("/api/viewjobdetails/:jobId", authToken, viewJobDetails);
router.put("/api/editjobdetails/:jobId", authToken, editJobDetails);
//endpoint rename
router.get("/job-api/company/completedjobs", authToken, companyCompletedJob);
router.get("/job-api/company/pendingjobs", authToken, companyPendingJob);
router.get("/job-api/lawyer/assignedjobs", authToken, lawyerAssignedJobs);
router.get("/job-api/lawyer/pendingjobs", authToken, lawyerPendingJobs);
router.get("/job-api/lawyer/completedjobs", authToken, lawyerCompletedJobs);
// router.get("/api/company/completedjobs", authToken, companyCompletedJob);
// router.get("/api/company/pendingjobs", authToken, companyPendingJob);
// router.get("/api/lawyer/assignedjobs", authToken, lawyerAssignedJobs);
// router.get("/api/lawyer/pendingjobs", authToken, lawyerPendingJobs);
// router.get("/api/lawyer/completedjobs", authToken, lawyerCompletedJobs);
router.post(
  "/api/requestmorejobdetails/:jobId",
  authToken,
  requestMoreJobDetails
);

export default router;
