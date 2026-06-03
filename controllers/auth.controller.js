import bcrypt, { genSaltSync } from "bcrypt";
import { prisma } from "../db.js";
import jwt from "jsonwebtoken";
import { json } from "express";


export const register = async (req, res) => {
    console.log("Executing register v2 with name field");
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.json({ message: "All fields are required" });
        }

        const hashedPassword = bcrypt.hashSync(
            password,
            bcrypt.genSaltSync(10)
        );

        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "30d" }
        );

        console.log("Register is working good");

        res.cookie("token", token, {
            httpOnly: true,
            secure: false, // true in production
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        });
        res.json({
            message: "User created successfully",
            token,
            user: { username: user.username }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ message: error.message });
    }
};


export const login = async (req, res) => {
    try {
        const { username, password } = req.body
        if (!email || !password) {
            res.json({ message: "pls enter username and password" })
        }

        const user = await prisma.user.findUnique({
            where: {
                email: email

            }
        })

        if (!bcrypt.compare(password, user.hashedPassword)) {
            res.json({ message: 'incorrect password' })
        }

        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        )

        console.log('login is working good')

        res.cookie = ("token", token, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 30 * 24 * 60 * 60 * 1000
        })
    } catch (err) {
        res.json({ message:err.message })
    }


}
