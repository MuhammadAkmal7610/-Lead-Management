 import { useState, useEffect } from 'react'
import axios from 'axios'
import useAuthStore from '../stores/authStore'

export default function LeadMarketplace() {
  const [leads, setLeads] = useState([])
  const { logout } = useAuthStore()

  useEffect(() => {
    axios.get('http://localhost:3001/leads/marketplace')
      .then(res => setLeads(res.data))
      .catch(() => {})
  }, [])

  const buy = (id: string) => {
    axios.post(`http://localhost:3001/leads/${id}/purchase`)
      .then(() => alert('Purchased!'))
      .catch(() => alert('Failed'))
  }

  return (
    <div className="p-6">
      <div className="flex justify-between mb-6">
        <h1 className="text-2xl font-bold">Marketplace</h1>
        <button onClick={logout} className="text-red-600">Logout</button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {leads.map(lead => (
          <div key={lead._id} className="bg-white p-5 rounded shadow">
            <div className="font-semibold mb-2">{lead.location} • {lead.propertyType}</div>
            <div className="text-sm text-gray-600 mb-3">
              Budget: {lead.budget?.toLocaleString()}
            </div>
            <button
              onClick={() => buy(lead._id)}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
            >
              Buy Lead
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}