import express from 'express';
import {
  createRide,
  cancelRide,
  endRide,
} from '../controllers/rideController.js';
import { protectedRoute } from '../middelware/auth.middelware.js';

const router = express.Router();

router.use(protectedRoute(["user"]))
// Create a ride
router.post('/create-ride/:carId', createRide);

// Cancel a ride
router.patch('/cancel-ride/:rideId', cancelRide);

// End a ride
router.patch('/end-ride/:rideId', endRide);

export {router as rideRouter};