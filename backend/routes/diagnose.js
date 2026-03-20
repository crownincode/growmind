import { Router } from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import * as kindwiseService from '../services/kindwiseService.js'

const router = Router()

// POST /api/diagnose - Diagnose a plant image
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { imageUrl } = req.body

    if (!imageUrl) {
      return res.status(400).json({ error: 'Image URL is required' })
    }

    // Call Kindwise API to diagnose the plant
    const diagnosis = await kindwiseService.diagnose(imageUrl)

    res.json({
      success: true,
      results: diagnosis
    })
  } catch (error) {
    console.error('Diagnosis error:', error)
    res.status(500).json({ 
      error: 'Failed to diagnose plant',
      message: error.message 
    })
  }
})

export default router
