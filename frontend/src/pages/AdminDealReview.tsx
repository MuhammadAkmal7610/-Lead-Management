import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminDealReview() {
  const [deals, setDeals] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    axios.get('http://localhost:3001/deals') // assume admin sees all
      .then(res => {
        setDeals(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (id:any, status:string) => {
    try {
      await axios.patch(`http://localhost:3001/deals/${id}/status`, { status })
      setDeals(deals.map(d => d._id === id ? { ...d, status } : d))
    } catch {
      alert('Failed to update')
    }
  }

  if (loading) return <div className="p-8">Loading...</div>

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Deal Review Panel</h1>
      
      <div className="bg-white rounded shadow divide-y">
        {deals.map(deal => (
          <div key={deal._id} className="p-4 flex justify-between items-center">
            <div>
              <div>Lead: {deal.lead?.location || 'N/A'}</div>
              <div className="text-sm text-gray-600">Status: {deal.status}</div>
            </div>
            <div className="space-x-2">
              {deal.status === 'registered' && (
                <>
                  <button onClick={() => updateStatus(deal._id, 'documents_uploaded')} className="bg-green-600 text-white px-4 py-1 rounded">
                    Documents Uploaded
                  </button>
                  <button onClick={() => updateStatus(deal._id, 'cancelled')} className="bg-red-600 text-white px-4 py-1 rounded">
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}