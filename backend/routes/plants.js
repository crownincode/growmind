import express from 'express'
import { getPlantsByUser, getPlantById, createPlant, updatePlant, deletePlant } from '../models/Plant.js'
import reminderService from '../services/reminderService.js'

const router = express.Router()

/**
 * GET /api/plants
 * Get all plants for authenticated user
 */
router.get('/', async (req, res) => {
  try {
    // TODO: Extract user_id from Supabase auth token
    const userId = req.headers['x-user-id'] || 'demo-user'
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const plants = await getPlantsByUser(userId)
    res.json(plants)
  } catch (error) {
    console.error('Error fetching plants:', error)
    res.status(500).json({ error: 'Failed to fetch plants' })
  }
})

/**
 * GET /api/plants/:id
 * Get a specific plant by ID
 */
router.get('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const plant = await getPlantById(req.params.id, userId)
    
    if (!plant) {
      return res.status(404).json({ error: 'Plant not found' })
    }
    
    res.json(plant)
  } catch (error) {
    console.error('Error fetching plant:', error)
    res.status(500).json({ error: 'Failed to fetch plant' })
  }
})

/**
 * POST /api/plants
 * Create a new plant
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const { name, species, location, photo_url, health_status, last_diagnosis, care_plan, next_water_date, next_check_date } = req.body
    
    if (!name || !species) {
      return res.status(400).json({ error: 'Name and species are required' })
    }

    const plantData = {
      user_id: userId,
      name,
      species,
      location: location || '',
      photo_url: photo_url || '',
      health_status: health_status || 'green',
      last_diagnosis: last_diagnosis || null,
      care_plan: care_plan || null,
      next_water_date: next_water_date || null,
      next_check_date: next_check_date || null
    }

    const newPlant = await createPlant(plantData)
    
    // Schedule reminders if care_plan includes reminder_days
    if (care_plan?.reminder_days && care_plan.reminder_days.length > 0) {
      try {
        await reminderService.scheduleReminders(
          newPlant.id,
          userId,
          care_plan.reminder_days,
          name,
          new Date().toISOString()
        )
      } catch (reminderError) {
        console.error('Failed to schedule reminders:', reminderError)
        // Don't fail the plant creation, just log the error
      }
    }
    
    res.status(201).json(newPlant)
  } catch (error) {
    console.error('Error creating plant:', error)
    res.status(500).json({ error: 'Failed to create plant' })
  }
})

/**
 * PUT /api/plants/:id
 * Update an existing plant
 */
router.put('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const updates = req.body
    
    const updatedPlant = await updatePlant(req.params.id, userId, updates)
    
    if (!updatedPlant) {
      return res.status(404).json({ error: 'Plant not found' })
    }
    
    res.json(updatedPlant)
  } catch (error) {
    console.error('Error updating plant:', error)
    res.status(500).json({ error: 'Failed to update plant' })
  }
})

/**
 * DELETE /api/plants/:id
 * Delete a plant
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    await deletePlant(req.params.id, userId)
    res.json({ message: 'Plant deleted successfully' })
  } catch (error) {
    console.error('Error deleting plant:', error)
    res.status(500).json({ error: 'Failed to delete plant' })
  }
})

export default router
