import { Link } from 'react-router-dom'

// Placeholder data - will be replaced with real data from Supabase
const placeholderPlants = [
  {
    id: '1',
    name: 'Monstera Deliciosa',
    species: 'Monstera deliciosa',
    photo_url: 'https://images.unsplash.com/photo-1614594975525-e45890e2e126?w=400',
    health_status: 'green',
    last_diagnosis: 'Healthy',
    next_water_date: '2024-01-20',
    location: 'Living Room'
  },
  {
    id: '2',
    name: 'Fiddle Leaf Fig',
    species: 'Ficus lyrata',
    photo_url: 'https://images.unsplash.com/photo-1612363228108-b9c8d1a2c6f9?w=400',
    health_status: 'yellow',
    last_diagnosis: 'Possible overwatering',
    next_water_date: '2024-01-25',
    location: 'Bedroom'
  },
  {
    id: '3',
    name: 'Snake Plant',
    species: 'Sansevieria trifasciata',
    photo_url: 'https://images.unsplash.com/photo-1599598425947-d352b50d25f9?w=400',
    health_status: 'red',
    last_diagnosis: 'Root rot detected',
    next_water_date: '2024-02-01',
    location: 'Office'
  }
]

function PlantCard({ plant }) {
  const statusColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500'
  }

  return (
    <Link to={`/plant/${plant.id}`} className="block">
      <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition">
        <div className="relative">
          <img 
            src={plant.photo_url} 
            alt={plant.name}
            className="w-full h-48 object-cover"
          />
          <div className={`absolute top-3 right-3 w-4 h-4 rounded-full ${statusColors[plant.health_status]} border-2 border-white`}></div>
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg text-gray-800 mb-1">{plant.name}</h3>
          <p className="text-sm text-gray-500 mb-3">{plant.species}</p>
          <div className="flex justify-between items-center text-sm">
            <span className="text-gray-600">📍 {plant.location}</span>
            <span className="text-gray-600">💧 {plant.next_water_date}</span>
          </div>
          {plant.last_diagnosis && (
            <p className="mt-3 text-xs text-gray-500 bg-gray-50 p-2 rounded">
              Last check: {plant.last_diagnosis}
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

function MyPlants() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="p-6 bg-white shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-green-800">🌿 GrowMind</Link>
          <Link 
            to="/diagnose" 
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            + Diagnose New Plant
          </Link>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">My Plants</h2>
        <p className="text-gray-600 mb-8">Track and manage all your plants in one place.</p>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {placeholderPlants.map(plant => (
            <PlantCard key={plant.id} plant={plant} />
          ))}
        </div>

        {placeholderPlants.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🌱</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">No plants yet</h3>
            <p className="text-gray-500 mb-6">Start by diagnosing your first plant!</p>
            <Link 
              to="/diagnose" 
              className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Diagnose a Plant
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}

export default MyPlants
