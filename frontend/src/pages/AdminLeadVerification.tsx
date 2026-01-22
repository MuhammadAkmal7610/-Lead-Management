 import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminLeadVerification() {
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get('http://localhost:3001/leads?status=new')
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading leads…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Lead Verification
        </h1>

        {leads.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-12 text-center text-gray-500">
            No new leads to verify
          </div>
        ) : (
          <div className="space-y-4">
            {leads.map(lead => (
              <div
                key={lead._id}
                className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Lead Info */}
                <div>
                  <div className="text-lg font-semibold text-gray-800">
                    {lead.location}{' '}
                    <span className="text-gray-400 font-normal">•</span>{' '}
                    {lead.propertyType}
                  </div>

                  <div className="text-sm text-gray-600 mt-1">
                    Budget:{' '}
                    <span className="font-medium text-gray-800">
                      {lead.budget}
                    </span>
                  </div>
                </div>

                {/* Action */}
                <button
                  onClick={() => verifyLead(lead._id)}
                  className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition"
                >
                  Verify Lead
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
