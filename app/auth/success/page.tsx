import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Loader2, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuthStore } from '@/store/useAuthStore'
import { authService } from '@/services/authServices'

export default function AuthSuccessPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const setUser = useAuthStore((state) => state.setUser)

  useEffect(() => {
    const processGoogleAuth = async () => {
      if (status === 'loading') return

      if (!session?.user) {
        setError('No user session found')
        setIsProcessing(false)
        return
      }

      try {
        // Prepare data for your backend
        const googleAuthData = {
          email: session.user.email!,
          name: session.user.name!,
          image: session.user.image || '',
          googleId: (session as any).user.googleId || '',
          role: 'STUDENT' // Default role
        }

        // Call your backend API
        const response = await authService.googleAuth(googleAuthData)
        
        // Update your auth store
        setUser(response.data.user)
        
        // Redirect to dashboard after successful processing
        setTimeout(() => {
          router.push('/dashboard')
        }, 2000)

      } catch (error: any) {
        console.error('Google auth processing failed:', error)
        setError(error.response?.data?.message || 'Authentication failed')
        setIsProcessing(false)
      }
    }

    processGoogleAuth()
  }, [session, status, router, setUser])

  if (status === 'loading' || isProcessing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full mb-6"></div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Setting up your account</h2>
          <p className="text-gray-600">Please wait while we process your Google authentication...</p>
          <div className="mt-6">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="flex items-center justify-center space-x-2">
                <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-700">Authenticating with Google</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-pink-100">
        <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="space-y-3">
            <button
              onClick={() => router.push('/auth/signin')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Try Again
            </button>
            <button
              onClick={() => router.push('/')}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-3 px-4 rounded-lg transition-colors"
            >
              Go Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-emerald-100">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full mx-4 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome!</h2>
        <p className="text-gray-600 mb-6">Your account has been successfully set up. Redirecting you to dashboard...</p>
        
        {session?.user && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="flex items-center space-x-3">
              {session.user.image && (
                <img 
                  src={session.user.image} 
                  alt="Profile" 
                  className="w-10 h-10 rounded-full"
                />
              )}
              <div className="text-left">
                <p className="font-semibold text-gray-900">{session.user.name}</p>
                <p className="text-sm text-gray-600">{session.user.email}</p>
              </div>
            </div>
          </div>
        )}

        <div className="text-sm text-gray-500">
          Redirecting in 2 seconds...
        </div>
      </div>
    </div>
  )
}