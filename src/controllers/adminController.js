import { Admin } from "../models/adminmodel.js";
import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import sendEmail from "../utils/email.js";

export const companys = async(req, res) => {
    const isAdmin = await Admin.findById(req.userId)
    if(!isAdmin){
        res.status(401).send({message : "Unauthorized!, You must be an Admin"})
        return
    }
    try {
        const company = await Company.find();
        res.status(200).json({company})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const lawyers = async(req, res) => {
    const isAdmin = await Admin.findById(req.userId)
    if(!isAdmin){
        res.status(401).send({message : "Unauthorized!, You must be an Admin"})
        return
    }
    try {
        const lawyer = await Lawyer.find();
        res.status(200).json({lawyer})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const companyProfile = async(req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        res.status(200).json({company})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const lawyerProfile = async(req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.params.id);
        res.status(200).json({lawyer})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const verifyLawyer = async(req, res) => {
    const isAdmin = await Admin.findById(req.userId)
    if(!isAdmin){
        res.status(401).send({message : "Unauthorized!, You must be an Admin"})
        return
    }
    try {
        const isLawyerMailConfirmed = await Lawyer.findById(req.params.id)
        console.log(isLawyerMailConfirmed)
        if(!isLawyerMailConfirmed || isLawyerMailConfirmed === null || isLawyerMailConfirmed === undefined){
            res.status(401).send({message : "Not a lawyer"})
            return
        }
        if(!isLawyerMailConfirmed.isEmailConfirmed){
            res.status(401).send({message : "Unauthorized!, Lawyer has not confirmed email"})
            return
        }
        const lawyer = await Lawyer.findByIdAndUpdate(req.params.id, {verified : true});
        await sendEmail({
            email: lawyer.officialEmail,
            subject: 'You have been verified',
            message: `You have been verified`,
            html: `<p>Verification Process completed, you are now a verified lawyer on our platform.</p>`
        });
        res.status(200).json({lawyer})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const verifiedLawyers = async(req, res) => {
    const isAdmin = await Admin.findById(req.userId)
    if(!isAdmin){
        res.status(401).send({message : "Unauthorized!, You must be an Admin"})
        return
    }
    try {
        const lawyers = await Lawyer.find({verified : true});
        res.status(200).json({lawyers})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}

export const unverifiedLawyers = async(req, res) => {
    const isAdmin = await Admin.findById(req.userId)
    if(!isAdmin){
        res.status(401).send({message : "Unauthorized!, You must be an Admin"})
        return
    }
    try {
        const lawyers = await Lawyer.find({verified : false});
        res.status(200).json({lawyers})
    } catch (error) {
        res.status(500).json({error : error.message})
    }
}