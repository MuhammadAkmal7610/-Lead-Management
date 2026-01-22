 import { Link } from 'react-router-dom';
import { UserCircle, FileText, Handshake, LogOut } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function BrokerDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-blue-100 to-slate-200">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
              PropNest
            </h1>
            <p className="text-sm text-gray-500">
              Broker Dashboard
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-gray-700 bg-gray-100 px-3 py-1.5 rounded-lg">
              <UserCircle size={18} />
              {user?.email}
            </div>

            <button
              onClick={logout}
              className="flex items-center gap-2 bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 active:scale-95 transition"
            >
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* View Lead */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-blue-100 text-blue-600 p-3 rounded-xl group-hover:scale-105 transition">
                <FileText size={26} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                View Lead
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-10">
              Review purchased leads and access full customer and property
              details.
            </p>

            <Link
              to="/leads/detail"
              className="block text-center bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-xl font-medium shadow hover:shadow-md hover:opacity-90 active:scale-[0.98] transition"
            >
              Open Lead
            </Link>
          </div>

          {/* Register Deal */}
          <div className="group bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-4 mb-4">
              <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl group-hover:scale-105 transition">
                <Handshake size={26} />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">
                Register Deal
              </h3>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed mb-10">
              Convert an active lead into a registered deal and track its
              progress.
            </p>

            <Link
              to="/deals/register/1"
              className="block text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-medium shadow hover:shadow-md hover:opacity-90 active:scale-[0.98] transition"
            >
              Register Deal
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
