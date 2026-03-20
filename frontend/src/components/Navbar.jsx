import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function Navbar() {
  const { session, signOut } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await signOut()
    navigate('/login')
  }

  return (
    <nav className="p-6 bg-white shadow-sm">
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold text-green-800">🌿 GrowMind</Link>
        
        {session ? (
          <div className="flex items-center gap-4">
            <Link 
              to="/my-plants" 
              className="px-4 py-2 text-green-700 hover:text-green-900 transition"
            >
              My Plants
            </Link>
            <Link 
              to="/diagnose" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Diagnose
            </Link>
            <button 
              onClick={handleLogout}
              className="px-4 py-2 text-red-600 hover:text-red-700 transition"
            >
              Logout
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link 
              to="/login" 
              className="px-4 py-2 text-green-700 hover:text-green-900 transition"
            >
              Log In
            </Link>
            <Link 
              to="/signup" 
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Sign Up
            </Link>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar
