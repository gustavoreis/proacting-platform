"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useSearchParams } from "next/navigation"
import type { OrderFilters } from "@/types/order"

export function useOrderFilters(uniqueStatuses: string[]) {
  const searchParams = useSearchParams()
  const [filters, setFilters] = useState<OrderFilters>({
    search: "",
    protocol: "all",
    status: "all",
  })

  const initializedRef = useRef(false)

  useEffect(() => {
    if (initializedRef.current) return

    const statusParam = searchParams.get("status")

    if (statusParam && uniqueStatuses.includes(statusParam)) {
      setFilters((prev) => ({ ...prev, status: statusParam }))
    }

    initializedRef.current = true
  }, [])

  useEffect(() => {
    if (!initializedRef.current) return

    const statusParam = searchParams.get("status")

    if (statusParam && uniqueStatuses.includes(statusParam)) {
      setFilters((prev) => {
        if (prev.status !== statusParam) {
          return { ...prev, status: statusParam }
        }
        return prev
      })
    } else {
      setFilters((prev) => {
        if (prev.status !== "all" || prev.protocol !== "all" || prev.search !== "") {
          return {
            search: "",
            protocol: "all",
            status: "all",
          }
        }
        return prev
      })
    }
  }, [searchParams, uniqueStatuses])

  const updateSearch = useCallback((search: string) => {
    setFilters((prev) => {
      if (prev.search !== search) {
        return { ...prev, search }
      }
      return prev
    })
  }, [])

  const updateProtocol = useCallback((protocol: string) => {
    setFilters((prev) => {
      if (prev.protocol !== protocol) {
        return { ...prev, protocol }
      }
      return prev
    })
  }, [])

  const updateStatus = useCallback((status: string) => {
    setFilters((prev) => {
      if (prev.status !== status) {
        return { ...prev, status }
      }
      return prev
    })
  }, [])

  const resetFilters = useCallback(() => {
    setFilters({
      search: "",
      protocol: "all",
      status: "all",
    })
  }, [])

  return {
    filters,
    updateSearch,
    updateProtocol,
    updateStatus,
    resetFilters,
  }
}
