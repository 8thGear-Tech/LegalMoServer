import { Admin } from "../models/adminmodel.js";
import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { sendEmail } from "../utils/email.js";
// FOR ADMIN

//view al jobs for request products
export const allJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  try {
    const jobs = await Job.find();
    return res.status(200).send(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// export const companyProfile = async (req, res) => {
//   try {
//     const company = await Company.findById(req.params.id);
//     res.status(200).json({ company });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const singleJob = async (req, res) => {
  const jobId = req.params.id;
  // const jobId = req.params.jobId;
  if (req.user.userType === "lawyer" || req.user.userType === "admin") {
    try {
      const job = await Job.findById(jobId);
      if (job) {
        res.status(200).json(job);
      } else {
        res.send(null);
        console.log("Job not found");
      }
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  } else {
    res.status(403).json({ message: "Unauthorized" });
  }
};
//   try {
//     const job = await Job.findById(jobId);
//     if (job) {
//       res.status(200).json(job);
//     } else {
//       res.send(null);
//       console.log("Job not found");
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

export const assignJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  const { lawyerId, jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    const lawyer = await Lawyer.findById(lawyerId);
    if (!job || !lawyer) {
      return res.status(400).json({ error: "Job or Lawyer not found" });
    }

    if (job.assignedTo.includes(lawyerId)) {
      return res
        .status(400)
        .json({ error: "Lawyer already assigned to this task" });
    }

    if (lawyer.verified == true) {
      job.assignedTo.push(lawyerId);
      job.status = "pending";
      await job.save();
      return res.status(201).send(job);
    } else {
      return res.status(400).json({ error: "Unverified Lawyer" });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assigned = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  try {
    const assignedJob = await Job.find({ assignedTo: { $ne: [] } });
    if (assignJob) {
      res.status(201).json(assignedJob);
    } else {
      res.send(null);
      console.log("Nothing here");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unassigned = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  try {
    const unassignedJob = await Job.find({ assignedTo: [] });
    if (unassignedJob) {
      res.status(200).json(unassignedJob);
    } else {
      res.send(null);
      console.log("No unnassignedJob");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeLawyer = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  const { lawyerId, jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    const lawyer = await Lawyer.findById(lawyerId);
    if (!job || !lawyer) {
      return res.status(400).json({ error: "Job or Lawyer not found" });
    }

    if (!job.assignedTo.includes(lawyerId)) {
      return res
        .status(400)
        .json({ error: "Lawyer not assigned to this task" });
    }

    job.assignedTo = job.assignedTo.filter((id) => id.toString() != lawyerId);
    job.status = "unassigned";
    await job.save();
    return res.status(201).send(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      await job.remove();
      res.status(200).json({ message: "Job deleted successfully" });
    } else {
      res.send(null);
      console.log("Job not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      job.status = "completed";
      await job.save();
      res.status(200).json(job);
    } else {
      res.send(null);
      console.log("Job not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pendingJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  try {
    const pendingJob = await Job.find({ status: "pending" });
    if (pendingJob) {
      res.status(200).json(pendingJob);
    } else {
      res.send(null);
      console.log("No pending job");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completedJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: "Unauthorized!, You must be an Admin" });
    return;
  }
  try {
    const completedJob = await Job.find({ status: "completed" });
    if (completedJob) {
      res.status(200).json(completedJob);
    } else {
      res.send(null);
      console.log("No completed job");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewJobDetails = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    const jobDetails = job.detail;
    if (job) {
      res.status(200).json(jobDetails);
    } else {
      res.send(null);
      console.log("Job not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editJobDetails = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (lawyerExists) {
    res
      .status(401)
      .send({ message: "Unauthorized!, You must be a company or Admin" });
    return;
  }
  const jobId = req.params.jobId;
  const { detail } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      job.detail = detail;
      await job.save();
      res.status(200).json(job);
    } else {
      res.send(null);
      console.log("Job not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOR COMPANY

export const companyPendingJob = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  try {
    const companyPendingJob = await Job.find({
      companyId: req.userId,
      status: "pending",
    });
    if (!companyPendingJob || companyPendingJob.length === undefined) {
      res.status(404).send({ message: "No pending job" });
      console.log("No pending job");
      return;
    }

    res.status(200).json(companyPendingJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const companyCompletedJob = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a company" });
    return;
  }
  try {
    const companyCompletedJob = await Job.find({
      companyId: req.userId,
      status: "completed",
    });
    if (!companyCompletedJob || companyCompletedJob.length === undefined) {
      res.status(404).send({ message: "No completed job" });
      console.log("No completed job");
      return;
    }
    res.status(200).json(companyCompletedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOR LAWYERS

export const lawyerAssignedJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  try {
    const lawyerAssignedJob = await Job.find({ assignedTo: req.userId });
    if (!lawyerAssignedJob || lawyerAssignedJob.length === undefined) {
      res.status(404).send({ message: "No assigned job" });
      console.log("No assigned job");
      return;
    }
    res.status(200).json(lawyerAssignedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerPendingJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  try {
    const lawyerPendingJob = await Job.find({
      assignedTo: req.userId,
      status: "pending",
    });
    if (!lawyerPendingJob || lawyerPendingJob.length === undefined) {
      res.status(404).send({ message: "No pending job" });
      console.log("No pending job");
      return;
    }
    res.status(200).json(lawyerPendingJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerCompletedJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  try {
    const lawyerCompletedJob = await Job.find({
      assignedTo: req.userId,
      status: "completed",
    });
    if (!lawyerCompletedJob || lawyerCompletedJob.length === undefined) {
      res.status(404).send({ message: "No pending job" });
      console.log("No pending job");
      return;
    }
    res.status(200).json(lawyerCompletedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const requestMoreJobDetails = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: "Unauthorized!, You must be a lawyer" });
    return;
  }
  const jobId = req.params.jobId;
  const { detail } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      // const companyId = job.companyId.toHexString()
      // console.log(companyId)
      // const company = Company.findById(companyId)
      const company = await Company.findById(job.companyId.toHexString());
      console.log(company);
      const companyMail = company.officialEmail;
      const jobUrl = `http://api/job/:${jobId}`; //user/verify
      await sendEmail({
        email: companyMail,
        subject: "Request for more details",
        message: `Kindly updated the description of this product you bought: ${jobUrl}`,
        html: `<p>The lawyer working on the product you bought need some information on it </b> </p><p> ${detail} </b>.</p> <p>Click <a href=${jobUrl}> to update the description of this product you bought</p>`,
      });
      res.send({ message: "Mail sent" });
      return;
    } else {
      res.send(null);
      console.log("Job not found");
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
