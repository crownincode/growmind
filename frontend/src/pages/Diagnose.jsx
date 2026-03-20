import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import UploadZone from '../components/UploadZone'

function Diagnose() {
  const [selectedFile, setSelectedFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { session } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  
  // Form state for step 2
  const [formData, setFormData] = useState({
    plant_name: '',
    location: '',
    light_level: '',
    watering_habit: '',
    pot_size: '',
    symptoms_described: ''
  })

  const handleFormChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!selectedFile || !session) return
    
    setLoading(true)
    setError(null)
    
    try {
      // Step 1: Upload image to Supabase Storage
      const uploadFormData = new FormData()
      uploadFormData.append('image', selectedFile)
      
      const uploadResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`
        },
        body: uploadFormData
      })
      
      if (!uploadResponse.ok) {
        const errData = await uploadResponse.json()
        throw new Error(errData.error || 'Upload failed')
      }
      
      const uploadData = await uploadResponse.json()
      const photoUrl = uploadData.imageUrl
      
      // Step 2: Send image to Kindwise for diagnosis
      const diagnoseResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/diagnose`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ imageUrl: photoUrl })
      })
      
      if (!diagnoseResponse.ok) {
        const errData = await diagnoseResponse.json()
        throw new Error(errData.error || 'Diagnosis failed')
      }
      
      const diagnoseData = await diagnoseResponse.json()
      const topResult = diagnoseData.results[0]
      
      // Step 3: Generate care plan
      const careplanResponse = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/careplan`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          diagnosis: topResult.name,
          confidence: topResult.probability,
          plant_name: formData.plant_name || topResult.name,
          location: formData.location,
          light_level: formData.light_level,
          watering_habit: formData.watering_habit,
          pot_size: formData.pot_size,
          symptoms_described: formData.symptoms_described
        })
      })
      
      if (!careplanResponse.ok) {
        const errData = await careplanResponse.json()
        throw new Error(errData.error || 'Care plan generation failed')
      }
      
      const carePlan = await careplanResponse.json()
      
      // Navigate to care plan page with all data
      navigate('/careplan', { 
        state: { 
          carePlan, 
          photoUrl, 
          plantName: formData.plant_name || topResult.name,
          diagnosis: topResult.name,
          confidence: topResult.probability
        } 
      })
    } catch (err) {
      console.error('Diagnosis error:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-6 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-800">🌿 GrowMind</Link>
          <Link 
            to="/my-plants" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            My Plants
          </Link>
        </div>
      </nav>

      <main className="max-w-2xl mx-auto px-6 py-12">
        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-xl p-8 text-center max-w-sm mx-4">
              <div className="text-5xl mb-4 animate-pulse">🌿</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">Analyzing your plant...</h3>
              <p className="text-gray-600">This may take a moment</p>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-800 mb-2">Diagnose Your Plant</h2>
        <p className="text-gray-600 mb-8">Upload a photo and tell us about your plant's environment.</p>
        
        {/* Step 1: Upload */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Step 1: Upload Photo</h3>
          <UploadZone onFileSelect={setSelectedFile} />
        </div>

        {/* Step 2: Context Form */}
        {selectedFile && (
          <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-8 space-y-6">
            <h3 className="text-lg font-semibold text-gray-700">Step 2: Tell Us About Your Plant</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Plant Nickname</label>
              <input 
                type="text" 
                name="plant_name"
                value={formData.plant_name}
                onChange={handleFormChange}
                placeholder="e.g., Monstera, Ficus, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <input 
                type="text" 
                name="location"
                value={formData.location}
                onChange={handleFormChange}
                placeholder="e.g., Bedroom window, Living room corner"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Light Level</label>
              <select 
                name="light_level"
                value={formData.light_level}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select light level</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="Bright Indirect">Bright Indirect</option>
                <option value="Full Sun">Full Sun</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Watering Habit</label>
              <select 
                name="watering_habit"
                value={formData.watering_habit}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select frequency</option>
                <option value="Every 3 days">Every 3 days</option>
                <option value="Every 7 days">Every 7 days</option>
                <option value="Every 14 days">Every 14 days</option>
                <option value="When soil is dry">When soil is dry</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Pot Size</label>
              <select 
                name="pot_size"
                value={formData.pot_size}
                onChange={handleFormChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              >
                <option value="">Select pot size</option>
                <option value="Small (under 6in)">Small (under 6in)</option>
                <option value="Medium (6–10in)">Medium (6–10in)</option>
                <option value="Large (over 10in)">Large (over 10in)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Symptoms</label>
              <textarea 
                name="symptoms_described"
                value={formData.symptoms_described}
                onChange={handleFormChange}
                rows="3"
                placeholder="Describe what you see: yellow spots, wilting, brown edges..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
              ></textarea>
            </div>

            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                {error}
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className={`w-full px-6 py-4 text-lg font-semibold rounded-xl transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              {loading ? 'Analyzing...' : 'Analyze My Plant'}
            </button>
          </form>
        )}
      </main>
    </div>
  )
}

export default Diagnose
