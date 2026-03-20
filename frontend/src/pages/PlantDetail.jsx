import { useParams, Link } from 'react-router-dom'

// Placeholder data - will be replaced with real data from Supabase
const placeholderPlant = {
  id: '1',
  name: 'Monstera Deliciosa',
  species: 'Monstera deliciosa',
  photo_url: 'https://images.unsplash.com/photo-1614594975525-e45890e2e126?w=600',
  health_status: 'green',
  last_diagnosis: 'Healthy',
  next_water_date: '2024-01-20',
  next_check_date: '2024-01-22',
  location: 'Living Room',
  care_plan: {
    summary: 'Your Monstera is healthy! Continue current care routine.',
    urgent: [],
    care_plan: [
      { day: 1, action: 'Water thoroughly until water drains from bottom' },
      { day: 7, action: 'Check soil moisture, water if top 2 inches are dry' },
      { day: 14, action: 'Wipe leaves with damp cloth to remove dust' }
    ],
    watering_schedule: 'Every 7-10 days. Let top 2 inches of soil dry first.'
  },
  created_at: '2024-01-01'
}

function PlantDetail() {
  const { id } = useParams()
  
  // In V1, we'll fetch from Supabase based on plant id
  const plant = placeholderPlant

  const statusColors = {
    green: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-500' },
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-500' },
    red: { bg: 'bg-red-100', text: 'text-red-800', dot: 'bg-red-500' }
  }

  const status = statusColors[plant.health_status]

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-6 bg-white shadow-sm">
        <div className="max-w-4xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-800">🌿 GrowMind</Link>
          <Link 
            to="/my-plants" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Back to My Plants
          </Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-8">
          <img 
            src={plant.photo_url} 
            alt={plant.name}
            className="w-full h-64 object-cover"
          />
          <div className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-3xl font-bold text-gray-800">{plant.name}</h2>
                <p className="text-gray-500 italic">{plant.species}</p>
              </div>
              <div className={`px-4 py-2 rounded-full ${status.bg} ${status.text} flex items-center gap-2`}>
                <div className={`w-3 h-3 rounded-full ${status.dot}`}></div>
                <span className="font-medium capitalize">{plant.health_status}</span>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">📍 Location</p>
                <p className="font-medium text-gray-800">{plant.location}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">💧 Next Water</p>
                <p className="font-medium text-gray-800">{plant.next_water_date}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">🔍 Next Check</p>
                <p className="font-medium text-gray-800">{plant.next_check_date}</p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Care Summary</h3>
              <p className="text-gray-600 mb-4">{plant.care_plan.summary}</p>
              
              {plant.care_plan.urgent.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                  <h4 className="font-semibold text-red-800 mb-2">⚠️ Urgent Actions</h4>
                  <ul className="list-disc list-inside text-red-700">
                    {plant.care_plan.urgent.map((action, idx) => (
                      <li key={idx}>{action}</li>
                    ))}
                  </ul>
                </div>
              )}

              <h4 className="font-semibold text-gray-800 mb-3">14-Day Care Plan</h4>
              <div className="space-y-3">
                {plant.care_plan.care_plan.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start bg-gray-50 p-3 rounded-lg">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                      {item.day}
                    </div>
                    <p className="text-gray-700 pt-1">{item.action}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💧 Watering Schedule</h4>
                <p className="text-blue-700">{plant.care_plan.watering_schedule}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4">
          <Link 
            to="/diagnose"
            className="flex-1 px-6 py-3 bg-green-600 text-white text-center rounded-lg hover:bg-green-700 transition"
          >
            Re-diagnose This Plant
          </Link>
          <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition">
            Edit Details
          </button>
        </div>
      </main>
    </div>
  )
}

export default PlantDetail
