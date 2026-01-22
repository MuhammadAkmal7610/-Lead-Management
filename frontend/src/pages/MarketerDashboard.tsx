 import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function MarketerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    budget: '',
    location: '',
    propertyType: '',
    timeline: '',
  });

  const [leads, setLeads] = useState([]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitLead = async () => {
    try {
      await axios.post('http://localhost:3001/leads', {
        ...form,
        budget: Number(form.budget),
      });
      alert('Lead created!');
      setOpen(false);
      setForm({
        name: '',
        phone: '',
        budget: '',
        location: '',
        propertyType: '',
        timeline: '',
      });
      fetchLeads();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to create lead');
    }
  };

  const fetchLeads = async () => {
    try {
      const res = await axios.get('http://localhost:3001/leads/marketplace');
      setLeads(res.data);
    } catch (error) {
      console.error('Failed to fetch leads', error);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const buyLead = async (id: string) => {
    try {
      await axios.post(`http://localhost:3001/leads/${id}/purchase`);
      alert('Purchased!');
      fetchLeads();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to purchase lead');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      {/* Header */}
      <header className="max-w-7xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Marketer Dashboard
          </h1>
          <p className="text-gray-500 mt-1">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </p>
        </div>

        <button
          onClick={logout}
          className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-medium hover:bg-red-100 active:scale-95 transition"
        >
          Logout
        </button>
      </header>

      <div className="max-w-7xl mx-auto">
        {/* Create Lead */}
        <button
          onClick={() => setOpen(true)}
          className="mb-8 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium shadow hover:bg-blue-700 active:scale-95 transition"
        >
          + New Lead
        </button>

        {/* Modal */}
        {open && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg p-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">
                Create New Lead
              </h2>

              <div className="space-y-4">
                {[
                  ['name', 'Full Name'],
                  ['phone', 'Phone'],
                  ['budget', 'Budget'],
                  ['location', 'Location'],
                  ['propertyType', 'Property Type'],
                  ['timeline', 'Timeline'],
                ].map(([key, label]) => (
                  <input
                    key={key}
                    name={key}
                    placeholder={label}
                    value={form[key as keyof typeof form]}
                    onChange={handleChange}
                    className="w-full border rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ))}
              </div>

              <div className="flex justify-end gap-3 mt-8">
                <button
                  onClick={() => setOpen(false)}
                  className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
                <button
                  onClick={submitLead}
                  className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Marketplace */}
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Marketplace Leads
        </h2>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-500">
            No leads available.
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {leads.map((lead: any) => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-6 flex flex-col"
              >
                <div className="font-semibold text-gray-800 mb-1">
                  {lead.location} • {lead.propertyType}
                </div>

                <div className="text-sm text-gray-600 mb-6">
                  Budget: {lead.budget?.toLocaleString()}
                </div>

                <div className="mt-auto flex gap-3">
                  <button
                    onClick={() => buyLead(lead._id)}
                    className="flex-1 bg-emerald-600 text-white py-2.5 rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition"
                  >
                    Buy Lead
                  </button>

                  <button
                    onClick={() => navigate(`/deals/register/${lead._id}`)}
                    className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
                  >
                    Register Deal
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
