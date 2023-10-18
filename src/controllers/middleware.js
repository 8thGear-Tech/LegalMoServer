import jwt from 'jsonwebtoken';
import { adminLogin, companyLogin, lawyerLogin } from './authcontrollers.js';
import { getOneAdmin, getOneCompany, getOneLawyer } from './usersControllers.js';

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

 