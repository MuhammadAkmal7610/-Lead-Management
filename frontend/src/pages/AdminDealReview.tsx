 import { useState, useEffect } from 'react'
import axios from 'axios'

export default function AdminDealReview() {
  const [deals, setDeals] = useState<[]>([])
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    axios.get('http://localhost:3001/deals')
      .then(res => {
        setDeals(res.data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const updateStatus = async (id: any, status: string) => {
    try {
      await axios.patch(`http://localhost:3001/deals/${id}/status`, { status })
      setDeals(deals.map(d => d._id === id ? { ...d, status } : d))
    } catch {
      alert('Failed to update')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading deals…
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Deal Review Panel
        </h1>

        <div className="space-y-4">
          {deals.map(deal => (
            <div
              key={deal._id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4"
            >
              {/* Deal Info */}
              <div>
                <div className="text-lg font-semibold text-gray-800">
                  Lead Location:{' '}
                  <span className="font-normal">
                    {deal.lead?.location || 'N/A'}
                  </span>
                </div>

                <span
                  className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium
                    ${
                      deal.status === 'registered'
                        ? 'bg-blue-100 text-blue-700'
                        : deal.status === 'documents_uploaded'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-700'
                    }
                  `}
                >
                  {deal.status}
                </span>
              </div>

              {/* Actions */}
              {deal.status === 'registered' && (
                <div className="flex gap-3">
                  <button
                    onClick={() =>
                      updateStatus(deal._id, 'documents_uploaded')
                    }
                    className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 active:scale-95 transition"
                  >
                    Documents Uploaded
                  </button>

                  <button
                    onClick={() => updateStatus(deal._id, 'cancelled')}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-red-700 active:scale-95 transition"
                  >
                    Cancel
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {deals.length === 0 && (
          <div className="text-center text-gray-500 mt-12">
            No deals available
          </div>
        )}
      </div>
    </div>
  )
}
