import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminLeadVerification() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3001/leads?status=new') // assume endpoint exists
      .then(res => {
        setLeads(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const verifyLead = async id => {
    try {
      await axios.post(`http://localhost:3001/leads/${id}/verify`)
      setLeads(leads.map(l => l._id === id ? { ...l, status: 'verified' } : l))
    } catch {
      alert('Failed to verify')
    }
  }

  if (loading) return <div className="p-8">Loading leads...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Lead Verification</h1>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {leads.length === 0 ? (
          <p className="p-8 text-gray-500">No new leads to verify</p>
        ) : (
          <div className="divide-y">
            {leads.map(lead => (
              <div key={lead._id} className="p-4 flex justify-between items-center">
                <div>
                  <div className="font-medium">{lead.location} • {lead.propertyType}</div>
                  <div className="text-sm text-gray-600">Budget: {lead.budget}</div>
                </div>
                <button
                  onClick={() => verifyLead(lead._id)}
                  className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
                >
                  Verify
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}