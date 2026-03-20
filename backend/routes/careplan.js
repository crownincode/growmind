import express from 'express';
import { generateCarePlan } from '../services/openaiService.js';

const router = express.Router();

// POST /api/careplan - Generate AI care plan based on diagnosis and plant context
router.post('/', async (req, res, next) => {
  try {
    const { diagnosis, confidence, plant_name, location, light_level, watering_habit, pot_size, symptoms_described } = req.body;

    // Validate required fields
    if (!diagnosis || !plant_name) {
      return res.status(400).json({ 
        error: 'Missing required fields', 
        required: ['diagnosis', 'plant_name'] 
      });
    }

    const plantContext = {
      diagnosis,
      confidence,
      plant_name,
      location,
      light_level,
      watering_habit,
      pot_size,
      symptoms_described
    };

    const carePlan = await generateCarePlan(plantContext);
    
    res.status(200).json(carePlan);
  } catch (error) {
    console.error('Error generating care plan:', error);
    next(error);
  }
});

export default router;
