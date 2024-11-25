import express from 'express';
import { createCar, getBrands, getRecommendedCars } from '../controllers/carController.js';
import { protectedRoute } from '../middelware/auth.middelware.js';

const router = express.Router();


router.post('/create-car', protectedRoute(["renter"]) ,createCar);
router.use(protectedRoute(["user"]))
router.get('/brands', getBrands);
router.get('/recommendations', getRecommendedCars);

export {router as carRouter};
