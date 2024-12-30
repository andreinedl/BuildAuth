import express, { Request, Response, NextFunction} from 'express';
import { database } from "../../database/db";
import { Movement } from '../../database/models/Movement';

export async function createMovement(req: Request, res: Response, next: NextFunction) {
    try {
        const message = req.body.message

        if (!message) {
            res.status(400).json({
                message: 'Missing required fields, required fields is message'
            })
            return;
        }
       
        const movement = Movement.build({
            message
        });

        // https://sequelize.org/docs/v6/core-concepts/model-querying-finders/
        await movement.save().then(() => {
            res.status(201).send('Movement created')
        }).catch((error) => {
            res.status(500).send(error)
        })
    } catch (error) {
        next(error)
    }
}