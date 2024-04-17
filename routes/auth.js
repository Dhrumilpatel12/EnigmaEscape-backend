import express from "express";
import { register,login } from '../controllers/auth.js';
import {  getAllUsers } from '../controllers/user.js';

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/register", register);
router.get("/login", login);
router.get("/user", getAllUsers); 

export default router;
