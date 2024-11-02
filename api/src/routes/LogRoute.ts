import express, { Router } from 'express';

//import controllers
import { createLog } from '../controllers/logs/createLog';
import { getLogs } from '../controllers/logs/getLogs';

//define router
const router = Router();

//define routes
router.post('/create', createLog);
router.get('/', getLogs);

//export router
export let logRouter = router;
