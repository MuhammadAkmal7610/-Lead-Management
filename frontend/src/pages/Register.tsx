 import { useState } from 'react'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('broker')
  const navigate = useNavigate()

  const handleSubmit = async (e:any) => {
    console.log(email, password, role,'form da');
    
    e.preventDefault()
    try {
      await axios.post('http://localhost:3001/auth/register', { email, password, role })
      navigate('/login')
    } catch {
      alert('Registration failed')
    }
  }

  return (
    <div className="min-h-screen grid place-items-center bg-gradient-to-br from-gray-100 to-gray-200 px-4">
  <form
    onSubmit={handleSubmit}
    className="w-full max-w-md bg-white rounded-xl shadow-xl p-8 space-y-5"
  >
    {/* Header */}
    <div className="text-center mb-6">
      <h2 className="text-3xl font-semibold text-gray-800">Create your account</h2>
      <p className="text-sm text-gray-500 mt-1">
        Join <span className="font-medium text-gray-700">PropNest</span> today
      </p>
    </div>

    {/* Email */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Email address
      </label>
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        placeholder="you@example.com"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
        required
      />
    </div>

    {/* Password */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Password
      </label>
      <input
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        placeholder="Create a strong password"
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
        required
      />
    </div>

    {/* Role */}
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        Account type
      </label>
      <select
        value={role}
        onChange={e => setRole(e.target.value)}
        className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm bg-white focus:border-green-500 focus:ring-2 focus:ring-green-500/20 outline-none"
      >
        <option value="broker">Broker</option>
        <option value="marketer">Marketer</option>
         <option value="admin">admin</option>
      </select>
    </div>

    {/* Submit */}
    <button
      type="submit"
      className="w-full rounded-lg bg-green-600 py-2.5 text-sm font-medium text-white hover:bg-green-700 focus:ring-2 focus:ring-green-500/30 transition"
    >
      Create Account
    </button>

    {/* Footer */}
    <p className="text-center text-sm text-gray-600 mt-4">
      Already have an account?{" "}
      <a href="/login" className="font-medium text-green-600 hover:underline">
        Sign in
      </a>
    </p>
  </form>
</div>

  )
}