import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-green-100">
        <nav className="p-6">
          <div className="max-w-6xl mx-auto flex justify-between items-center">
            <span className="text-2xl font-bold text-green-800">🌿 GrowMind</span>
            <div className="flex items-center gap-4">
              <Link 
                to="/login" 
                className="px-4 py-2 text-green-700 hover:text-green-900 transition"
              >
                Log In
              </Link>
              <Link 
                to="/signup" 
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
              >
                Get Started
              </Link>
            </div>
          </div>
        </nav>

        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Your AI Plant Health Coach
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Diagnose plant diseases, get personalized care plans, and never forget to water again. 
            GrowMind helps hobby growers keep their plants thriving.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/signup" 
              className="px-8 py-4 bg-green-600 text-white text-lg font-semibold rounded-xl hover:bg-green-700 transition"
            >
              Get Started Free
            </Link>
            <Link 
              to="/login" 
              className="px-8 py-4 bg-white text-green-700 text-lg font-semibold rounded-xl border-2 border-green-600 hover:bg-green-50 transition"
            >
              Log In
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-4">
            Everything You Need to Keep Plants Happy
          </h2>
          <p className="text-gray-600 text-center mb-16 max-w-2xl mx-auto">
            From diagnosis to daily care, GrowMind has you covered
          </p>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Feature 1: Diagnose */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Diagnose</h3>
              <p className="text-gray-600">
                Upload a photo and our AI identifies diseases, pests, and nutrient deficiencies instantly.
              </p>
            </div>

            {/* Feature 2: Care Plans */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Care Plans</h3>
              <p className="text-gray-600">
                Get personalized care instructions tailored to your plant's specific needs and environment.
              </p>
            </div>

            {/* Feature 3: Plant Log */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Plant Log</h3>
              <p className="text-gray-600">
                Track all your plants in one place with photos, notes, and health history.
              </p>
            </div>

            {/* Feature 4: Reminders */}
            <div className="bg-white rounded-xl shadow-md p-6 text-center">
              <div className="text-5xl mb-4">⏰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Reminders</h3>
              <p className="text-gray-600">
                Never forget to water, fertilize, or repot. Smart reminders keep you on track.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Become a Plant Parent Pro?
          </h2>
          <p className="text-green-100 text-lg mb-8">
            Join thousands of happy plant parents who trust GrowMind to keep their green friends thriving.
          </p>
          <Link 
            to="/signup" 
            className="inline-block px-8 py-4 bg-white text-green-700 text-lg font-semibold rounded-xl hover:bg-green-50 transition"
          >
            Start Your Free Trial
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-sm">
            © 2024 GrowMind. Built with 🌱 for plant lovers everywhere.
          </p>
        </div>
      </footer>
    </div>
  )
}

export default Home
