import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(
            req.body
        )
        const username = req.body.username
        const password = req.body.password
        const firstName = req.body.firstName
        const lastName = req.body.lastName

        if (!username || !password || !firstName || !lastName) {
            res.status(400).send('Missing required fields')
            return;
        }
       
        // create user in DB
        const user = User.build({
            username,
            password,
            firstName,
            lastName
        });

        // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
        if(await User.findOne({where: { username: username }}) === null) {
            await user.save().then(() => {
                res.status(201).send('User created')
            }).catch((error) => {
                res.status(500).send(error)
            })
        } else {
            res.status(409).send('User already exists')
        }

       //res.status(404).send('Not implemented')
        
    } catch (error) {
        next(error)
    }
}