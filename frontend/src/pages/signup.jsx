import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


const API_URL = import.meta.env.BACKEND_PORT_URL || 'http://localhost:5000';

const Signup = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'user',
    adminKey: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')


  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleRoleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      role: e.target.value,
      adminKey: '',
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    // Validate admin key if admin role is selected
    if (formData.role === 'admin' && !formData.adminKey) {
      setError('Admin key is required for admin registration')
      setLoading(false)
      return
    }

    try {
      const response = await fetch(`${API_URL}/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Signup failed')
        setLoading(false)
        return
      }

      setSuccess(`${formData.role === 'admin' ? 'Admin' : 'User'} registration successful! Redirecting to login...`)
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        role: 'user',
        adminKey: '',
      })
      // Redirect to login after 2 seconds
      setTimeout(() => {
        window.location.href = '/login'
      }, 2000)
    } catch (err) {
      setError('Error connecting to server: ' + err.message)
    } finally {
      setLoading(false)
    }
  }
  const navigate = useNavigate()

  return (
    

    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
        <h2 className="text-3xl font-extrabold text-gray-900 text-center mb-6">
          Create Account
        </h2>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-green-100 border border-green-400 text-green-700 rounded">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* First Name Input */}
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Enter your first name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Last Name Input */}
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Enter your last name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Email Input */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email ID
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Role Selection - Radio Buttons */}
          <div className="border-t pt-4 mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              Select Role
            </label>
            <div className="space-y-2">
              <div className="flex items-center">
                {/* <input
                  type="radio"
                  id="user"
                  name="role"
                  value="user"
                  checked={formData.role === 'user'}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                /> */}
                {/* <label htmlFor="user" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  User
                </label> */}
              </div>
              <div className="flex items-center">
                <input
                  type="radio"
                  id="admin"
                  name="role"
                  value="admin"
                  checked={formData.role === 'admin'}
                  onChange={handleRoleChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <label htmlFor="admin" className="ml-2 text-sm text-gray-700 cursor-pointer">
                  Admin
                </label>
              </div>
            </div>
          </div>

          {/* Admin Key Input - Shown only when Admin is selected */}
          {formData.role === 'admin' && (
            <div>
              <label htmlFor="adminKey" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Key
              </label>
              <input
                type="password"
                id="adminKey"
                name="adminKey"
                value={formData.adminKey}
                onChange={handleChange}
                placeholder="Enter admin key"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          {/* Create Account Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6 ${
              loading
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            }`}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
          <button onClick={() => navigate('/')} 
           className="w-full font-semibold py-2 px-4 rounded-lg transition duration-200 mt-6 bg-blue-600 text-white hover:bg-blue-700" >Back</button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{' '}
          <button onClick={() => navigate('/login')} className="text-blue-600 hover:text-blue-700 font-medium">
            Login here
          </button>
         
        </p>
      </div>
    </div>
  )
}

export default Signup