import express from 'express'
import { getRemindersByUser, createReminder, markReminderAsSent, deleteReminder } from '../models/Reminder.js'

const router = express.Router()

/**
 * GET /api/reminders
 * Get all pending reminders for authenticated user
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    
    if (!userId) {
      return res.status(401).json({ error: 'Authentication required' })
    }

    const reminders = await getRemindersByUser(userId)
    res.json(reminders)
  } catch (error) {
    console.error('Error fetching reminders:', error)
    res.status(500).json({ error: 'Failed to fetch reminders' })
  }
})

/**
 * POST /api/reminders
 * Create a new reminder
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    const { plant_id, due_date, action } = req.body
    
    if (!plant_id || !due_date || !action) {
      return res.status(400).json({ error: 'plant_id, due_date, and action are required' })
    }

    const reminderData = {
      plant_id,
      user_id: userId,
      due_date,
      action,
      sent: false
    }

    const newReminder = await createReminder(reminderData)
    res.status(201).json(newReminder)
  } catch (error) {
    console.error('Error creating reminder:', error)
    res.status(500).json({ error: 'Failed to create reminder' })
  }
})

/**
 * POST /api/reminders/:id/mark-sent
 * Mark a reminder as sent
 */
router.post('/:id/mark-sent', async (req, res) => {
  try {
    const updatedReminder = await markReminderAsSent(req.params.id)
    
    if (!updatedReminder) {
      return res.status(404).json({ error: 'Reminder not found' })
    }
    
    res.json(updatedReminder)
  } catch (error) {
    console.error('Error marking reminder as sent:', error)
    res.status(500).json({ error: 'Failed to update reminder' })
  }
})

/**
 * DELETE /api/reminders/:id
 * Delete a reminder
 */
router.delete('/:id', async (req, res) => {
  try {
    const userId = req.headers['x-user-id'] || 'demo-user'
    await deleteReminder(req.params.id, userId)
    res.json({ message: 'Reminder deleted successfully' })
  } catch (error) {
    console.error('Error deleting reminder:', error)
    res.status(500).json({ error: 'Failed to delete reminder' })
  }
})

export default router
