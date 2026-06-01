 import bcrypt from "bcrypt";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";
 export async function register() {
    const {username , password , email} = req.body ,
    
   if(!username , !password, !email){
     return res.json({ message: "All fields are required" });
   }

   const hashedpassword = bcrypt.genSalt(password,10)
}