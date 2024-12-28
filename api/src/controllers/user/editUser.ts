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

        if(email == undefined) email = user.getDataValue('email');
        if(firstName == undefined) firstName = user.getDataValue('firstName');
        if(lastName == undefined) lastName = user.getDataValue('lastName');
        if(allowed == undefined) allowed = user.getDataValue('allowed');
        if(admin == undefined) admin = user.getDataValue('admin');
        if(password == undefined) password = user.getDataValue('password');

        user.update({ email: email, firstName: firstName, lastName: lastName, allowed: allowed, admin: admin, password: hashSync(password, 10) }).then(() => {
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