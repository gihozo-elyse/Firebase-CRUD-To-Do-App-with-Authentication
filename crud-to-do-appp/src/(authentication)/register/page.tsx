'use client'
import { useState } from 'react'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const router = useRouter()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (password.length < 6) {
      alert('Password must be at least 6 characters')
      return
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password)
      alert('Account created successfully! Please login.')
      router.push('/login')
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Email is already registered')
      } else if (error.code === 'auth/invalid-email') {
        alert('Invalid email address')
      } else {
        alert('Failed to create account. Please try again.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-yellow-100 border-2 border-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-900 mb-6 text-center">Register</h1>
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-1">
              Email
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-yellow-900 mb-1">
              Password
            </label>
            <input
              type="password"
              placeholder="Enter your password (min. 6 characters)"
              className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <p className="text-xs text-yellow-900 mt-1">Password must be at least 6 characters</p>
          </div>
          <button
            className="w-full bg-black text-yellow-400 py-2 rounded hover:bg-gray-800 transition font-medium"
            type="submit"
          >
            Sign Up
          </button>
        </form>
        <div className="mt-4 text-center">
          <button
            className="text-sm text-yellow-900 hover:text-yellow-700 font-medium"
            onClick={() => router.push('/login')}
          >
            Already have an account? Login
          </button>
        </div>
      </div>
    </div>
  )
}
