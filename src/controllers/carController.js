import Car from "../models/carModel.js";

// Create all brands
export const createCar = async (req, res) => {
  try {
    const { brand, model, rating, reviews, pricePerHour, imageUrl } = req.body;
    const { brandName, logo } = brand;
    const newCar = await Car.create({
      brand: {
        brandName,
        logo,
      },
      model,
      rating,
      reviews,
      pricePerHour,
      imageUrl,
    });
    res.status(200).json({ success: true, data: newCar });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get all brands
export const getBrands = async (req, res) => {
  try {
    const brands = await Car.find().distinct("brand");
    res.status(200).json({ success: true, data: brands });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Get recommended cars
export const getRecommendedCars = async (req, res) => {
  try {
    const cars = await Car.find().sort({ rating: -1 }).limit(10);
    res.status(200).json({ success: true, data: cars });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
