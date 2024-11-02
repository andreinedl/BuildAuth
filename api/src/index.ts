import express, { Request as req, Response as res } from 'express';
import { tryConnection } from './database/db';

const app = express()
const port = 3000

tryConnection();

app.get('/', (req, res) => { 
    res.send('Hello World!')
})
app.listen(port, () => console.log(`Running on ${port}!`))