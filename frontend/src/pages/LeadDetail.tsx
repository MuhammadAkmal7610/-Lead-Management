 import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'

export default function LeadDetail() {
  const { id } = useParams()
  const [lead, setLead] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`http://localhost:3001/leads/detail`)
      .then(res => {
        setLead(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading lead details…
      </div>
    )
  }

  if (!lead) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        Lead not found
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Lead Detail
        </h1>

        <div className="bg-white rounded-2xl shadow-sm p-8 space-y-6">
          {/* Lead Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-gray-500">Name</p>
              <p className="font-medium text-gray-800">
                {lead.name || 'Masked'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Phone</p>
              <p className="font-medium text-gray-800">
                {lead.phone || '******'}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium text-gray-800">
                {lead.location}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Property Type</p>
              <p className="font-medium text-gray-800">
                {lead.propertyType}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Budget</p>
              <p className="font-medium text-gray-800">
                PKR {lead.budget?.toLocaleString()}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Timeline</p>
              <p className="font-medium text-gray-800">
                {lead.timeline}
              </p>
            </div>
          </div>

          {/* Status */}
          <div>
            <span
              className={`inline-block px-4 py-1.5 rounded-full text-sm font-medium
                ${
                  lead.status === 'verified'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'bg-blue-100 text-blue-700'
                }
              `}
            >
              {lead.status}
            </span>
          </div>

          {/* Ownership Section */}
          {lead.purchasedBy && (
            <div className="pt-6 border-t">
              <p className="text-emerald-600 font-semibold mb-4">
                You own this lead
              </p>

              <button className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 active:scale-95 transition">
                Register Deal →
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
