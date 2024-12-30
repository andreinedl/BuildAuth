import express, { Request, Response, NextFunction} from 'express';
import { database } from "../../database/db";
import { Movement } from '../../database/models/Movement';

export async function getLogs(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body)

        const logs = await Movement.findAll()
        res.json(logs)        

    } catch (error) {
        next(error)
    }
}