"use client"

import React, { createContext, useContext, useState, useEffect } from "react"
import { getUser, logout, User } from "@/lib/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
  login: () => void
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refreshUser = async () => {
    try {
      setLoading(true)
      setError(null)
      const userData = await getUser()
      setUser(userData)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao verificar autenticação")
      setUser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refreshUser()
  }, [])

  const handleLogin = () => {
    // Redirecionar para a página de login
    const authUrl = process.env.NODE_ENV === "development"
      ? process.env.NEXT_PUBLIC_AUTH_URL
      : "https://auth.proact.ing"
    
    window.location.href = `${authUrl}/login?redirect_to=${encodeURIComponent(window.location.href)}`
  }

  const handleLogout = async () => {
    try {
      await logout()
      setUser(null)
    } catch (err) {
      console.error("Erro ao fazer logout:", err)
    }
  }

  const value: AuthContextType = {
    user,
    loading,
    error,
    login: handleLogin,
    logout: handleLogout,
    refreshUser,
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
    throw new Error("useAuth deve ser usado dentro de um AuthProvider")
  }
  return context
}

// Hook para proteger rotas
export function useRequireAuth() {
  const { user, loading } = useAuth()
  
  useEffect(() => {
    if (!loading && !user) {
      const authUrl = process.env.NODE_ENV === "development"
        ? process.env.NEXT_PUBLIC_AUTH_URL
        : "https://auth.proact.ing"
      
      window.location.href = `${authUrl}/login?redirect_to=${encodeURIComponent(window.location.href)}`
    }
  }, [user, loading])

  return { user, loading }
} 