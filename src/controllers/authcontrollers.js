import {Company} from '../models/companymodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import {Admin } from '../models/adminmodel.js';
import { AdminLogin, adminRegister, CompanyLogin, companyRegister, LawyerLogin, lawyerRegister, options } from '../utils/validator.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
import sendEmail from '../utils/email.js';

dotenv.config({ path: "./configenv.env" });

 // Generates a JSON Web Token (JWT) for a user.
const jwtsecret = process.env.JWT_SECRET;
const generateToken = (id, userType) => {
  return jwt.sign({ id, userType }, jwtsecret, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
}

  export default generateToken;
const passwordMatch = (password, passwordConfirm) => {
    return password === passwordConfirm;
} 

// Function to send confirmation email
async function sendConfirmationEmail(userEmail, token) {
  try {
    const confirmationUrl = `http://localhost:5005/useremail/confirm/${token}`;
    const currentUrl = "http://localhost:5005/"; //user/verify

    await sendEmail({
      email: userEmail,
      subject: 'Verify Email Address',
      message: `Click this link to confirm your email: ${confirmationUrl}`,
      html: `
        <p>Verify your email to complete your signup and login into your account</p>
        <p>This link <b>expires in 6 hours</b>.</p>
        <p>Press <a href="${currentUrl}useremail/confirm/${token}">here</a> to proceed.</p>
      `,
    });

    // Return true to indicate that the email was successfully sent
    return true;
  } catch (error) {
    console.error('Email sending error:', error);

    // Return false to indicate that there was an error sending the email
    return false;
  }
}

export const adminSignup = async (req, res) => {
  try {
    // Validate admin inputs
    const validate = adminRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Check if admin exists
    const existingAdmin = await Admin.findOne({ officialEmail: req.body.officialEmail });
    if (existingAdmin) {
      const message = 'User with that email already exists';
      return res.status(409).json({
        status: 'fail',
        message,
      });
    } else {
      // Check if password and passwordConfirm are the same
      const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
      if (!passwordCheck) {
        return res.status(400).json({
          status: 'fail',
          message: 'Passwords do not match',
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
      const userType = 'admin';
      const token = generateToken(_id, userType);

      // Send the Confirmation Email to Admin
      const emailSent = await sendConfirmationEmail(
       newAdmin.officialEmail, 
       token,
      );

      if (emailSent) {
        res.status(201).json({
          status: 'success',
          message: 'Confirmation email sent successfully',
          data: {
            admin: newAdmin,
          },
        });
      } else {
        // Handle email sending error
        res.status(500).json({
          status: 'failure',
          message: 'Confirmation email not sent. Visit Contact center for Help',
        });
      }
    }
  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: 'Internal server error',
      error: error.message,
    });
  }
};
export const adminLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    // Validate admin inputs
    const validate = AdminLogin.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Check if admin exists
    const admin = await Admin.findOne({ officialEmail });
    if (!admin) {
      return res.status(404).json({  // 404 Not Found status code indicates that the resource (admin) was not found.
        status: 'fail',
        message: 'You are not an admin',
      });
    }

    // Check if the admin's email is confirmed
    if (!admin.isEmailConfirmed) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please confirm your email address to log in.',
      });
    }

    // Generate token and set a cookie with the token to be sent to the client and kept for 30 days
    const { _id } = admin;
    const token = generateToken(_id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    // Check if the password is correct and log in the admin
    const passwordCheck = await bcrypt.compare(password, admin?.password || "");
    if (passwordCheck) {
      return res.status(200).json({  // 200 OK status code indicates a successful request.
        status: 'success',
        data: { admin },
      });
    }
    
    return res.status(401).json({  // 401 Unauthorized status code indicates that the request lacks valid authentication credentials.
      status: 'fail',
      message: 'Invalid email/password',
    });
  } catch (error) {
    res.status(500).json({  // 500 Internal Server Error status code indicates a server-side error.
      status: 'fail',
      message: error.message,
    });
  }
};

export const companySignup = async (req, res) => {
  try {
    // Validate company inputs
    const validate = companyRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message,
      });
    }

    // Check if company exists
    const existingCompany = await Company.findOne({ officialEmail: req.body.officialEmail });
    if (existingCompany) {
      return res.status(409).json({  // 409 Conflict status code indicates that the resource (company) already exists.
        status: 'fail',
        message: 'Company with that email already exists',
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
    if (!passwordCheck) {
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message: 'Passwords do not match',
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
    const userType = 'company';
    const token = generateToken(_id, userType);

        // Send the Confirmation Email to Company
       const emailSent = await sendConfirmationEmail(newCompany.officialEmail, token);
 
       if (emailSent) {
         res.status(201).json({
          status: 'success',
          message: 'Confirmation email sent successfully',
          data: {
            company: newCompany,
          },
         });
       } else {
         // Handle email sending error
         res.status(500).json({
           status: 'failure',
           message: 'Confirmation email not sent. Visit Contact center for Help',
         });
       }
  } catch (error) {
    res.status(500).json({  // 500 Internal Server Error status code indicates a server-side error.
      status: 'fail',
      message: error.message,
    });
  }
};

export const companyLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    // Validate company inputs
    const validate = CompanyLogin.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message,
      });
    }

    // Check if company exists
    const company = await Company.findOne({ officialEmail });
    if (!company) {
      return res.status(404).json({  // 404 Not Found status code indicates that the company doesn't exist.
        status: 'fail',
        message: 'You are not a registered company here',
      });
    }

    // Check if the company's email is confirmed
    if (!company.isEmailConfirmed) {
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message: 'Please confirm your email address to log in.',
      });
    }

    // Generate token and set cookie with token to be sent to the client and kept for 30 days
    const { _id } = company;
    const token = generateToken(_id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    // Check if password is correct and log in company
    const passwordCheck = await bcrypt.compare(password, company?.password || "");
    if (passwordCheck) {
      return res.status(200).json({  // 200 OK status code indicates a successful login.
        status: 'success',
        data: { company },
      });
    }

    return res.status(401).json({  // 401 Unauthorized status code indicates an authentication failure.
      status: 'fail',
      message: 'Invalid email/password',
    });

  } catch (error) {
    res.status(500).json({  // 500 Internal Server Error status code indicates a server-side error.
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

export const lawyerSignup = async (req, res) => {
  try {
    // Validate lawyer inputs
    const validate = lawyerRegister.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message,
      });
    }

    // Check if lawyer exists
    const existingLawyer = await Lawyer.findOne({ officialEmail: req.body.officialEmail });
    if (existingLawyer) {
      return res.status(409).json({  // 409 Conflict status code indicates a conflict with an existing resource (lawyer).
        status: 'fail',
        message: 'Lawyer with that email already exists',
      });
    }

    // Check if password and passwordConfirm are the same
    const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
    if (!passwordCheck) {
      return res.status(400).json({  // 400 Bad Request status code indicates a client-side validation error.
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    // Hash password and create new lawyer
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const newLawyer = new Lawyer({
      name: req.body.name,
      officialEmail: req.body.officialEmail,
      phoneNumber: req.body.phoneNumber,
      password: hashedPassword,
      areasOfPractise: req.body.areasOfPractise,
      scn: req.body.scn,
    });

    await newLawyer.save();
    const { _id } = newLawyer;
    const userType = 'lawyer';
    const token = generateToken(_id, userType);

    // Send the Confirmation Email to Lawyer
        const emailSent = await sendConfirmationEmail(newLawyer.officialEmail, token);
 
        if (emailSent) {
          res.status(201).json({
           status: 'success',
           message: 'Confirmation email sent successfully',
           data: {
             company: newLawyer,
           },
          });
        } else {
          // Handle email sending error
          res.status(500).json({
            status: 'failure',
            message: 'Confirmation email not sent. Visit Contact center for Help',
          });
        }
  } catch (error) {
    return res.status(500).json({  // 500 Internal Server Error status code indicates a server-side error.
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

export const lawyerLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;

    // Validate lawyer inputs
    const validate = LawyerLogin.validate(req.body, options);
    if (validate.error) {
      const message = validate.error.details.map((detail) => detail.message).join(',');
      return res.status(400).json({
        status: 'fail',
        message,
      });
    }

    // Check if lawyer exists
    const lawyer = await Lawyer.findOne({ officialEmail });

    if (!lawyer) {
      return res.status(401).json({  // Use 401 Unauthorized for invalid login credentials.
        status: 'fail',
        message: 'You are not a registered lawyer here',
      });
    }

    // Check if the lawyer's email is confirmed
    if (!lawyer.isEmailConfirmed) {
      return res.status(403).json({  // Use 403 Forbidden when access is denied.
        status: 'fail',
        message: 'Please confirm your email address to log in.',
      });
    }

    // Generate token and set cookie with token to be sent to the client and kept for 30 days
    const { _id } = lawyer;
    const token = generateToken(_id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

    // Check if password is correct and log in lawyer
    const passwordCheck = await bcrypt.compare(password, lawyer.password || '');

    if (passwordCheck) {
      return res.status(200).json({  // Use 200 OK for a successful login.
        status: 'success',
        data: { lawyer },
      });
    }

    return res.status(401).json({  // Use 401 Unauthorized for invalid login credentials.
      status: 'fail',
      message: 'Invalid email/password',
    });
  } catch (error) {
    return res.status(500).json({  // Use 500 Internal Server Error for server-side errors.
      status: 'fail',
      message: 'Internal server error',
    });
  }
};

export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

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

    // Mark the user's email as confirmed
    user.isEmailConfirmed = true;
    await user.save();

    // Optionally, you can redirect the user to a login page or show a confirmation success message.
    res.status(200).send('Email confirmed successfully. You can now log in.');
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(400).send('Invalid or expired token.');
  }
};



