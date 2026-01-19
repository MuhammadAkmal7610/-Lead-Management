import { useState } from 'react'
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'

export default function DealRegister() {
  const { leadId } = useParams()
  const [notes, setNotes] = useState('')
  const [isHot, setIsHot] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await axios.post('http://localhost:3001/deals', {
        leadId,
        notes,
        isHot
      })
      alert('Deal registered!')
      navigate('/my-deals')  
    } catch {
      alert('Failed to register deal')
    }
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <h1 className="text-2xl font-bold mb-6">Register Deal</h1>
      
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow space-y-5">
        <div>
          <label className="block mb-2 font-medium">Notes</label>
          <textarea
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full p-3 border rounded h-32"
            placeholder="Additional details about the deal..."
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            checked={isHot}
            onChange={e => setIsHot(e.target.checked)}
            className="mr-2"
          />
          <label>Mark as Hot Lead (High Priority)</label>
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded hover:bg-green-700"
        >
          Register Deal
        </button>
      </form>
    </div>
  )
}