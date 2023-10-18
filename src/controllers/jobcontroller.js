import { Admin } from "../models/adminmodel.js";
import { Company } from "../models/companymodel.js";
import { Job } from "../models/jobmodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { paymentDetailss, options } from "../utils/productvalidation.js";

// FOR ADMIN

//view al jobs for request products
export const allJob = async (req, res) => {
  try {
    const jobs = await Job.find();
    return res.status(200).send(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assignJob = async (req, res) => {
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

    job.assignedTo.push(lawyerId);
    job.status = "pending";
    await job.save();
    return res.status(201).send(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assigned = async (req, res) => {
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

// FOR LAWYERS
// export const viewJob = async (req, res) => {
//   const lawyerId = req.params.lawyerId;
//   try {
//     const lawyerJobs = await Job.find({ assignedTo: lawyerId });
//     if (lawyerJobs) {
//       res.status(200).json(lawyerJobs);
//     } else {
//       res.send(null);
//       console.log("No job assigned to you");
export const deleteJob = async (req, res) => {
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
    //   }
    // } catch (error) {
    //   res.status(500).json({ error: error.message });
  }
};

// export const paymentDetails = async (req, res) => {
//   const validate = paymentDetailss.validate(req.body, options);
//   if (validate.error) {
//     const message = validate.error.details
//       .map((detail) => detail.message)
//       .join(",");
//     return res.status(400).send({
//       status: "fail",
//       message,
//     });
//   }
//   const lawyerId = req.params.lawyerId;
//   const { accountNumber, accountName, bank } = req.body;
//   try {
//     const lawyer = await Lawyer.findById(lawyerId);
//     if (lawyer) {
//       lawyer.accountDetails.push(accountNumber, accountName, bank);
//       res.status(200).json(lawyer);
//     } else {
//       res.send(null);
//       console.log("You are not a lawyer");
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };
export const completeJob = async (req, res) => {
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
    if (job) {
      res.status(200).json(job);
    } else {
      res.send(null);
      console.log("Job not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const editJobDetails = async (req, res) => {
  const jobId = req.params.jobId;
  const { productId, detail } = req.body;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      job.productId = productId;
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
  const companyId = req.params.companyId;
  try {
    const company = await Company.findById(companyId);
    if (company) {
      const companyPendingJob = await Job.find({
        companyId: companyId,
        status: "pending",
      });
      if (!companyPendingJob) {
        res.send(null);
        console.log("No pending job");
      }
      res.status(200).json(companyPendingJob);
    } else {
      res.send(null);
      console.log("Company not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const companyCompletedJob = async (req, res) => {
  const companyId = req.params.companyId;
  try {
    const company = await Company.findById(companyId);
    if (company) {
      const companyCompletedJob = await Job.find({
        companyId: companyId,
        status: "completed",
      });
      if (!companyCompletedJob) {
        res.send(null);
        console.log("No completed job");
      }
      res.status(200).json(companyCompletedJob);
    } else {
      res.send(null);
      console.log("Company not found");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOR LAWYERS

export const lawyerAssignedJobs = async (req, res) => {
  const lawyerId = req.params.lawyerId;
  try {
    const lawyer = await Lawyer.findById(lawyerId);
    if (lawyer) {
      const lawyerAssignedJob = await Job.find({ assignedTo: lawyerId });
      if (!lawyerAssignedJob) {
        res.send(null);
        console.log("No assigned job");
      }
      res.status(200).json(lawyerAssignedJob);
    } else {
      res.send(null);
      console.log("You are not a lawyer");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerPendingJobs = async (req, res) => {
  const lawyerId = req.params.lawyerId;
  try {
    const lawyer = await Lawyer.findById(lawyerId);
    if (lawyer) {
      const lawyerPendingJob = await Job.find({
        assignedTo: lawyerId,
        status: "pending",
      });
      if (!lawyerPendingJob) {
        res.send(null);
        console.log("No pending job");
      }
      res.status(200).json(lawyerPendingJob);
    } else {
      res.send(null);
      console.log("You are not a lawyer");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerCompletedJobs = async (req, res) => {
  const lawyerId = req.params.lawyerId;
  try {
    const lawyer = await Lawyer.findById(lawyerId);
    if (lawyer) {
      const lawyerCompletedJob = await Job.find({
        assignedTo: lawyerId,
        status: "completed",
      });
      if (!lawyerCompletedJob) {
        res.send(null);
        console.log("No completed job");
      }
      res.status(200).json(lawyerCompletedJob);
    } else {
      res.send(null);
      console.log("You are not a lawyer");
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
