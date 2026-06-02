import jwt from "jsonwebtoken";
import { prisma } from "../../db.js";


export const verifyToken = async (req, res, next) => {
    try {
        let token = req.cookies.token;

        // Fallback to Authorization header if cookie is missing
        if (!token && req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
        }

        if (!token) {
            return res.status(401).json({ message: "Unauthorized: No token provided" });
        }
        

        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        const user = await prisma.user.findUnique({
            where:{
                id: decoded.userId
            }
        })
        req.user = user
        req.userId = user.id
        
        next()

    
    }
    catch(err){
        console.log("err",err)
    }
}