import jwt from 'jsonwebtoken';
import { adminLogin, companyLogin, lawyerLogin } from './authcontrollers.js';
import { getOneAdmin, getOneCompany, getOneLawyer } from './usersControllers.js';

export const authenticateUser = async (req, res, next) => {
    try {
      // Get the token from the request cookies
      const token = req.cookies.jwt;

      if (!token) {
        // Unauthorized if no token is provided
        return res.status(401).json({ message: 'Unauthorized' });
      }
  
      // Verify the token
      const decoded = jwt.verify(token, jwtsecret);
  
      // Set user data in the request object for use in route handlers
      req.userId = decoded.id;
      req.userType = decoded.userType;
  
      // Proceed to the next middleware or route handler
      next();
    } catch (error) {
      // Invalid or expired token
      res.status(401).json({ message: 'Unauthorized' });
    }
  };
  export const authorizeUser = (userTypes) => {
    return (req, res, next) => {
      if (!userTypes.includes(req.userType)) {
        // Forbidden if user is not allowed
        return res.status(403).json({ message: 'Forbidden' });
      }
  
      // Proceed to the next middleware or route handler
      next();
    };
  }

  //   try {
  //     const { token } = req.body;
  //     const { userType } = req.params;

  //      // Determine the user model based on the userType parameter
  //      switch (userType) {
  //       case 'admin':
  //         userModel = Admin;
  //         break;
  //       case 'company':
  //         userModel = Company;
  //         break;
  //       case 'lawyer':
  //         userModel = Lawyer;
  //         break;
  //       default:
  //         return res.status(400).json({ message: 'Invalid user type' });
  //     }
      
  //       const user = await userModel.findOne({ passwordresetToken });

  //       if (!user) {
  //         return res.status(404).json({ message: `${userType} account not found` });
  //       }
  
  //       if (!token || user.passwordResetToken !== token) {
  //         // Unauthorized if no token is provided or if it doesn't match what's saved in the database
  //         return res.status(401).json({ message: 'Unauthorized' });
  //       }
  
  //     // Set user data in the request object for use in route handlers
  //     req.userId = decoded.id;
  //     req.userType = decoded.userType;
  
  //     next();
  //   } catch (error) {
  //     // Invalid or expired token
  //     res.status(401).json({ message: 'Unauthorized' });
  //   }
  // }

  // Create a custom middleware to route requests based on user type
export const routeBasedOnUserType = (req, res, next) => {
  const {userType} = req.params;


  if (!userType || !['company', 'admin', 'lawyer'].includes(userType)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid user type',
    });
  }


  // Based on the user type, route the request to the appropriate login function
  switch (userType) {
    case 'company':
      return companyLogin(req, res, next);
    case 'admin':
      return adminLogin(req, res, next);
    case 'lawyer':
      return lawyerLogin(req, res, next);
    default:
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid user type',
      });
  }
};

export const profileBasedOnUserType = (req, res, next) => {
  const {userType} = req.params;

  if (!userType || !['company', 'admin', 'lawyer'].includes(userType)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid user type',
    });
  }

  // Based on the user type, route the request to the appropriate login function
  switch (userType) {
    case 'company':
      return getOneCompany(req, res, next);
    case 'admin':
      return getOneAdmin(req, res, next);
    case 'lawyer':
      return getOneLawyer(req, res, next);
    default:
      return res.status(400).json({
        status: 'fail',
        message: 'Invalid user type',
      });
  }
};

 