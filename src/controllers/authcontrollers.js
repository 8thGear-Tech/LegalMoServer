import { Company } from "../models/companymodel.js";
import { Lawyer } from "../models/lawyermodel.js";
import { Admin } from "../models/adminmodel.js";
import {
  adminRegister,
  companyRegister,
  lawyerRegister,
  options,
} from "../utils/validator.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
import {
  generateToken,
  emailConfirmationToken,
  passwordMatch,
  sendConfirmationEmail,
} from "../utils/utils.js";

dotenv.config({ path: "./configenv.env" });

export const adminSignup = async (req, res) => {
  try {
    const validate = adminRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingAdmin) {
      const message = "User with that email already exists";
      return res.status(409).json({
        status: "fail",
        message,
      });
    } else {
      // Check if password and passwordConfirm are the same
      const passwordCheck = passwordMatch(
        req.body.password,
        req.body.passwordConfirm
      );
      if (!passwordCheck) {
        return res.status(400).json({
          status: "fail",
          message: "Passwords do not match",
        });
      }

      // Hash password and create new admin
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      const newAdmin = new Admin({
        name: req.body.name,
        officialEmail: req.body.officialEmail,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
      });

      // Save new admin to the database and generate a token for admin
      await newAdmin.save();
      const { _id } = newAdmin;
      const userType = "admin";
      const token = emailConfirmationToken(_id, userType);

      // Send the Confirmation Email to Admin
      const emailSent = await sendConfirmationEmail(
        newAdmin.officialEmail,
        token
      );

      if (emailSent) {
        res.status(201).json({
          status: "success",
          message: "Confirmation email sent successfully",
          data: {
            admin: newAdmin,
          },
        });
      } else {
        // Handle email sending error
        res.status(500).json({
          status: "failure",
          message: "Confirmation email not sent. Visit Contact center for Help",
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
      error: error.message,
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    // handle google SignIn
    if (req.url.startsWith("/auth/google/redirect/admin?code=")) {
      // return res.send(`You have Signed in with Google`);
      const user = req.user;
      // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
      const { _id } = user.id;
      const token = generateToken(_id);

      console.log(token);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        status: "success",
        data: { user },
      });
    }

    const { officialEmail, password } = req.body;

    // Check if admin exists
    const admin = await Admin.findOne({ officialEmail });
    if (!admin) {
      return res.status(404).json({
        status: "fail",
        message: "You are not an admin",
      });
    }

    // Check if the password is correct and log in the admin
    const passwordCheck = await bcrypt.compare(password, admin?.password || "");
    if (passwordCheck) {
      // Check if the admin's email is confirmed
      if (!admin.isEmailConfirmed) {
        return res.status(400).json({
          status: "fail",
          message: "Please confirm your email address to log in.",
        });
      }
      // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
      const { _id } = admin;
      const token = generateToken(_id);

      console.log(token);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        status: "success",
        data: { admin, token },
      });
    }

    return res.status(401).json({
      status: "fail",
      message: "Invalid email/password",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const companySignup = async (req, res) => {
  try {
    // Validate company inputs
    const validate = companyRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if company exists
    const existingCompany = await Company.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingCompany) {
      return res.status(409).json({
        status: "fail",
        message: "Company with that email already exists",
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(
      req.body.password,
      req.body.passwordConfirm
    );
    if (!passwordCheck) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }

    // Hash password and create a new company
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newCompany = new Company({
      companyName: req.body.companyName,
      contactName: req.body.contactName,
      officialEmail: req.body.officialEmail,
      phoneNumber: req.body.phoneNumber,
      officeAddress: req.body.officeAddress,
      cac: req.body.cac,
      industry: req.body.industry,
      password: hashedPassword,
    });

    await newCompany.save();
    const { _id } = newCompany;
    const userType = "company";
    const token = emailConfirmationToken(_id, userType);

    // Send the Confirmation Email to Company
    const emailSent = await sendConfirmationEmail(
      newCompany.officialEmail,
      token
    );

    if (emailSent) {
      res.status(201).json({
        status: "success",
        message: "Confirmation email sent successfully",
        data: {
          company: newCompany,
          youtoken: token,
        },
      });
    } else {
      // Handle email sending error
      res.status(500).json({
        status: "failure",
        message: "Confirmation email not sent. Visit Contact center for Help",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};
export const companyLogin = async (req, res) => {
  try {
    // handle google SignIn
    if (req.url.startsWith("/auth/google/redirect/company?code=")) {
      // return res.send(`You have Signed in with Google`);
      const user = req.user;
      // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
      const { _id } = user.id;
      const token = generateToken(_id);

      console.log(token);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        status: "success",
        data: { user },
      });
    }

    const { officialEmail, password } = req.body;

    // Check if company exists
    const company = await Company.findOne({ officialEmail });
    if (!company) {
      return res.status(404).json({
        // 404 Not Found status code indicates that the company doesn't exist.
        status: "fail",
        message: "You are not a registered company here",
      });
    }

    // Check if password is correct and then if the email is verified. Proceed to login company if both conditions are met
    const passwordCheck = await bcrypt.compare(
      password,
      company?.password || ""
    );
    if (passwordCheck) {
      // Check if the company's email is confirmed
      if (!company.isEmailConfirmed) {
        return res.status(400).json({
          status: "fail",
          message: "Please confirm your email address to log in.",
        });
      }

      // Generate token and set cookie with token to be sent to the client and kept for 30 days
      const { _id } = company;
      const token = generateToken(_id);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });
      console.log(token);

      return res.status(200).json({
        status: "success",
        data: { company, token },
      });
    }

    return res.status(401).json({
      status: "fail",
      message: "Invalid email/password",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
export const lawyerSignup = async (req, res) => {
  try {
    // Validate lawyer inputs
    const validate = lawyerRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details
        .map((detail) => detail.message)
        .join(",");
      return res.status(400).json({
        status: "fail",
        message,
      });
    }

    // Check if lawyer exists
    const existingLawyer = await Lawyer.findOne({
      officialEmail: req.body.officialEmail,
    });
    if (existingLawyer) {
      return res.status(409).json({
        status: "fail",
        message: "Lawyer with that email already exists",
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(
      req.body.password,
      req.body.passwordConfirm
    );
    if (!passwordCheck) {
      return res.status(400).json({
        status: "fail",
        message: "Passwords do not match",
      });
    }
    // Hash password and create new lawyer
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newLawyer = new Lawyer({
      name: req.body.name,
      phoneNumber: req.body.phoneNumber,
      officialEmail: req.body.officialEmail,
      lawFirmName: req.body.lawFirmName,
      lawFirmAddress: req.body.lawFirmAddress,
      scn: req.body.scn,
      cac: req.body.cac,
      lawFirmAddress: req.body.lawFirmAddress,
      lawFirmName: req.body.lawFirmName,
    });

    await newLawyer.save();
    const { _id } = newLawyer;
    const userType = "lawyer";
    const token = emailConfirmationToken(_id, userType);
    // console.log(token, "token expires in" + expiresIn)

    // Send the Confirmation Email to Lawyer
    const emailSent = await sendConfirmationEmail(
      newLawyer.officialEmail,
      token
    );

    if (emailSent) {
      res.status(201).json({
        status: "success",
        message: "Confirmation email sent successfully",
        data: {
          lawyer: newLawyer,
          token,
        },
      });
    } else {
      res.status(500).json({
        status: "failure",
        message: "Confirmation email not sent. Visit Contact center for Help",
      });
    }
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
export const lawyerLogin = async (req, res) => {
  try {
    // handle google SignIn
    if (req.url.startsWith("/auth/google/redirect/lawyer?code=")) {
      // return res.send(`You have Signed in with Google`);
      const user = req.user;
      // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
      const { _id } = user.id;
      const token = generateToken(_id);

      console.log(token);
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 30,
      });

      return res.status(200).json({
        status: "success",
        data: { user },
      });
    }

    const { officialEmail, password } = req.body;

    // Check if lawyer exists
    const lawyer = await Lawyer.findOne({ officialEmail });

    if (!lawyer) {
      return res.status(401).json({
        status: "fail",
        message: "You are not a registered lawyer here",
      });
    }

    // Check if password is correct and log in lawyer
    const passwordCheck = await bcrypt.compare(password, lawyer.password || "");

    if (passwordCheck) {
      // Check if the lawyer's email is confirmed
      if (!lawyer.isEmailConfirmed) {
        return res.status(403).json({
          status: "fail",
          message: "Please confirm your email address to log in.",
        });
      }

      // Generate token and set cookie with token to be sent to the client and kept for 30 days
      const { _id } = lawyer;
      const token = generateToken(_id);
      // console.log(token)
      res.cookie("jwt", token, {
        httpOnly: true,
        maxAge: 1000 * 60 * 60 * 24 * 7,
      });

      return res.status(200).json({
        status: "success",
        data: { lawyer, token },
      });
    }

    return res.status(401).json({
      status: "fail",
      message: "Invalid email/password",
    });
  } catch (error) {
    return res.status(500).json({
      status: "fail",
      message: "Internal server error",
    });
  }
};
