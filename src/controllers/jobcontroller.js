import { Job } from '../models/jobmodel.js';
import {Lawyer} from '../models/lawyermodel.js'


// FOR ADMIN
export const assignJob = async (req, res) => {
    const jobId = req.params.id;
    const { lawyerId } = req.body;
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
