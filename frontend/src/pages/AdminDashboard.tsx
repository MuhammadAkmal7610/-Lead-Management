 import { Link } from 'react-router-dom';
import { ShieldCheck, FileSearch, LogOut } from 'lucide-react';
import useAuthStore from '../stores/authStore';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-indigo-100 p-6">
      {/* Header */}
      <header className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-6 w-full md:w-auto">
          <h1 className="text-3xl font-bold text-gray-900">
            Admin Dashboard
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Signed in as {user?.email}
          </p>
        </div>

        <button
          onClick={logout}
          className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-rose-600 text-white px-5 py-2.5 rounded-lg font-medium shadow hover:opacity-90 transition"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </header>

      {/* Actions */}
      <section className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Verify Leads */}
        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-blue-100 text-blue-600 p-3 rounded-xl">
              <ShieldCheck size={26} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Verify Leads
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            Review newly submitted leads and approve or reject them before
            they become active in the system.
          </p>

          <Link
            to="/admin/verify-leads"
            className="block text-center bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Go to Verification
          </Link>
        </div>

        {/* Review Deals */}
        <div className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-emerald-100 text-emerald-600 p-3 rounded-xl">
              <FileSearch size={26} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">
              Review Deals
            </h3>
          </div>

          <p className="text-sm text-gray-600 mb-8">
            Monitor registered deals, review their status, and approve or
            manage them efficiently.
          </p>

          <Link
            to="/admin/deals"
            className="block text-center bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-medium hover:opacity-90 transition"
          >
            Review Deals
          </Link>
        </div>
      </section>
    </div>
  );
}
