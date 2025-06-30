"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchTrackData, fetchTrackById, TrackType } from "@/lib/sanity"
import { Protocol } from "@/types/protocol"
import { adaptTrackToProtocol } from "@/lib/adapters"

export function useRealProtocols(loginUserId?: string) {
  const [protocols, setProtocols] = useState<Protocol[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchProtocols = useCallback(async () => {
    if (!loginUserId) return

    try {
      setLoading(true)
      setError(null)
      const trackData = await fetchTrackData(loginUserId)
      const adaptedProtocols = trackData.map(adaptTrackToProtocol)
      setProtocols(adaptedProtocols)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar protocolos")
      console.error("Erro ao buscar protocolos:", err)
    } finally {
      setLoading(false)
    }
  }, [loginUserId])

  useEffect(() => {
    fetchProtocols()
  }, [fetchProtocols])

  const getProtocolById = useCallback(async (trackId: string): Promise<TrackType | null> => {
    try {
      const track = await fetchTrackById(trackId)
      return track
    } catch (err) {
      console.error("Erro ao buscar protocolo:", err)
      return null
    }
  }, [])

  const filterProtocols = useCallback((filters: { search: string; status: string }) => {
    return protocols.filter((protocol) => {
      const matchesSearch =
        !filters.search ||
        protocol.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        protocol.description.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === "all" || protocol.status === filters.status

      return matchesSearch && matchesStatus
    })
  }, [protocols])

  const getUniqueStatuses = useCallback(() => {
    return [...new Set(protocols.map((protocol) => protocol.status))]
  }, [protocols])

  const refreshProtocols = useCallback(() => {
    fetchProtocols()
  }, [fetchProtocols])

  // Estatísticas dos protocolos
  const getProtocolStats = useCallback(() => {
    const total = protocols.length
    const active = protocols.filter(p => p.status === "active").length
    const draft = protocols.filter(p => p.status === "draft").length
    const inactive = protocols.filter(p => p.status === "inactive").length

    return {
      total,
      active,
      draft,
      inactive,
    }
  }, [protocols])

  return {
    protocols,
    loading,
    error,
    filterProtocols,
    uniqueStatuses: getUniqueStatuses(),
    refreshProtocols,
    getProtocolById,
    stats: getProtocolStats(),
  }
} 