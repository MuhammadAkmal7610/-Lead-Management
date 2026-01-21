import { useState, useEffect } from 'react';
import axios from 'axios';
import useAuthStore from '../stores/authStore';
import { useNavigate } from 'react-router-dom';

export default function MarketerDashboard() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  /** Lead creation state */
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: '',
    phone: '',
    budget: '',
    location: '',
    propertyType: '',
    timeline: '',
  });

  /** Marketplace leads state */
  const [leads, setLeads] = useState([]);

  /** Handle form change */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  /** Submit new lead */
  const submitLead = async () => {
    try {
      await axios.post('http://localhost:3001/leads', {
          //leadId:leads[0]?._id,
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

      // Refresh marketplace after creation
      fetchLeads();
    } catch (error: any) {
      console.error(error);
      alert(error.response?.data?.message || 'Failed to create lead');
    }
  };

  /** Fetch marketplace leads */
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

  /** Purchase a lead */
  const buyLead = async (id: string) => {
    try {
      await axios.post(`http://localhost:3001/leads/${id}/purchase`);
      alert('Purchased!');
      fetchLeads(); // refresh leads after purchase
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to purchase lead');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <header className="flex justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Marketer Dashboard</h1>
          <p className="text-gray-600">
            Welcome back{user?.name ? `, ${user.name}` : ''}
          </p>
        </div>
        <button onClick={logout} className="text-red-600">
          Logout
        </button>
      </header>

      {/* Create Lead */}
      <button
        onClick={() => setOpen(true)}
        className="bg-blue-600 text-white px-6 py-2 rounded mb-6"
      >
        + New Lead
      </button>

      {/* Modal for Creating Lead */}
      {open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-lg">
            <h2 className="text-xl font-semibold mb-4">Create New Lead</h2>

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
                className="w-full border p-2 rounded mb-3"
              />
            ))}

            <div className="flex justify-end gap-3">
              <button onClick={() => setOpen(false)}>Cancel</button>
              <button
                onClick={submitLead}
                className="bg-blue-600 text-white px-4 py-2 rounded"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Marketplace */}
      <h2 className="text-2xl font-bold mb-4">Marketplace Leads</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leads.length === 0 && <p>No leads available.</p>}
        {leads.map((lead: any) => (
          <div key={lead._id} className="bg-white p-5 rounded shadow">
            <div className="font-semibold mb-2">
              {lead.location} • {lead.propertyType}
            </div>
            <div className="text-sm text-gray-600 mb-3">
              Budget: {lead.budget?.toLocaleString()}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => buyLead(lead._id)}
                className="flex-1 bg-green-600 text-white py-2 rounded hover:bg-green-700"
              >
                Buy Lead
              </button>
              <button
                onClick={() => navigate(`/deals/register/${lead._id}`)}
                className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
              >
                Register Deal
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
