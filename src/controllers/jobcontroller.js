import { Admin } from '../models/adminmodel.js';
import { Company } from '../models/companymodel.js';
import { Job } from '../models/jobmodel.js';
import {Lawyer} from '../models/lawyermodel.js'
import jwt from 'jsonwebtoken'


// Generates a JSON Web Token (JWT) for a user.
 const jwtsecret = process.env.JWT_SECRET;
 

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

//Auth

export const checkuser = async (req, res) => {
    try {
        const token = req.headers.authorization;
        console.log(token)
      // Verify the token
      const decoded = jwt.verify(token, jwtsecret);
  
      // Determine the user type from the token payload
      const userType = decoded.userType;
  
      // Find the user by their ID (decoded from the token) based on the user type
      let user;
  
      if (userType === 'admin') {
        user = await Admin.findById(decoded.id);
      } else if (userType === 'company') {
        user = await Company.findById(decoded.id);
      } else if (userType === 'lawyer') {
        user = await Lawyer.findById(decoded.id);
      } else {
        return res.status(400).send('Invalid user type.');
      }
  
      if (!user) {
        return res.status(404).send('User not found.');
      }
  
     console.log(user)
      // Optionally, you can redirect the user to a login page or show a confirmation success message.
      res.status(200).send(` ${userType} Email confirmed successfully. You can now log in.`);
    } catch (error) {
      console.error('Email confirmation error:', error);
      res.status(400).send('Invalid or expired token.');
    }
  };


