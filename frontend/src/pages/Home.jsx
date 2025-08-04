import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className="max-w-4xl mx-auto">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
          Welcome to <span className="text-primary-600">Thrift Store</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Discover unique, sustainable fashion and home goods at amazing prices. 
          Shop pre-loved items and give them a new life.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/items" className="btn-primary text-lg px-8 py-3">
            Start Shopping
          </Link>
          <Link to="/register" className="btn-secondary text-lg px-8 py-3">
            Get Started
          </Link>
          <Link to="/login" className="btn-secondary text-lg px-8 py-3">
            Sign In
          </Link>
        </div>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Affordable Prices</h3>
          <p className="text-gray-600">
            Find quality items at a fraction of retail prices. Save money while being eco-friendly.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Sustainable Shopping</h3>
          <p className="text-gray-600">
            Reduce waste and environmental impact by choosing pre-loved items.
          </p>
        </div>

        <div className="card text-center">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Quality Assured</h3>
          <p className="text-gray-600">
            All items are carefully inspected to ensure they meet our quality standards.
          </p>
        </div>
      </div>

      {/* CTA Section */}
      <div className="card text-center bg-primary-50 border-primary-200">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to Start Shopping?
        </h2>
        <p className="text-gray-600 mb-6">
          Join thousands of customers who love finding unique treasures at great prices.
        </p>
        <Link to="/register" className="btn-primary text-lg px-8 py-3">
          Create Account
        </Link>
      </div>
    </div>
  )
}

export default Home 