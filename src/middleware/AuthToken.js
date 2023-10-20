import jwt from 'jsonwebtoken'
import dotenv from "dotenv";

dotenv.config({ path: "./configenv.env" });

export const authToken = (req, res, next) => {
    try {
        // Get the token from the request cookies
        const token = req.headers.authorization;
        const jwtsecret = process.env.JWT_SECRET
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
    
    
}