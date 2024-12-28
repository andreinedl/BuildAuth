import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';
import { hashSync } from 'bcrypt';

export async function editUser(req: Request, res: Response, next: NextFunction) {
    let username = req.body.username
    let email = req.body.email
    let password = req.body.password
    let firstName = req.body.firstName
    let lastName = req.body.lastName
    let allowed = req.body.allowed
    let admin = req.body.admin
    try {
        if(!username) {
            res.status(400).json({
                message: 'Missing username'
            })
            return;
        }

        const user = await User.findOne({where: { username: username }})
        if(user === null) {
            res.status(404).json({ 
                message: 'User not found'
            })
            return;
        }

        const updates: any = {
            email: email ?? user.getDataValue('email'),
            firstName: firstName ?? user.getDataValue('firstName'),
            lastName: lastName ?? user.getDataValue('lastName'),
            allowed: allowed ?? user.getDataValue('allowed'),
            admin: admin ?? user.getDataValue('admin'),
        };

        // Include password only if not undefined
        if (password !== undefined) {
            updates.password = hashSync(password, 10);
        }

        user.update(updates).then(() => {
            res.status(200).json({
                message: 'User updated'
            })
        }).catch((error) => {
            res.status(500).json({
                message: error
            })
        })
    } catch (error) {
        next(error)
    }
}