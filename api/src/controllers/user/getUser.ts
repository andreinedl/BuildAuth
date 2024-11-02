import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';

export async function getUserInfo(req: Request, res: Response, next: NextFunction) {
    console.log(req.body)
    const username = req.body.username    
    if(!username) {
        const users = await User.findAll()
        res.json(users)
        return;
    }

    const user = await User.findOne({where: { username: username }})

    if(user === null) {
        res.status(404).json({ 
            message: 'User not found'
        })
    } else {
        await User.findOne({where: { username: username }}).then((user) => {
            res.json({
                firstName: user?.getDataValue('firstName'),
                lastName: user?.getDataValue('lastName'),
                lastAccess: user?.getDataValue('lastAccess'),
                allowed: user?.getDataValue('allowed'),
                admin: user?.getDataValue('admin')
            })
        })
    }
}