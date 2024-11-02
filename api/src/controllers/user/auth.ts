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
        if(!username) {
            res.status(404).json({
                message: "User not found"
            })
            return
        }

        // comparesync example from https://github.com/Mister-Hope/bcrypt-ts
        if(compareSync(password, user?.getDataValue('password')) == true) {
            res.status(200).json({
                message: "Authenticated."
            })
        } else {
            res.status(401).json({
                message: "Invalid credentials."
            })
        }

    } catch (error) {
        next(error)
    }
}