import express, { Request, Response, NextFunction} from 'express';
import { database } from "../../database/db";
import { Log } from '../../database/models/Log';
import { User } from '../../database/models/User';

export async function createLog(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(
            req.body
        )
        const username = req.body.username
        const message = req.body.message

        if (!username || !message) {
            res.status(400).send('Missing required fields, required fields are: username, message')
            return;
        }
       
        // create log in DB
        const log = Log.build({
            username,
            message
        });

        // add access log to user;
        const user = await User.findOne({where: { username: username }})

        // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
        await log.save().then(() => {
            res.status(201).send('Log created')
            user?.setDataValue('lastAccess', log.getDataValue('timestamp'))
            user?.save()
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch (error) {
        next(error)
    }
}