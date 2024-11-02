import express, { Request, Response, NextFunction} from 'express';
import { User } from '../../database/models/User';

export async function deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(
            req.body
        )
        const username = req.body.username
        if(!username) {
            res.status(400).send('Missing required fields: username')
            return;
        }

        //https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
        if(await User.findOne({where: { username: username }}) === null) {
            res.status(409).send('User not found')
        } else {
            await User.destroy({where: { username: username }}).then(() => {
                res.status(200).send('User deleted')
            }).catch((error) => {
                res.status(500).send(error)
            })
        }
        
    } catch (error) {
        next(error)
    }
}