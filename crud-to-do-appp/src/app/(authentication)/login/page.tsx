'use client'
import { useState } from 'react'
import { signInWithEmailAndPassword } from 'firebase/auth'
import { auth } from '../../lib/firebase'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (error: unknown) {
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string }
        if (firebaseError.code === 'auth/user-not-found') {
          setError('No account found with this email')
        } else if (firebaseError.code === 'auth/wrong-password') {
          setError('Incorrect password')
        } else if (firebaseError.code === 'auth/invalid-email') {
          setError('Invalid email address')
        } else {
          setError('Failed to login. Please try again.')
        }
      } else {
        setError('Failed to login. Please try again.')
      }
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50">
      <div className="bg-yellow-100 border-2 border-black p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-3xl font-bold text-yellow-900 mb-6 text-center">Login</h1>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 border-2 border-red-600 text-red-800 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleLogin} className="space-y-4">
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
              placeholder="Enter your password"
              className="w-full border-2 border-black rounded px-3 py-2 bg-white text-yellow-900 focus:outline-none focus:ring-2 focus:ring-yellow-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            className="w-full bg-black text-yellow-400 py-2 rounded hover:bg-gray-800 transition font-medium"
            type="submit"
          >
            Login
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <button
            className="text-sm text-yellow-900 hover:text-yellow-700 font-medium"
            onClick={() => router.push('/register')}
          >
            Don&apos;t have an account? Register
          </button>
        </div>
      </div>
    </div>
  )
}
