import express, { Request, Response, NextFunction} from 'express';
import { database } from "../../database/db";
import { Movement } from '../../database/models/Movement';

export async function getMovements(req: Request, res: Response, next: NextFunction) {
    try {
        console.log(req.body)

        const logs = await Movement.findAll()
        console.log(logs)
        res.json(logs)        

    } catch (error) {
        next(error)
    }
}