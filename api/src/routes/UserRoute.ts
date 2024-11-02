import express, { Router } from 'express';

//import controllers
import { createUser } from '../controllers/user/createUser';
import { deleteUser } from '../controllers/user/deleteUser';
import { getUserInfo } from '../controllers/user/getUserInfo';

//define router
const router = Router();

//define routes
router.post('/create', createUser);
router.post('/delete', deleteUser);
router.get('/info', getUserInfo);

//export router
export let userRouter = router;
