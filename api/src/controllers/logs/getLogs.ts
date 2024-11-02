import express, { Request, Response, NextFunction} from 'express';
import { database } from "../../database/db";
import { Log } from '../../database/models/Log';
import { User } from '../../database/models/User';

export async function getLogs(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body)
        const username = req.body.username

        // https://sequelize.org/docs/v6/core-concepts/model-querying-basics/


        //!!! timezone will be returned as UTC
        if(!username) {
            const logs = await Log.findAll()
            res.json(logs)
            return;
        }
        
        const user = await User.findOne({where: { username: username }})
        if(user) {
            const logs = await Log.findAll({ where: { username: user?.getDataValue('username') }})
            res.json(logs)        
        } else {
            res.status(404).json({
                message: 'User not found'
            })
        }

    } catch (error) {
        next(error)
    }
}