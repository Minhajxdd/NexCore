import express from 'express';
import * as userController from '../controllers/userController.js';


const router = express.Router();


router.route('/login')
    .get(userController.login);

router.route('/')
    .get(userController.home);


export default router; 