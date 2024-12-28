import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';
import { compareSync } from 'bcrypt';

export async function auth(req: Request, res : Response, next: NextFunction) {
    try {
        const username = req.body.username;
        const password = req.body.password;

        if(!username || !password) {
            res.status(400).json({
                message: "Missing required fields. Required fields are username and password."
            })
            return;
        }

        const user = await User.findOne({ where: { username: username }})
        if(!user) {
            res.status(401).json({
                message: "Invalid credentials."
            })
            return
        }

        // comparesync example from https://github.com/Mister-Hope/bcrypt-ts
        if(compareSync(password, user?.getDataValue('password'))) {
            res.status(200).json({
                message: "Authenticated.",
                userInfo: {
                    username: user?.getDataValue('username'),
                    email: user?.getDataValue('email'),
                    lastAccess: user?.getDataValue('lastAccess'),
                    allowed: user?.getDataValue('allowed'),
                    firstName: user?.getDataValue('firstName'),
                    lastName: user?.getDataValue('lastName'),
                    admin: user.getDataValue('admin')
                }
            })
        } else {
            res.status(401).json({
                message: "Invalid credentials."
            })
        }

    } catch (error) {
        console.error("Authentication error:", error);
        res.status(500).json({
            message: "Internal server error"
        });
    }
}