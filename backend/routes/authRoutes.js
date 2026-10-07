// routes/authRoutes.js
import express from 'express';
import {
    login,
    register,
    adminRegister,
    adminLogin
} from '../controllers/authController.js';

const authRouter = express.Router();

authRouter.post('/register', register);
authRouter.post('/login', login);
authRouter.post('/admin-register', adminRegister);
authRouter.post('/admin-login', adminLogin);  

export default authRouter;
