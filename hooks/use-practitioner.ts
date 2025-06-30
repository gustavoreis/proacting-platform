"use client"

import { useState, useEffect } from "react"
import { fetchPractitionerByLoginUserId, type PractitionerType } from "@/lib/sanity"
import { updatePractitionerAction } from "@/app/actions"
import { useAuth } from "@/contexts/AuthContext"

export interface PractitionerFormData {
  _id: string
  prefix: string | null
  name: string
  email: string | null
  bio: string | null
  avatarUrl: string | null
  phoneNumber: string | null
}

export function usePractitioner() {
  const { user } = useAuth()
  const [practitioner, setPractitioner] = useState<PractitionerType | null>(null)
  const [loading, setLoading] = useState(true)
  const [updating, setUpdating] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchPractitioner = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const data = await fetchPractitionerByLoginUserId(user.id)
      setPractitioner(data)
    } catch (err) {
      console.error("Erro ao buscar profissional:", err)
      setError("Erro ao carregar dados do profissional")
    } finally {
      setLoading(false)
    }
  }

  const updatePractitionerData = async (updatedFields: {
    prefix?: string | null
    name?: string
    email?: string
    bio?: string | null
  }) => {
    if (!practitioner?._id) {
      throw new Error("Profissional não encontrado")
    }

    try {
      setUpdating(true)
      setError(null)
      
      const result = await updatePractitionerAction({
        _id: practitioner._id,
        prefix: updatedFields.prefix ?? practitioner.prefix,
        name: updatedFields.name ?? practitioner.name,
        email: updatedFields.email ?? practitioner.email ?? "",
        bio: updatedFields.bio ?? practitioner.bio,
      })

      if (!result.success) {
        throw new Error(result.error || "Erro ao atualizar")
      }

      // Atualizar estado local
      setPractitioner(prev => prev ? {
        ...prev,
        ...updatedFields
      } : prev)

      return { success: true }
    } catch (err) {
      console.error("Erro ao atualizar profissional:", err)
      setError("Erro ao salvar alterações")
      return { success: false, error: "Erro ao salvar alterações" }
    } finally {
      setUpdating(false)
    }
  }

  useEffect(() => {
    fetchPractitioner()
  }, [user?.id])

  return {
    practitioner,
    loading,
    updating,
    error,
    updatePractitionerData,
    refetch: fetchPractitioner,
  }
} 