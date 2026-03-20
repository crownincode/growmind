import { useNavigate } from 'react-router-dom';

export default function PlantCard({ id, name, species, photo_url, health_status, next_water_date }) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/plant/${id}`);
  };

  // Health status color mapping
  const healthColors = {
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not set';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer"
    >
      {/* Photo or placeholder */}
      <div className="relative h-48 bg-gray-100">
        {photo_url ? (
          <img
            src={photo_url}
            alt={name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-green-100">
            <span className="text-6xl">🌿</span>
          </div>
        )}
        
        {/* Health status dot */}
        <div className={`absolute top-3 right-3 w-4 h-4 rounded-full ${healthColors[health_status] || 'bg-green-500'} ring-2 ring-white`}></div>
      </div>

      {/* Info section */}
      <div className="p-4">
        <h3 className="font-bold text-gray-900 text-lg truncate">{name}</h3>
        <p className="text-gray-500 text-sm mt-1 truncate">{species}</p>
        
        {next_water_date && (
          <div className="mt-3 flex items-center text-sm text-gray-600">
            <span className="mr-2">💧</span>
            <span>Next water: {formatDate(next_water_date)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
