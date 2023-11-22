import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";
import {
  validateLawyerProfileUpdate,
  validateAdminProfileUpdate,
  validateCompanyProfileUpdate,
  options,
} from "../utils/validator.js";
import { checkInternetConnection } from "../utils/utils.js";
import cloudinary from "../utils/cloudinary.js";

export const getOneLawyer = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();
    const _id = req.query;

    const lawyer = await Lawyer.findOne({ _id });

    if (!lawyer) {
      return res.status(404).json({ error: "Lawyer not found" });
    }

    res.status(200).json(lawyer);
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllLawyers = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const lawyers = await Lawyer.find();

    res.status(200).json(lawyers);
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getOneCompany = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const _id = req.query;

    const company = await Company.findOne({ _id });
    if (!company) {
      return res.status(404).json({ error: "Company not found" });
    }
    res.status(200).json(company);
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllCompanies = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const companies = await Company.find();

    res.status(200).json(companies);
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getOneAdmin = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const _id = req.query;
    const id = _id._id;

    const admin = await Admin.findById(id).populate("companies lawyers");

    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res.status(200).json({
      status: "success",
      data: {
        admin: admin,
      },
    });
  } catch (error) {
    console.log(error);
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const getAllAdmins = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const admins = await Admin.find();
    res.status(200).json(admins);
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ error: "Internal Server Error" });
  }
};
export const adminProfileUpdate = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const _id = req.query;

    // Check if the request body is empty
    if (
      Object.keys(req.body).length === 0 &&
      req.body.constructor === Object &&
      !req.file
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const validate = validateAdminProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    let imageUpload;
    if (req.file) {
      imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "profileImages",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
    }

    const admin = await Admin.findById(_id);

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // Update user profile with new information
    if (req.body.name) admin.name = req.body.name;
    if (req.body.officialEmail) admin.officialEmail = req.body.officialEmail;
    if (req.body.phoneNumber) admin.phoneNumber = req.body.phoneNumber;
    if (imageUpload) {
      admin.profileImage = {
        url: imageUpload.secure_url,
        publicId: imageUpload.public_id,
      };
    }

    // Save updated user to database
    await admin.save();

    // Return success response to client
    res.status(200).json({ message: "Profile updated successfully", admin });
  } catch (error) {
    console.log(error);
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};
export const companyProfileUpdate = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const _id = req.query;

    // Check if the request body is empty
    if (
      Object.keys(req.body).length === 0 &&
      req.body.constructor === Object &&
      !req.file
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const validate = validateCompanyProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }
    console.log(message);

    let imageUpload;
    if (req.file) {
      imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "profileImages",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
    }

    const company = await Company.findById(_id);

    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Update user profile with new information
    if (req.body.officialEmail) company.officialEmail = req.body.officialEmail;
    if (req.body.website) company.website = req.body.website;
    if (req.body.yourBio) company.yourBio = req.body.yourBio;
    if (req.body.phoneNumber) company.phoneNumber = req.body.phoneNumber;
    if (req.body.officeAddress) company.officeAddress = req.body.officeAddress;
    if (req.body.alternativeEmailAddress)
      company.alternativeEmailAddress = req.body.alternativeEmailAddress;
    if (imageUpload) {
      company.profileImage = {
        url: imageUpload.secure_url,
        publicId: imageUpload.public_id,
      };
    }

    // Save updated user to database
    await company.save();

    // Return success response to client
    res.status(200).json({ message: "Profile updated successfully", company });
  } catch (error) {
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};
export const lawyerProfileUpdate = async (req, res) => {
  try {
    // check if the user is connected to the internet
    await checkInternetConnection();

    const _id = req.query;

    // Check if the request body is empty
    if (
      Object.keys(req.body).length === 0 &&
      req.body.constructor === Object &&
      !req.file
    ) {
      return res.status(400).json({ message: "No fields to update" });
    }

    const validate = validateLawyerProfileUpdate.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    let imageUpload;
    if (req.file) {
      imageUpload = await cloudinary.uploader.upload(req.file.path, {
        folder: "profileImages",
        transformation: [{ width: 500, height: 500, crop: "limit" }],
      });
    }

    const lawyer = await Lawyer.findById(_id);

    if (!lawyer) {
      return res.status(404).json({ message: "Lawyer not found" });
    }

    // Update user profile with new information
    if (req.body.officialEmail) lawyer.officialEmail = req.body.officialEmail;
    if (req.body.scn) lawyer.scn = req.body.scn;
    if (req.body.yourBio) lawyer.yourBio = req.body.yourBio;
    if (req.body.yearOfCall) lawyer.yearOfCall = req.body.yearOfCall;
    if (req.body.phoneNumber) lawyer.phoneNumber = req.body.phoneNumber;
    if (req.body.areasOfPractise)
      lawyer.areasOfPractise = req.body.areasOfPractise;
    if (req.body.alternativeEmailAddress)
      lawyer.alternativeEmailAddress = req.body.alternativeEmailAddress;
    if (imageUpload) {
      lawyer.profileImage = {
        url: imageUpload.secure_url,
        publicId: imageUpload.public_id,
      };
    }
    // Save updated user to database
    await lawyer.save();

    // Return success response to client
    res.status(200).json({ message: "Profile updated successfully", lawyer });
  } catch (error) {
    console.log(error);
    if (error.message === "No internet connection") {
      return res.status(503).json({
        status: "fail",
        message: "No internet connection",
      });
    }
    res.status(500).json({ message: "Error updating profile" });
  }
};
