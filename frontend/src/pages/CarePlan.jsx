import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Checklist from '../components/Checklist';

export default function CarePlan() {
  const location = useLocation();
  const navigate = useNavigate();
  const { session } = useAuth();
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [showSaveForm, setShowSaveForm] = useState(false);
  const [plantName, setPlantName] = useState('');
  const [plantLocation, setPlantLocation] = useState('');

  const { carePlan, photoUrl, plantName: diagnosisPlantName } = location.state || {};

  if (!carePlan) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-8 text-center max-w-md mx-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">No Care Plan Found</h2>
          <p className="text-gray-600 mb-6">Please diagnose a plant first to generate a care plan.</p>
          <Link
            to="/diagnose"
            className="inline-block px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
          >
            Diagnose My Plant
          </Link>
        </div>
      </div>
    );
  }

  const handleSavePlant = async (e) => {
    e.preventDefault();
    if (!session) return;

    setSaving(true);
    setSaveError(null);

    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000'}/api/plants`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({
          name: plantName || diagnosisPlantName || 'My Plant',
          species: diagnosisPlantName || 'Unknown',
          location: plantLocation,
          photo_url: photoUrl,
          health_status: 'green',
          last_diagnosis: { name: diagnosisPlantName },
          care_plan: carePlan,
          next_water_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
          next_check_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
        })
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || 'Failed to save plant');
      }

      navigate('/my-plants');
    } catch (err) {
      console.error('Save error:', err);
      setSaveError(err.message);
    } finally {
      setSaving(false);
    }
  };

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

      <main className="max-w-3xl mx-auto px-6 py-12">
        {/* Plant Photo & Name */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
          {photoUrl && (
            <img
              src={photoUrl}
              alt={diagnosisPlantName}
              className="w-full h-64 object-cover"
            />
          )}
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900">{diagnosisPlantName}</h1>
            <p className="text-gray-600 mt-2">{carePlan.summary}</p>
          </div>
        </div>

        {/* Urgent Actions Alert */}
        {carePlan.urgent && carePlan.urgent.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 mb-6">
            <h2 className="text-lg font-bold text-red-800 mb-3">⚠️ Urgent Actions</h2>
            <ul className="space-y-2">
              {carePlan.urgent.map((action, index) => (
                <li key={index} className="text-red-700 flex items-start">
                  <span className="mr-2">•</span>
                  {action}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Care Plan Checklist */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Your 14-Day Care Plan</h2>
          <Checklist carePlan={carePlan.care_plan} />
        </div>

        {/* Watering Schedule */}
        <div className="bg-green-50 border border-green-200 rounded-xl p-6 mb-6">
          <div className="flex items-start">
            <span className="text-2xl mr-3">💧</span>
            <div>
              <h3 className="font-bold text-green-900 mb-2">Watering Schedule</h3>
              <p className="text-green-800">{carePlan.watering_schedule}</p>
            </div>
          </div>
        </div>

        {/* Save to My Plants Section */}
        <div className="bg-white rounded-xl shadow-md p-6">
          {!showSaveForm ? (
            <button
              onClick={() => setShowSaveForm(true)}
              className="w-full px-6 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Save to My Plants
            </button>
          ) : (
            <form onSubmit={handleSavePlant} className="space-y-4">
              <h3 className="text-lg font-bold text-gray-800">Save This Plant</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plant Nickname
                </label>
                <input
                  type="text"
                  value={plantName}
                  onChange={(e) => setPlantName(e.target.value)}
                  placeholder={diagnosisPlantName || 'My Plant'}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <input
                  type="text"
                  value={plantLocation}
                  onChange={(e) => setPlantLocation(e.target.value)}
                  placeholder="e.g., Living room window"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                />
              </div>

              {saveError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  {saveError}
                </div>
              )}

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowSaveForm(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className={`flex-1 px-6 py-3 text-white rounded-lg transition ${
                    saving
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  {saving ? 'Saving...' : 'Save Plant'}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
}
