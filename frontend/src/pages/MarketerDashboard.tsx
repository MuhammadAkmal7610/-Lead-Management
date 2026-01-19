import useAuthStore from '../stores/authStore'

export default function MarketerDashboard() {
  const { user, logout } = useAuthStore();

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Marketer Dashboard</h1>
        <button onClick={logout} className="text-red-600">Logout</button>
      </div>

      <div className="bg-white p-6 rounded shadow">
        <h2 className="text-xl font-semibold mb-4">Submit New Lead</h2>
        <p className="text-gray-600 mb-4">
          You can submit leads here (form coming soon...)
        </p>
        <button className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
          + New Lead
        </button>
      </div>
    </div>
  );
}