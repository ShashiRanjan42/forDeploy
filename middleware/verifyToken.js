import jwt from "jsonwebtoken";

export const verifyToken = async (req,res, next) => {
    const token = req.cookies.token;
    
    if(!token) {
        return res.status(401).json({
            message: "Not Authenticated!"
        })
    }
    
    jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, payload) => {    // payload koi v variable ka nam hai like jb data ho
        if (err) {
            return res.status(403).json({ 
                message: "Token is not Valid!" 
            });
        }
    
        req.userId = payload.id;

        next();
    } )
}