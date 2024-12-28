import express, { Router } from 'express';

//import controllers
import { createUser } from '../controllers/user/createUser';
import { deleteUser } from '../controllers/user/deleteUser';
import { getUserInfo } from '../controllers/user/getUser';
import { auth } from '../controllers/user/auth';
import { editUser } from '../controllers/user/editUser';

//define router
const router = Router();

//define routes
router.post('/create', createUser);
router.post('/delete', deleteUser);
router.get('/', getUserInfo);
router.post('/auth', auth)
router.post('/edit', editUser)

//export router
export let userRouter = router;
