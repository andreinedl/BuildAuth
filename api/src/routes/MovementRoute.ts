import express, { Router } from 'express';

//import controllers
import { createMovement } from '../controllers/movements/createMovement';
import { getMovements } from '../controllers/movements/getMovements';

//define router
const router = Router();

//define routes
router.post('/create', createMovement);
router.get('/', getMovements);

//export router
export let movementRouter = router;
