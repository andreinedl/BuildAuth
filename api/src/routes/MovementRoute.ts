import express, { Router } from 'express';

//import controllers
import { createMovement } from '../controllers/movements/createMovement';
import { getLogs } from '../controllers/logs/getLogs';

//define router
const router = Router();

//define routes
router.post('/create', createMovement);
router.get('/', getLogs);

//export router
export let movementRouter = router;
