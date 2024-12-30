import express, { NextFunction, Request, Response } from 'express';
import { initDb } from './database/db';
import { userRouter } from '../src/routes/UserRoute';
import { logRouter } from './routes/LogRoute';
import { movementRouter } from './routes/MovementRoute';
import helmet from 'helmet';
import cors from 'cors';
import audit from 'express-requests-logger'

const app = express()
const port = 3000

initDb();

//use cross origin resource sharing
app.use(cors())

//use json for body parsing
app.use(express.json())

//helmet middleware for security
app.use(helmet())

//logs middleware
app.use(audit())

//routes
app.use('/users', userRouter)
app.use('/logs', logRouter)
app.use('/movements', movementRouter)

//handle 404
app.use((req : Request, res : Response, next: NextFunction) => {
    res.status(404).json({
      message: "Not found"
    })
})

//log requests
app.use((req, res, next) => {
  console.log(`${req} \n`);
  next();
});

//handle errors
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(500);
    res.send({
      error: {
        status: 500,
        message: err.message
      }
    });
  });

//server listen
app.listen(port, () => console.log(`Running on ${port}!`))