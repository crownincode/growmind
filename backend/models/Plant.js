import { supabase } from '../config/supabase.js'

/**
 * Get all plants for a user
 */
export async function getPlantsByUser(userId) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching plants:', error)
    throw error
  }
}

/**
 * Get a single plant by ID
 */
export async function getPlantById(plantId, userId) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .select('*')
      .eq('id', plantId)
      .eq('user_id', userId)
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error fetching plant:', error)
    throw error
  }
}

/**
 * Create a new plant
 */
export async function createPlant(plantData) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .insert([plantData])
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error creating plant:', error)
    throw error
  }
}

/**
 * Update a plant
 */
export async function updatePlant(plantId, userId, updates) {
  try {
    const { data, error } = await supabase
      .from('plants')
      .update(updates)
      .eq('id', plantId)
      .eq('user_id', userId)
      .select()
      .single()
    
    if (error) throw error
    return data
  } catch (error) {
    console.error('Error updating plant:', error)
    throw error
  }
}

/**
 * Delete a plant
 */
export async function deletePlant(plantId, userId) {
  try {
    const { error } = await supabase
      .from('plants')
      .delete()
      .eq('id', plantId)
      .eq('user_id', userId)
    
    if (error) throw error
    return true
  } catch (error) {
    console.error('Error deleting plant:', error)
    throw error
  }
}
