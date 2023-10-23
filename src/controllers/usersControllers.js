import {Company} from '../models/companymodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import {Admin } from '../models/adminmodel.js';
import { validateLawyerProfileUpdate, validateAdminProfileUpdate, validateCompanyProfileUpdate, options } from '../utils/validator.js';

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
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const getOneAdmin = async (req, res) => {
  const { userId } = req.params
  try {
    const admin = await Admin.findOne({ _id: userId })
      .populate('companies') // Populate the companies field
      .populate('lawyers')   // Populate the lawyers field
      .exec();
    
      console.log(admin);

    if (!admin) {
      return res.status(404).json({ error: 'Admin not found' });
    }

    // // Extract all companies and lawyers from the admin document
    // const companies = admin.companies.map(company => ({
    //   id: company._id,
    //   name: company.name,
    //   email: company.email,
    //   phoneNumber: company.phoneNumber,
    // }));
    // const lawyers = admin.lawyers.map(lawyer => ({
    //   id: lawyer._id,
    //   name: lawyer.name,
    //   email: lawyer.email,
    //   phoneNumber: lawyer.phoneNumber,
    // }));

    res.status(200).json({
      status: 'success',
      data: {
        admin: admin.toObject(),
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
}
export const adminProfileUpdate = async (req, res) => {
  try {
    const _id = req.query

    const validate = validateAdminProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    const admin =  await Admin.findById(_id);

    if (!admin) {
      return res.status(404).json({ message: 'Admin not found' });
    }
  
    // Update user profile with new information
    admin.name = req.body.name;
    // user.email = req.body.email;
  
    // Save updated user to database
    await admin.save();
  
    // Return success response to client
    res.status(200).json({ message: 'Profile updated successfully', admin });
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
  
}
export const companyProfileUpdate = async (req, res) => {
  try {
    const _id = req.query

    const validate = validateCompanyProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    const company =  await Company.findById(_id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    // Update user profile with new information
    company.officialEmail = req.body.officialEmail;
    company.website = req.body.website;
    company.yourBio = req.body.yourBio;
    company.phoneNumber = req.body.phoneNumber;
    company.officeAddress = req.body.officeAddress;
    company.alternativeEmailAddress = req.body.alternativeEmailAddress;
  
    // Save updated user to database
    await company.save();
  
    // Return success response to client
    res.status(200).json({ message: 'Profile updated successfully', company });
  }
  catch (error) {
    console.log(error);
    res.status(500).json({ message: 'Error updating profile' });
  }
  
}
export const lawyerProfileUpdate = async (req, res) => {
  try {
    const _id = req.query

    const validate = validateLawyerProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    const lawyer =  await Lawyer.findById(_id);

    if (!lawyer) {
      return res.status(404).json({ message: 'Lawyer not found' });
    }
  
    // Update user profile with new information
      lawyer.officialEmail = req.body.officialEmail;
      lawyer.scn = req.body.scn;
      lawyer.yourBio = req.body.yourBio;
      lawyer.yearOfCall = req.body.yearOfCall;
      lawyer.phoneNumber = req.body.phoneNumber;
      lawyer.alternativeEmailAddress = req.body.alternativeEmailAddress;

    // Save updated user to database
    await lawyer.save();
  
    // Return success response to client
    res.status(200).json({ message: 'Profile updated successfully', lawyer });
  }
  catch (error) {
    res.status(500).json({ message: 'Error updating profile' });
  }
}