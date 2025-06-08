import express from 'express';
import { 
    signup,
    login,
    checkEmail
} from '../controllers/user.controller.js';
import { authMiddleware } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes for authentication
router.post('/signup', signup);
router.post('/login', login);
router.post('/check-email', checkEmail);

// All routes are protected with auth middleware
router.use(authMiddleware);

export default router; 