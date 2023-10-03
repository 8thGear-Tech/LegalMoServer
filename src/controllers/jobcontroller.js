import { Job } from '../models/jobmodel.js';
import {Lawyer} from '../models/lawyermodel.js'



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
    }
    catch{
        res.send(error)
        console.log(error)
    }       
}
