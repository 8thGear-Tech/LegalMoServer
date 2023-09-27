import { Jwt } from "jsonwebtoken";

export const authToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "unauthorized access"})
    }
    jwt.verify(token, 'secret-key', (err, user) => {
        if(err){
            return res.status(403).json({ message : 'Forbidden'})
        }

        req.user = user;
        next()
    })
}