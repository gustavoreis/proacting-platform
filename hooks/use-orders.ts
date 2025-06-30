"use client"

import { useAuth } from "@/contexts/AuthContext"
import { useRealOrders } from "./use-real-orders"
import { fetchPractitionerByLoginUserId } from "@/lib/sanity"
import { useState, useEffect } from "react"

export function useOrders() {
  const { user } = useAuth()
  const [practitionerId, setPractitionerId] = useState<string | undefined>()

  useEffect(() => {
    const fetchPractitioner = async () => {
      if (user?.id) {
        try {
          const practitioner = await fetchPractitionerByLoginUserId(user.id)
          setPractitionerId(practitioner._id)
        } catch (error) {
          console.error("Erro ao buscar practitioner:", error)
        }
      }
    }

    fetchPractitioner()
  }, [user?.id])

  return useRealOrders(practitionerId)
}
