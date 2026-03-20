import axios from 'axios'

const KINDWISE_API_URL = 'https://plant.health/api/v3/identification'
const KINDWISE_API_KEY = process.env.KINDWISE_API_KEY

export async function diagnose(imageUrl) {
  try {
    if (!KINDWISE_API_KEY) {
      throw new Error('Kindwise API key not configured')
    }

    const response = await axios.post(
      `${KINDWISE_API_URL}?details=local_name,description,treatment`,
      {
        images: [imageUrl],
        similar_images: false,
        suggested_variables: ['health_conditions']
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'api-key': KINDWISE_API_KEY
        }
      }
    )

    const results = response.data.results?.[0]?.results || []
    
    // Parse and return top 3 health conditions
    const topConditions = results.slice(0, 3).map(result => ({
      name: result.name?.common_name || result.name?.scientific_name || 'Unknown',
      probability: result.probability || 0,
      description: result.details?.description || 'No description available',
      treatment: result.details?.treatment || 'No treatment information available'
    }))

    return topConditions
  } catch (error) {
    console.error('Kindwise diagnosis error:', error.response?.data || error.message)
    throw new Error('Failed to diagnose plant')
  }
}
