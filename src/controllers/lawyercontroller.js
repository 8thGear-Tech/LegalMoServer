import { Lawyer } from '../models/lawyermodel.js';
import { Job } from '../models/jobmodel.js';

//  * Add payment details to a lawyer's account.
//  * @param {Object} req.body - The request body containing accountNumber, accountName, and bank.
//  * @param {Object} req.user - The authenticated user object.
//  * @param {string} req.user._id - The ID of the authenticated user.
 
export const addPaymentDetails = async (req, res) => {
    const { accountNumber, accountName, bank } = req.body;
    try {
        const lawyer = await Lawyer.findByIdAndUpdate(req.user._id, {
        $push: {
            accountDetails: {
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName,
            bank: req.body.bank,
            },
        },
        });
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

export const editPaymentDetails = async (req, res) => {
    const { accountNumber, accountName, bank } = req.body;
    try {
        const lawyer = await Lawyer.findByIdAndUpdate(req.user._id, {
        $set: {
            accountDetails: {
            accountNumber: req.body.accountNumber,
            accountName: req.body.accountName,
            bank: req.body.bank,
            },
        },
        });
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    }

export const getPaymentDetails = async (req, res) => {
    try {
        const lawyer = await Lawyer.findById(req.user._id);
        res.status(200).json({ lawyer });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
    };

