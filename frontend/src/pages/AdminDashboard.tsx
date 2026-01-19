 import useAuthStore from '../stores/authStore';

export default function AdminDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="p-6">
 
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Administration Dashboard</h1>
          <p className="text-sm text-gray-500">
            Overview of system activity and performance
          </p>
        </div>
        <button
          onClick={logout}
          className="text-sm text-red-600 hover:underline"
        >
          Sign out
        </button>
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Newly Submitted Leads
          </h3>
          <p className="text-3xl font-semibold text-gray-900">42</p>
        </div>

        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Leads Pending Verification
          </h3>
          <p className="text-3xl font-semibold text-gray-900">18</p>
        </div>

        <div className="bg-white p-6 rounded shadow-sm">
          <h3 className="text-sm font-medium text-gray-600 mb-2">
            Active Deals
          </h3>
          <p className="text-3xl font-semibold text-gray-900">7</p>
        </div>
      </div>

       
      <p className="mt-8 text-sm text-gray-500">
        Use this dashboard to review incoming leads, verify client information,
        and manage active deals.
      </p>
    </div>
  );
}
