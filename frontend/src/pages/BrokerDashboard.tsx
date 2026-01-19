import { Link } from 'react-router-dom';
import useAuthStore from '../stores/authStore'

export default function BrokerDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen">
      {/* Navbar */}
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-blue-700">PropNest - Broker</h1>
          <div className="flex items-center gap-6">
            <span className="text-gray-700">{user?.email}</span>
            <button
              onClick={logout}
              className="text-red-600 hover:text-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold mb-6">Welcome, Broker!</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Available Leads</h3>
            <p className="text-gray-600 mb-4">
              Browse and purchase verified real estate leads
            </p>
            <Link
              to="/marketplace"
              className="inline-block bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Go to Marketplace
            </Link>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">My Deals</h3>
            <p className="text-gray-600">View your registered deals and status</p>
            <button className="mt-4 text-blue-600 hover:underline">
              View My Deals →
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}