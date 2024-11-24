import express from 'express';
import { createCar, getBrands, getRecommendedCars } from '../controllers/carController.js';

const router = express.Router();

router.post('/create-car', createCar);
router.get('/brands', getBrands);
router.get('/recommendations', getRecommendedCars);

export {router as carRouter};
