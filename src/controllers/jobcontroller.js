import { Admin } from '../models/adminmodel.js';
import { Company } from '../models/companymodel.js';
import { Job } from '../models/jobmodel.js';
import { Lawyer } from '../models/lawyermodel.js';
import sendEmail from '../utils/email.js';
// FOR ADMIN

//view al jobs for request products
export const allJob = async (req, res) => {
  try {
    const jobs = await Job.find().populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!jobs || jobs.length === 0) {
      return res.status(404).json({ error: 'No jobs found' });
    }
    // const allJobsWithProducts = [];
    // for (const job of jobs) {
    //   const populatedJob = await job.populate('productId companyId assignedTo');
    //   allJobsWithProducts.push(populatedJob);
    // }
    return res.status(200).send(jobs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const singleJob = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!job || job.length === 0) {
      return res.status(404).json({ error: 'No jobs found' });
    }
    if (job) {
      //   const jobWithProduct = await job.populate(
      //     'productId companyId assignedTo'
      //   );
      res.status(200).json(job);
    } else {
      res.send(null);
      console.log('Job not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const addJobDetails = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  const { detail, file } = req.body;
  try {
    const job = await Job.findByIdAndUpdate(
      req.params.jobId,
      { detail, file },
      { new: true }
    );
    const populatedJob = await job.populate(
      'productId companyId assignedTo appliedLawer'
    );
    res.status(201).json(populatedJob);
  } catch (error) {
    res.status(500).send(error);
  }
};

export const assignJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  const { lawyerId, jobId } = req.body;
  try {
    const job = await Job.findById(jobId);
    const lawyer = await Lawyer.findById(lawyerId);
    if (!job || !lawyer) {
      return res.status(400).json({ error: 'Job or Lawyer not found' });
    }

    if (job.assignedTo.includes(lawyerId)) {
      return res
        .status(400)
        .json({ error: 'Lawyer already assigned to this job' });
    }

    if (lawyer.verified == true) {
      job.assignedTo.push(lawyerId);
      job.status = 'pending';
      await job.save();
      const populateJob = job.populate(
        'productId companyId assignedTo appliedLawer'
      );
      return res.status(201).send(populateJob);
    } else {
      return res.status(400).json({ error: 'Unverified Lawyer' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const assigned = async (req, res) => {
  try {
    const assignedJob = await Job.find({ assignedTo: { $ne: [] } }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    console.log(assignedJob.length);
    if (!assignedJob || assignedJob.length === 0) {
      res.send(null);
      console.log('Nothing here');
    } else {
      //   const jobWithProduct = await assignedJob
      res.status(200).json(assignedJob);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const unassigned = async (req, res) => {
  try {
    const unassignedJob = await Job.find({ assignedTo: [] }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!unassignedJob || unassignedJob.length === 0) {
      res.send(null);
      console.log('No unnassignedJob');
    } else {
      //   const jobWithProduct = await unassignedJob.populate(
      //     'productId companyId assignedTo'
      //   );
      res.status(200).json(unassignedJob);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const removeLawyer = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  const { lawyerId, jobId } = req.body;
  try {
    const job = await Job.findById(jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    const lawyer = await Lawyer.findById(lawyerId);
    if (!job || !lawyer) {
      return res.status(400).json({ error: 'Job or Lawyer not found' });
    }

    if (!job.assignedTo.includes(lawyerId)) {
      return res.status(400).json({ error: 'Lawyer not assigned to this job' });
    }

    job.assignedTo = job.assignedTo.filter((id) => id.toString() != lawyerId);
    job.status = 'unassigned';
    await job.save();
    return res.status(201).send(job);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId);
    if (job) {
      await job.remove();
      res.status(200).json({ message: 'Job deleted successfully' });
    } else {
      res.send(null);
      console.log('Job not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completeJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (job) {
      job.status = 'completed';
      await job.save();
      return res.status(201).send(job);
    } else {
      res.send(null);
      console.log('Job not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const pendingJob = async (req, res) => {
  try {
    const pendingJob = await Job.find({ status: 'pending' }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (pendingJob) {
      return res.status(201).send(pendingJob);
    } else {
      res.send(null);
      console.log('No pending job');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const completedJob = async (req, res) => {
  const isAdmin = await Admin.findById(req.userId);
  if (!isAdmin) {
    res.status(401).send({ message: 'Unauthorized!, You must be an Admin' });
    return;
  }
  try {
    const completedJob = await Job.find({ status: 'completed' }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (completedJob) {
      return res.status(200).send(completedJob);
    } else {
      res.send(null);
      console.log('No completed job');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const viewJobDetails = async (req, res) => {
  const jobId = req.params.jobId;
  try {
    const job = await Job.findById(jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    const jobDetails = job.detail;
    if (job) {
      return res.status(200).send(job);
    } else {
      res.send(null);
      console.log('Job not found');
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
      .send({ message: 'Unauthorized!, You must be a company or Admin' });
    return;
  }
  const jobId = req.params.jobId;
  const { detail } = req.body;
  try {
    const job = await Job.findById(jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (job) {
      job.detail = detail;
      await job.save();
      return res.status(201).send(job);
    } else {
      res.send(null);
      console.log('Job not found');
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOR COMPANY

export const companyPendingJob = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(401).send({ message: 'Unauthorized!, You must be a company' });
    return;
  }
  try {
    const companyPendingJob = await Job.find({
      companyId: req.userId,
      status: 'pending',
    }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!companyPendingJob || companyPendingJob.length === undefined) {
      res.status(404).send({ message: 'No pending job' });
      console.log('No pending job');
      return;
    }
    return res.status(200).send(companyPendingJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const companyCompletedJob = async (req, res) => {
  const companyExists = await Company.findById(req.userId);
  if (!companyExists) {
    res.status(401).send({ message: 'Unauthorized!, You must be a company' });
    return;
  }
  try {
    const companyCompletedJob = await Job.find({
      companyId: req.userId,
      status: 'completed',
    }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!companyCompletedJob || companyCompletedJob.length === undefined) {
      res.status(404).send({ message: 'No completed job' });
      console.log('No completed job');
      return;
    }
    return res.status(200).send(companyCompletedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// FOR LAWYERS

export const lawyerAssignedJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: 'Unauthorized!, You must be a lawyer' });
    return;
  }
  try {
    const lawyerAssignedJob = await Job.find({
      assignedTo: req.userId,
    }).populate('productId companyId assignedTo appliedLawer');
    if (!lawyerAssignedJob || lawyerAssignedJob.length === undefined) {
      res.status(404).send({ message: 'No assigned job' });
      console.log('No assigned job');
      return;
    }
    return res.status(200).send(lawyerAssignedJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerPendingJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: 'Unauthorized!, You must be a lawyer' });
    return;
  }
  try {
    const lawyerPendingJob = await Job.find({
      assignedTo: req.userId,
      status: 'pending',
    }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!lawyerPendingJob || lawyerPendingJob.length === undefined) {
      res.status(404).send({ message: 'No pending job' });
      console.log('No pending job');
      return;
    }
    return res.status(200).send(lawyerPendingJob);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const lawyerCompletedJobs = async (req, res) => {
  const lawyerExists = await Lawyer.findById(req.userId);
  if (!lawyerExists) {
    res.status(401).send({ message: 'Unauthorized!, You must be a lawyer' });
    return;
  }
  try {
    const lawyerCompletedJob = await Job.find({
      assignedTo: req.userId,
      status: 'completed',
    }).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!lawyerCompletedJob || lawyerCompletedJob.length === undefined) {
      res.status(404).send({ message: 'No pending job' });
      console.log('No pending job');
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
    res.status(401).send({ message: 'Unauthorized!, You must be a lawyer' });
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
        subject: 'Request for more details',
        message: `Kindly updated the description of this product you bought: ${jobUrl}`,
        html: `<p>The lawyer working on the product you bought need some information on it </b> </p><p> ${detail} </b>.</p> <p>Click <a href=${jobUrl}> to update the description of this product you bought</p>`,
      });
      res.send({ message: 'Mail sent' });
      return;
    } else {
      res.send(null);
      console.log('Job not found');
      return;
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const applyForJob = async (req, res) => {
  const lawyer = await Lawyer.findById(req.userId);
  if (!lawyer) {
    res.status(401).send({ message: 'Unauthorized!, You must be a lawyer' });
    return;
  }
  try {
    const job = await Job.findById(req.params.jobId).populate(
      'productId companyId assignedTo appliedLawer'
    );
    if (!job) {
      return res.status(400).json({ error: 'Job not found' });
    }
    if (job.assignedTo.includes(req.userId)) {
      return res
        .status(400)
        .json({ error: 'You are already assigned to this job' });
    }

    // if (
    //   job.assignedTo.length !== 0 ||
    //   job.assignedTo !== null ||
    //   job.assignedTo.length !== undefined
    // ) {
    //   return res
    //     .status(400)
    //     .json({ error: 'A Lawyer already assigned to this job' });
    // }
    if (lawyer.verified == true) {
      job.appliedLawer.push(req.userId);
      await job.save();
      return res.status(200).send(job);
    } else {
      return res.status(400).json({ error: 'Unverified Lawyer' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
