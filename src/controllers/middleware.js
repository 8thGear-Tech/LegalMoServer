import jwt from 'jsonwebtoken';
import { adminLogin, companyLogin, lawyerLogin } from './authcontrollers.js';
import { getOneAdmin, getOneCompany, getOneLawyer, adminProfileUpdate, companyProfileUpdate, lawyerProfileUpdate } from './usersControllers.js';

const jwtsecret = process.env.JWT_SECRET;
export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;
    console.log("Token:", token);
    
    if (!token) {
      console.log("No Token");
      return res.status(401).json({ message: 'Unidentified user' });
    }

    const decoded = jwt.verify(token, jwtsecret);
    console.log("Decoded Token:", decoded);
    
    req.userId = decoded.id;
    req.userType = decoded.userType;

    next();
  } catch (error) {
    console.error("Authentication Error:", error);
    res.status(401).json({ message: 'You are not authorized' });
  }
};
export const isAdminUser = (req, res, next) => {
  const {userType} = req.query;
  // Check if the user is an admin based on their userType
  if (userType === 'admin') {
    // User is an admin, allow access to the endpoint
    next();
  } else {
    // User is not an admin, respond with an unauthorized status code
    res.status(403).json({ message: 'Access denied. Admin permissions required.' });
  }
};
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

export const usersLogin = async (req, res, next) => {
  try {
    

    const { officialEmail, password } = req.body;

    if (!officialEmail || !password) {
      return res.status(400).json({
        status: 'fail',
        message: 'Please provide officialEmail and password.',
      });
    }

    // Attempt to log in for each user type
    const userTypes = ['admin', 'company', 'lawyer'];
    for (const userType of userTypes) {
      const loginFunction = getLoginFunctionByUserType(userType);

      if (loginFunction) {
        const loginResult = await loginFunction(officialEmail, password);

        if (loginResult.success) {
          // If login was successful, return a success response
          // Set the token in the response headers
          res.setHeader('Authorization', `Bearer ${loginResult.data.token}`);
          return res.status(200).json({
            status: 'success',
            data: loginResult.data,
          });
        } else {
          return res.status(loginResult.status).json({
            status: 'fail',
            message: loginResult.message,
          });
        } 
      }
    }

    // If none of the user types match, return an error response
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid email/password',
    });

  } catch (error) {
    res.status(500).json({
      status: 'fail',
      message: error.message,
    });
  }
};
const getLoginFunctionByUserType = (userType) => {
  switch (userType) {
    case 'company':
      return companyLogin;
    case 'admin':
      return adminLogin;
    case 'lawyer':
      return lawyerLogin;
    default:
      return null;
  }
}

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
export const updateProfileBasedOnUser = async (req, res, next) => {
  
  const { userType } = req.params; 

  if (!userType || !['company', 'admin', 'lawyer'].includes(userType)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid user type',
    });
  }
    // Based on the user type, route the request to the appropriate update function
switch (userType) {
  case 'admin':
    return adminProfileUpdate(req, res, next);
  case 'company':
    return companyProfileUpdate(req, res, next);
  case 'lawyer':
    return lawyerProfileUpdate(req, res, next);
  default:
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid user type',
    });
}   
} 