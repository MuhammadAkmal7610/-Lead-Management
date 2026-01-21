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

  if (loading) return <div className="p-8">Loading...</div>
  if (!lead) return <div className="p-8 text-red-600">Lead not found</div>

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Lead Detail</h1>
      
      <div className="bg-white p-6 rounded-lg shadow space-y-4">
        <div><strong>Name:</strong> {lead.name || 'Masked'}</div>
        <div><strong>Phone:</strong> {lead.phone || '******'}</div>
        <div><strong>Location:</strong> {lead.location}</div>
        <div><strong>Type:</strong> {lead.propertyType}</div>
        <div><strong>Budget:</strong> PKR {lead.budget?.toLocaleString()}</div>
        <div><strong>Timeline:</strong> {lead.timeline}</div>
        <div><strong>Status:</strong> {lead.status}</div>
        
        {lead.purchasedBy && (
          <div className="mt-6 pt-6 border-t">
            <p className="text-green-600 font-semibold">You own this lead</p>
            <button className="mt-4 bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700">
              Register Deal →
            </button>
          </div>
        )}
      </div>
    </div>
  )
}