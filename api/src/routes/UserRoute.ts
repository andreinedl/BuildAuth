import express, { Router } from 'express';
import { createUser } from '../controllers/user/createUser';
import { deleteUser } from '../controllers/user/deleteUser';

export const router = Router();
router.post('/create', createUser);
router.post('/delete', deleteUser)
