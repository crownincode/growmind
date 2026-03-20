import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Diagnose from './pages/Diagnose'
import CarePlan from './pages/CarePlan'
import MyPlants from './pages/MyPlants'
import PlantDetail from './pages/PlantDetail'
import NotFound from './pages/NotFound'

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          
          {/* Protected Routes */}
          <Route 
            path="/diagnose" 
            element={
              <ProtectedRoute>
                <Diagnose />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/care-plan" 
            element={
              <ProtectedRoute>
                <CarePlan />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/my-plants" 
            element={
              <ProtectedRoute>
                <MyPlants />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/plant/:id" 
            element={
              <ProtectedRoute>
                <PlantDetail />
              </ProtectedRoute>
            } 
          />
          
          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
