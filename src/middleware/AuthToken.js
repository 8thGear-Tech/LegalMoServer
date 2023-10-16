import jwt from 'jsonwebtoken'

export const authToken = (req, res, next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({message: "unauthorized access"})
    }
    jwt.verify(token, 'this_is_legalmos_secret_it_aint_leaking', (err, user) => {
        if(err){
            console.log(err)
            return res.status(403).json({ message : 'Forbidden'})
        }

        req.user = user;
        next()
    })
}