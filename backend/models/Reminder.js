import { supabase } from '../config/supabase.js'

/**
 * Get reminders for a user
 */
export async function getRemindersByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        plants (
          name,
          species,
          photo_url
        )
      `)
      .eq('user_id', userId)
      .eq('sent', false)
      .gte('due_date', new Date().toISOString().split('T')[0])
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching reminders:', error)
    throw error
  }
}

/**
 * Get reminders for a specific plant
 */
export async function getRemindersByPlant(plantId) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .select('*')
      .eq('plant_id', plantId)
      .order('due_date', { ascending: true })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching plant reminders:', error)
    throw error
  }
}

/**
 * Create a new reminder
 */
export async function createReminder(reminderData) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .insert([reminderData])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating reminder:', error)
    throw error
  }
}

/**
 * Mark reminder as sent
 */
export async function markReminderAsSent(reminderId) {
  try {
    const { data, error } = await supabase
      .from('reminders')
      .update({ sent: true })
      .eq('id', reminderId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error marking reminder as sent:', error)
    throw error
  }
}

/**
 * Delete a reminder
 */
export async function deleteReminder(reminderId, userId) {
  try {
    const { error } = await supabase
      .from('reminders')
      .delete()
      .eq('id', reminderId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting reminder:', error)
    throw error
  }
}

/**
 * Get due reminders for cron job
 */
export async function getDueReminders() {
  try {
    const today = new Date().toISOString().split('T')[0]
    const { data, error } = await supabase
      .from('reminders')
      .select(`
        *,
        plants (
          name,
          species
        ),
        auth.users (
          email
        )
      `)
      .eq('due_date', today)
      .eq('sent', false)
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching due reminders:', error)
    throw error
  }
}
