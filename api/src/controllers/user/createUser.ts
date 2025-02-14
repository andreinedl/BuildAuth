import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';
import { hashSync } from 'bcrypt';

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(
            req.body
        )
        const username = req.body.username
        const email = req.body.email
        const password = req.body.password
        const firstName = req.body.firstName
        const lastName = req.body.lastName
        let allowed = req.body.allowed
        let admin = req.body.admin

        if (!username || !password || !firstName || !lastName || !email) {
            res.status(400).json({
                message: 'Missing required fields, required fields are: username, email, password, firstName, lastName, allowed, admin'
            })
            return;
        }

        const hashedPassword = await hashSync(password, 10) // 10 = salt number // https://escape.tech/blog/how-to-secure-express-js-api/
        if(admin === undefined || admin === false) {
            admin = false
        } else {
            admin = true
        }

        if(allowed === undefined || allowed === false) {
            allowed = false
        } else {
            allowed = true
        }
       
        // create user in DB
        const user = User.build({
            username,
            email,
            password: `${hashedPassword}`,
            firstName,
            lastName,
            allowed,
            admin
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