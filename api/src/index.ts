import express, { NextFunction, Request, Response } from 'express';
import { initDb } from './database/db';
import { userRouter } from '../src/routes/UserRoute';
import { logRouter } from './routes/LogRoute';
import helmet from 'helmet';

const app = express()
const port = 3000

initDb();

//use json for body parsing
app.use(express.json())

//helmet middleware for security
app.use(helmet())

//routes
app.use('/users', userRouter)
app.use('/logs', logRouter)

//handle 404
app.use((req : Request, res : Response, next: NextFunction) => {
    res.status(404).send('Not found')
})

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