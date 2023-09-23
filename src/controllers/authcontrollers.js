import {Company} from '../models/companymodel.js';
import {Lawyer} from '../models/lawyermodel.js';
import {Admin } from '../models/adminmodel.js';
import { AdminLogin, adminRegister, CompanyLogin, companyRegister, LawyerLogin, lawyerRegister, options } from '../utils/validator.js';
import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import dotenv from "dotenv";
import sendEmail from '../utils/email.js';

dotenv.config({ path: "./configenv.env" });

export const getCompanys = async (req, res) => {
  try{
      const _id = "650b1c8f90c70c282222cacd"
      const admin = await Admin.find({_id});
      res.status(200).json({admin})
  }
  catch(err){res.status(500).json({error :  err.message})}
   }

 // Generates a JSON Web Token (JWT) for a user.
const jwtsecret = process.env.JWT_SECRET;
const generateToken = (id) => {
    return jwt.sign({ id }, jwtsecret, {
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
    const confirmationUrl = `http://useremail/confirm/${token}`; //user/verify

    await sendEmail({
      email: userEmail,
      subject: 'Verify Email Address',
      message: `Click this link to confirm your email: ${confirmationUrl}`,
      html: `<p>Verify your email to complete your signup and login into your account</p><p>This link <b> expires in 6 hours </b>.</p> <p>Press <a href=${confirmationUrl}></p>`
    });
  } catch (error) {
    console.error('Email sending error:', error);
    res.status(500).json({ Error: "Internal server error" });
    // Handle the error (e.g., log it, return an error response, etc.)
  }
}
  
export const adminSignup = async (req, res) => {
    try {
      // Validate admin inputs
        const validate = adminRegister.validate(req.body, options)
        if (validate.error) {
            const message = validate.error.details.map((detail) => detail.message).join(',');
                return res.send({
                    status: 'fail',
                    message,
                })
          }
      // Check if admin exists
        const existingAdmin = await Admin.findOne({ officialEmail: req.body.officialEmail });
          if (existingAdmin) {
                const message = 'User with that email already exists';
                  return res.send({
                      status: 'fail',
                      message,
                  })
          } else {

        // Check if password and passwordConfirm are the same
            const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
              if (!passwordCheck) {
               return res.send({
                  status: 'fail',
                message: 'Passwords do not match',
              })
            }
            // Hash password and create new admin
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
            const newAdmin = new Admin({
                name: req.body.name,
                officialEmail: req.body.officialEmail,
                phoneNumber: req.body.phoneNumber,
                password: hashedPassword,
            });
            // Save new admin to database and generate token for admin
            await newAdmin.save();
            const { _id } = newAdmin;
            const token = generateToken(_id);

            await sendConfirmationEmail(newAdmin.officialEmail, token);

            res.status(201).json({
                status: 'success',
                data: {
                    admin: newAdmin,
                },
            });
        } 
    }
    catch (error) {
            res.status(400).json({
                status: 'fail',
                message: error.message,
            });
    }   
}
export const adminLogin = async (req, res) => {
    try {
      const { officialEmail, password } = req.body;

      // Validate admin inputs
      const validate = AdminLogin.validate(req.body, options)
      if (validate.error) {
        const message = validate.error.details.map((detail) => detail.message).join(',');
            return res.send({
                status: 'fail',
                message,
            })
      }

      // Check if admin exists
      const admin = await Admin.findOne({ officialEmail });
      if (!admin) {
        return res.send({
            status: 'fail',
            message: 'You are not an admin',
        })
      } else {
        const { _id } = admin;

        // Generate token and set cookie with token to be sent to the client and kept for 30 days
        const token = generateToken(_id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });

        // Check if password is correct and login admin
        const passwordCheck = await bcrypt.compare(password, admin?.password || "");
        // const validUser = await bcrypt.compare(password, user?.password || "");

        if (passwordCheck) {
          return res.send({
            status: 'success',
            data: { admin },
        })
        }
        return res.send({
          status: 'fail',
          message: 'Invalid email/password',
        })
    }
    } catch (error) {
      res.status(500).json({ Error: "Internal server error" });
    }
  };

export const companySignup = async (req, res) => {
    try {
       // Validate company inputs
       const validate = companyRegister.validate(req.body, options)
       if (validate.error) {
           const message = validate.error.details.map((detail) => detail.message).join(',');
               return res.send({
                   status: 'fail',
                   message,
               })
         }
     // Check if company exists
       const existingCompany = await Company.findOne({ officialEmail: req.body.officialEmail });
         if (existingCompany) {
               const message = 'Company with that email already exists';
                 return res.send({
                     status: 'fail',
                     message,
                 })
         } else {

       // Check if password and passwordConfirm are the same
           const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
             if (!passwordCheck) {
              return res.send({
                 status: 'fail',
               message: 'Passwords do not match',
             })
           }
           // Hash password and create new admin
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
        const token = generateToken(_id);

        await sendConfirmationEmail(newCompany.officialEmail, token);

        res.status(201).json({
        status: 'success',
        data: {
            company: newCompany,
        },
        });
    }
   } catch (error) {
        res.status(400).json({
        status: 'fail',
        message: error.message,
        });
    }   
}
export const companyLogin = async (req, res) => {
    try {
        const { officialEmail, password } = req.body;
        // Validate company inputs
          const validate = CompanyLogin.validate(req.body, options)
            if (validate.error) {
              const message = validate.error.details.map((detail) => detail.message).join(',');
                  return res.send({
                      status: 'fail',
                      message,
                  })
          }

        // Check if company exists
        const company = await Company.findOne({ officialEmail });
            if (!company) {
              return res.send({
                  status: 'fail',
                  message: 'You are not a registered company here',
              })
          } else {
              const { _id } = company;
            // Generate token and set cookie with token to be sent to the client and kept for 30 days
            const token = generateToken(_id);
            res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
            // Check if password is correct and login admin
            const passwordCheck = await bcrypt.compare(password, company?.password || "");
            if (passwordCheck) {
              return res.send({
                status: 'success',
                data: { company },
            })
            }
            return res.send({
              status: 'fail',
              message: 'Invalid email/password',
            })
          }
    } catch (error) {
        res.status(500).json({ Error: "Internal server error" });
      }
  };

  export const lawyerSignup = async (req, res) => {
    try {
       // Validate company inputs
       const validate = lawyerRegister.validate(req.body, options)
       if (validate.error) {
           const message = validate.error.details.map((detail) => detail.message).join(',');
               return res.send({
                   status: 'fail',
                   message,
               })
         }
     // Check if company exists
       const existingLawyer = await Lawyer.findOne({ officialEmail: req.body.officialEmail });
         if (existingLawyer) {
               const message = 'Lawyer with that email already exists';
                 return res.send({
                     status: 'fail',
                     message,
                 })
         } else {
       // Check if password and passwordConfirm are the same
           const passwordCheck = passwordMatch(req.body.password, req.body.passwordConfirm);
             if (!passwordCheck) {
              return res.send({
                 status: 'fail',
               message: 'Passwords do not match',
             })
           }
           // Hash password and create new admin
       const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const newLawyer = new Lawyer ({
        name: req.body.name,
        officialEmail: req.body.officialEmail,
        phoneNumber: req.body.phoneNumber,
        password: hashedPassword,
        areasOfPractise: req.body.areasOfPractise,
        scn: req.body.scn
        });

        await newLawyer.save();
        const { _id } = newLawyer;
        const token = generateToken(_id);

        await sendConfirmationEmail(newLawyer.officialEmail, token);

        res.status(201).json({
        status: 'success',
        data: {
            lawyer: newLawyer,
        },
        });
    } 
  } catch (error) {
        res.status(400).json({
        status: 'fail',
        message: error.message,
        });
    }   
}
export const lawyerLogin = async (req, res) => {
  try {
    const { officialEmail, password } = req.body;
    // Validate lawyer inputs
      const validate = LawyerLogin.validate(req.body, options)
        if (validate.error) {
          const message = validate.error.details.map((detail) => detail.message).join(',');
              return res.send({
                  status: 'fail',
                  message,
              })
      }

    // Check if lawyer exists
    const lawyer = await Lawyer.findOne({ officialEmail });
        if (!lawyer) {
          return res.send({
              status: 'fail',
              message: 'You are not a registered lawyer here',
          })
      } else {
          const { _id } = Lawyer;
        // Generate token and set cookie with token to be sent to the client and kept for 30 days
        const token = generateToken(_id);
        res.cookie('jwt', token, { httpOnly: true, maxAge: 1000 * 60 * 60 * 24 * 7 });
        // Check if password is correct and login admin
        const passwordCheck = await bcrypt.compare(password, lawyer?.password || "");
        if (passwordCheck) {
          return res.send({
            status: 'success',
            data: { lawyer },
        })
        }
        return res.send({
          status: 'fail',
          message: 'Invalid email/password',
        })
      }
} catch (error) {
    res.status(500).json({ Error: "Internal server error" });
  }
  };


// Handle email confirmation logic
export const confirmEmail = async (req, res) => {
  try {
    const { token } = req.params;

    // Verify the token
    const decoded = jwt.verify(token, jwtsecret);

    // Find the user by their ID (decoded from the token)
    const lawyer = await Lawyer.findById(decoded._id);

    if (!lawyer) {
      return res.status(404).send('User not found.');
    }

    // Mark the user's email as confirmed
    lawyer.isEmailConfirmed = true;
    await lawyer.save();

    // Optionally, you can redirect the user to a login page or show a confirmation success message.
    res.send('Email confirmed successfully. You can now log in.');
  } catch (error) {
    console.error('Email confirmation error:', error);
    res.status(400).send('Invalid or expired token.');
  }
};
