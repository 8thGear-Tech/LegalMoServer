import {Company} from '../models/companymodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import {Admin } from '../models/adminmodel.js';

export const getOneLawyer = async (req, res) => {
  const { userId } = req.params;

  try {
    const lawyer = await Lawyer.findOne({ _id: userId }); 

    if (!lawyer) {
      return res.status(404).json({ error: 'Lawyer not found' });
    }
    res.status(200).json(lawyer);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export const getAllLawyers = async (req, res) => {
  try {
    const lawyers = await Lawyer.find();
    res.status(200).json(lawyers);
  } catch (error) {
    console.error('Error fetching lawyers:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getOneCompany = async (req, res) => {
  const { userId } = req.params;
  try {
    const company = await Company.findOne({ _id: userId})
    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }
    res.status(200).json(company);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find();
    res.status(200).json(companies);
  } catch (error) {
    console.error('Error fetching companies:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getOneAdmin = async (req, res) => {
  const { userId } = req.params
  try {
    const admin = await Admin.findOne({ _id: userId})
  
    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }
    res.status(200).json(admin);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    console.error('Error fetching admins:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}