import { Lawyer } from '../models/lawyermodel.js';
import { Job } from '../models/jobmodel.js';
import { paymentDetail, options } from '../utils/productvalidation.js';

//  * Add payment details to a lawyer's account.
//  * @param {Object} req.body - The request body containing accountNumber, accountName, and bank.
//  * @param {Object} req.user - The authenticated user object.
//  * @param {string} req.user._id - The ID of the authenticated user.
 
export const addPaymentDetails = async (req, res) => {
    const lawyerExists = await Lawyer.findById(req.userId)
    if(!lawyerExists){
        res.status(404).send({message : "Unauthorized!, You must be a lawyer"})
        return
    }
    const validate = paymentDetail.validate(req.body, options)
        if (validate.error) {
            const message = validate.error.details.map((detail) => detail.message).join(',');
                return res.status(400).send({
                    status: 'fail',
                    message,
                })
          }
    const { accountNumber, accountName, bank } = req.body;
    try {
        const isLawyerMailConfirmed = await Lawyer.findById(req.userId)
        if(!isLawyerMailConfirmed.isEmailConfirmed){
            res.status(401).send({message : "Unauthorized!, Lawyer has not confirmed email"})
            return
        }
        const lawyer = await Lawyer.findByIdAndUpdate(req.userId, {
        $push: {
            accountDetails: {
            accountNumber: accountNumber,
            accountName: accountName,
            bank: bank,
            },
        },
        });
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

export const editPaymentDetails = async (req, res) => {
    const lawyerExists = await Lawyer.findById(req.userId)
    if(!lawyerExists){
        res.status(404).send({message : "Unauthorized!, You must be a lawyer"})
        return
    }
    const { accountNumber, accountName, bank } = req.body;
    try {
        const lawyer = await Lawyer.findByIdAndUpdate(req.userId, {
        $set: {
            accountDetails: {
                accountNumber: accountNumber,
                accountName: accountName,
                bank: bank,
                },
        },
        });
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

export const getPaymentDetails = async (req, res) => {
    const lawyerExists = await Lawyer.findById(req.userId)
    if(!lawyerExists){
        res.status(404).send({message : "Unauthorized!, You must be a lawyer"})
        return
    }    
    try {
        const lawyer = await Lawyer.findById(req.userId);
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

