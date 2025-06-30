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

  // Use ref to track if we've initialized from URL params
  const initializedRef = useRef(false)

  // Initialize filters from URL params only once
  useEffect(() => {
    if (initializedRef.current) return

    const statusParam = searchParams.get("status")

    if (statusParam && uniqueStatuses.includes(statusParam)) {
      setFilters((prev) => ({ ...prev, status: statusParam }))
    }

    initializedRef.current = true
  }, []) // Remove uniqueStatuses and searchParams from dependencies

  // Handle URL changes after initialization
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
      // Reset filters when no status parameter
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
