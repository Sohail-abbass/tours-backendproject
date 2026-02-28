import { Router } from 'express';
import {
  register,
  login,
  getMe,
  updateProfile,
  changePassword,
  getUsers
} from '../controllers/authController';
import { protect, authorize } from '../middleware/auth';

const router = Router();
// pi
// Public routes
router.post('/register', register);
router.post('/login', login);
//d
// Protected routesss
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);

// Admin only routes
router.get('/users', protect, authorize('admin'), getUsers);

export default router;

