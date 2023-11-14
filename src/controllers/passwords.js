import {Company} from '../models/companymodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import {Admin } from '../models/adminmodel.js';
import { ValidateResetPassword, options, ValidateforgotPassword } from '../utils/validator.js';
import { sendEmail } from '../utils/email.js';
import bcrypt from 'bcryptjs'


export const getAdmin = async (query) => {
  return await Admin.findOne(query);
};
export const getCompany = async (query) => {
  return await Company.findOne(query);
};
export const getLawyer = async (query) => {
  return await Lawyer.findOne(query);
};

function passwordResetToken() {
    const min = 100000; // Minimum 6-digit number
    const max = 999999; // Maximum 6-digit number
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
const passwordMatch = (password, passwordConfirm) => {
    return password === passwordConfirm;
} 
async function sendResetPasswordEmail(userEmail, token, name) {
    try {
  
      await sendEmail({
        email: userEmail,
        subject: 'Reset Password',
        html: `
          <h1>Hello ${name}</h1>
          <p>Need to reset your password? Use OTP</p>
          <p><strong>${token}</strong></p>
          <p>Click on the button below and enter the OTP above</p>
          <button>google.com</button>
          <p>If you did not forget your passwrd, you can ignore this email.</p>
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

export const forgotPassword = async (req, res) => {
    try {
      const { officialEmail } = req.body;
      
      const admin = await getAdmin({ officialEmail });
      const company = await getCompany({ officialEmail });
      const lawyer = await getLawyer({ officialEmail });
       
      let user;
      let userType;
  
      if (company) {
        user = company;
        userType = 'company';
      } else if (admin) {
        user = admin;
        userType = 'admin';
      } else if (lawyer) {
        user = lawyer;
        userType = 'lawyer';
      } else {
        return res.status(400).json({  
          status: 'fail',
          message: 'Invalid email',
        });
      }

      const validate = ValidateforgotPassword.validate(req.body, options);
      if (validate.error) {
        const message = validate.error.details.map((detail) => detail.message).join(',');
        return res.status(400).json({
          status: 'fail',
          message,
        });
      }
  
      // Generate a password reset token
      const token = passwordResetToken();
      const expires = new Date(Date.now() + 600000); // Token expires in 10 minutes
  
      // Find the user and update the token and expiration date in parallel
      const updatedUser = await userModel.findOneAndUpdate(
        { officialEmail },
        { passwordToken: token, resetPasswordExpires: expires },
        { new: true }
      ).exec();
  
      if (!updatedUser) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Send the password reset email
      const sendEmailPromise = sendResetPasswordEmail(officialEmail, token, updatedUser.name);
  
      // Wait for both promises to resolve
      await Promise.all([sendEmailPromise]);
  
      res.status(200).json({ message: 'Password reset email sent' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
export const resetPasswordToken = async (req, res) => {
    try {
      const { token } = req.body;
  
      // Define an array of user models for different types
      const userModels = [Admin, Company, Lawyer];
  
      let validToken = false;
      let userType = '';
      let validUser = null;
  
      // Loop through user models to find a valid token and determine the user type
      for (const userModel of userModels) {
        const user = await userModel.findOne({
          passwordToken: token,
          resetPasswordExpires: { $gt: new Date() },
        });
  
        if (user) {
          validToken = true;
          userType = userModel.modelName.toLowerCase();
          validUser = user; 
          break; 
        }
      }
  
      if (!validToken || validUser.passwordToken !== token) {
        return res.status(400).json({ message: 'Invalid or expired token' });
      }
      const userEmail = validUser.officialEmail
      // Include the token in the reset password URL query
      const newPasswordUrl = `http://localhost:5005/api/reset-password?userType=${userType}&userEmail=${userEmail}&token=${token}`;
      
      res.status(200).json(
        { 
          message: `Token is valid for ${userType}. Follow ${newPasswordUrl} to create your new password` 
        });
        
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    }
};
export const resetPassword = async (req, res) => {
  try {
    const { token, userType } = req.query;
    const officialEmail = req.query.userEmail;

    // Check if the userType is valid (e.g., admin, lawyer, company)
    if (userType !== 'admin' && userType !== 'lawyer' && userType !== 'company') {
      return res.status(400).json({ message: 'Invalid user type' });
    }

    // Depending on the user type, choose the appropriate user model
    let userModel;
    switch (userType) {
      case 'admin':
        userModel = Admin;
        break;
      case 'lawyer':
        userModel = Lawyer;
        break;
      case 'company':
        userModel = Company;
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    // Find the user based on the officialEmail
    const user = await userModel.findOne({ officialEmail });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if there is a valid token and it's not expired
    if (!user.passwordToken || user.resetPasswordExpires <= new Date()) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Check if the token in the query parameter matches the one in the database
    if (user.passwordToken !== token) {
      return res.status(400).json({ message: 'Invalid token' });
    }

    // Update the user's password
    const { password, passwordConfirm } = req.body;
    const passwordCheck = passwordMatch(password, passwordConfirm);

    if (!passwordCheck) {
      return res.status(400).json({
        status: 'fail',
        message: 'Passwords do not match',
      });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;

    user.passwordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.status(200).json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

