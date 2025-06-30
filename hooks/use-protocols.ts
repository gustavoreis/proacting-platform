"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRealProtocols } from "./use-real-protocols"

export function useProtocols() {
  const { user } = useAuth()
  
  return useRealProtocols(user?.id)
}
