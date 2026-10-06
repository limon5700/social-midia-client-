'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useRouter } from 'next/navigation'

interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  avatar?: string
}

interface AuthContextType {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (token: string, userData: User) => void
  registerAndLogin: (token: string, userData: User) => void
  logout: () => void
  checkAuth: () => Promise<void>
  updateUser: (userData: User) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      // Check authentication using cookies (no need to pass token in headers)
      const response = await fetch('/api/auth/me')

      if (response.ok) {
        const responseData = await response.json()
        setUser(responseData.data.user)
        setIsAuthenticated(true)
      } else {
        // Not authenticated
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoading(false)
    }
  }

  const login = (token: string, userData: User) => {
    // Token is stored in HTTP-only cookie by the server
    setUser(userData)
    setIsAuthenticated(true)
  }

  const registerAndLogin = (token: string, userData: User) => {
    // Token is stored in HTTP-only cookie by the server
    setUser(userData)
    setIsAuthenticated(true)
  }

  const logout = async () => {
    try {
      // Call logout API to clear server-side cookies
      await fetch('/api/auth/logout', {
        method: 'POST'
      })
    } catch (error) {
      console.error('Logout API call failed:', error)
    } finally {
      // Clear client-side state
    setUser(null)
    setIsAuthenticated(false)
    router.push('/auth')
    }
  }

  const updateUser = (userData: User) => {
    setUser(userData)
  }

  useEffect(() => {
    checkAuth()
  }, [])

  const value = {
    user,
    isAuthenticated,
    isLoading,
    login,
    registerAndLogin,
    logout,
    checkAuth,
    updateUser
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 