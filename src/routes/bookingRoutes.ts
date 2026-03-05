import { Router } from 'express';
import {
  // getBookings,
  // getBookingById,
  createBooking,
  updateBooking,
  // deleteBooking,
  getBookingStats
} from '../controllers/bookingController';

const router = Router();

// Public routes
router.post('/', createBooking);

// Protected routes (Admin only)
router.get('/stats', getBookingStats);

// router.get('/', protect, authorize('admin', 'staff'), getBookings);

// router.get('/:id', protect, authorize('admin', 'staff'), getBookingById);

router.put('/:id', updateBooking);

// router.delete('/:id', protect, authorize('admin'), deleteBooking);

export default router;

