import { Admin } from '../models/adminmodel.js';
import { Company } from '../models/companymodel.js';
import { Job } from '../models/jobmodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import { paymentDetail, options } from '../utils/productvalidation.js';
 
// FOR ADMIN

//view al jobs for request products
export const allJob = async (req, res) => {
    try {
        const jobs = await Job.find()
        return res.status(200).send(jobs)
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const assignJob = async (req, res) => {
   
    const { lawyerId, jobId } = req.body;
    try {
        const job = await Job.findById(jobId)
        const lawyer = await Lawyer.findById(lawyerId)
        if(!job || !lawyer){
            return res.status(400).json({ error: 'Job or Lawyer not found'})
        }

        if(job.assignedTo.includes(lawyerId)){
            return res.status(400).json({ error: 'Lawyer already assigned to this task'})
        }

        job.assignedTo.push(lawyerId)
        job.status = "pending"
        await job.save()
        return res.status(201).send(job)
    }
    catch(error){
       res.status(500).json({error : error.message})
    }       
}

export const assigned = async (req, res) => {
    try {
        const assignedJob = await Job.find({ assignedTo: { $ne: []}})
        if(assignJob){
            res.status(201).json(assignedJob)
        }else{
            res.send(null)
            console.log("Nothing here")
        }
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const unassigned = async (req, res) => {
    try {
        const unassignedJob = await Job.find({ assignedTo: []})
        if (unassignedJob) {
            res.status(200).json(unassignedJob)
        } else {
            res.send(null)
            console.log("No unnassignedJob")
        }
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}



export const removeLawyer = async (req, res) => {
    const { lawyerId, jobId } = req.body;
    try {
        const job = await Job.findById(jobId)
        const lawyer = await Lawyer.findById(lawyerId)
        if(!job || !lawyer){
            return res.status(400).json({ error: 'Job or Lawyer not found'})
        }

        if(!job.assignedTo.includes(lawyerId)){
            return res.status(400).json({ error: 'Lawyer not assigned to this task'})
        }

        job.assignedTo = job.assignedTo.filter(id => id.toString() != lawyerId)
        job.status = "unassigned"
        await job.save()
        return res.status(201).send(job)
    }
    catch(error){
       res.status(500).json({error : error.message})
    }       
}



// FOR LAWYERS
export const viewJob = async (req,res) => {

    const lawyerId = req.params.lawyerId
    try {
        const lawyerJobs = await Job.find({assignedTo: lawyerId})
        if(lawyerJobs){
            res.status(200).json(lawyerJobs)
        }else{
            res.send(null)
            console.log("No job assigned to you")
        }
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const paymentDetails = async(req, res) => {
    const validate = paymentDetail.validate(req.body, options)
    if (validate.error) {
        const message = validate.error.details.map((detail) => detail.message).join(',');
            return res.status(400).send({
                status: 'fail',
                message,
            })
      }
    const lawyerId = req.params.lawyerId
    const {accountNumber, accountName, bank} =  req.body
    try {
        const lawyer = await Lawyer.findById(lawyerId)
        if(lawyer){
            lawyer.accountDetails.push(accountNumber, accountName, bank)
            res.status(200).json(lawyer)
        }else{
            res.send(null)
            console.log("You are not a lawyer")
        }
        
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

 