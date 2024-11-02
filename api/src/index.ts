import express, { Request, Response } from 'express';
import { initDb } from './database/db';
import { router } from '../src/routes/UserRoute';

const app = express()
const port = 3000

initDb();
app.use(express.json())

app.get('/', (req: Request, res: Response) => { 
    res.send('Hello World!')
})

app.use('/users', router)

app.listen(port, () => console.log(`Running on ${port}!`))