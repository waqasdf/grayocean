import React, { createContext, useState, useContext, useEffect, useCallback } from 'react'
import { db } from '@/api/localClient'

const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoadingAuth, setIsLoadingAuth] = useState(true)
  const [isLoadingPublicSettings, setIsLoadingPublicSettings] = useState(true)
  const [authError, setAuthError] = useState(null)
  const [appPublicSettings, setAppPublicSettings] = useState(null)

  const checkUserAuth = useCallback(async () => {
    try {
      setIsLoadingAuth(true)
      const currentUser = await db.auth.me()
      setUser(currentUser)
      setIsAuthenticated(true)
      setAuthError(null)
    } catch {
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setIsLoadingAuth(false)
    }
  }, [])

  const checkAppState = useCallback(async () => {
    try {
      setIsLoadingPublicSettings(true)
      setAuthError(null)
      setAppPublicSettings({ id: 'local', public_settings: {} })
      setIsLoadingPublicSettings(false)
      await checkUserAuth()
    } catch (error) {
      console.error('Unexpected error:', error)
      setAuthError({
        type: 'unknown',
        message: error.message || 'An unexpected error occurred',
      })
      setIsLoadingPublicSettings(false)
      setIsLoadingAuth(false)
    }
  }, [checkUserAuth])

  useEffect(() => {
    checkAppState()
  }, [checkAppState])

  const login = async ({ email, password, full_name, company } = {}) => {
    const next = await db.auth.login({ email, password, full_name, company })
    setUser(next)
    setIsAuthenticated(true)
    setAuthError(null)
    return next
  }

  const logout = (shouldRedirect = true) => {
    setUser(null)
    setIsAuthenticated(false)
    if (shouldRedirect) {
      db.auth.logout('/')
    } else {
      db.auth.logout()
    }
  }

  const navigateToLogin = () => {
    if (typeof window !== 'undefined') {
      window.location.href = '/login'
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoadingAuth,
        isLoadingPublicSettings,
        authError,
        appPublicSettings,
        login,
        logout,
        navigateToLogin,
        checkAppState,
        checkUserAuth,
        authChecked: !isLoadingAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
