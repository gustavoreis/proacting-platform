"use client"

import { useState, useEffect, useCallback } from "react"
import { fetchOrdersByPractitioner } from "@/lib/orders"
import { OrderFilters, Order } from "@/types/order"
import { groupLineItemsByOrder } from "@/lib/adapters"
import { useAuth } from "@/contexts/AuthContext"

export function useRealOrders() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchOrders = useCallback(async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const lineItems = await fetchOrdersByPractitioner(user.id)
      const adaptedOrders = groupLineItemsByOrder(lineItems)
      setOrders(adaptedOrders)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao buscar pedidos")
      console.error("Erro ao buscar pedidos:", err)
    } finally {
      setLoading(false)
    }
  }, [user?.id])

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filterOrders = useCallback((filters: OrderFilters) => {
    return orders.filter((order) => {
      const matchesSearch =
        !filters.search ||
        order.id.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.userName.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.service.toLowerCase().includes(filters.search.toLowerCase()) ||
        order.protocol.toLowerCase().includes(filters.search.toLowerCase())

      const matchesStatus = filters.status === "all" || order.status === filters.status
      const matchesProtocol = filters.protocol === "all" || order.protocol === filters.protocol

      return matchesSearch && matchesStatus && matchesProtocol
    })
  }, [orders])

  const getUniqueProtocols = useCallback(() => {
    return [...new Set(orders.map((order) => order.protocol))]
  }, [orders])

  const getUniqueStatuses = useCallback(() => {
    return [...new Set(orders.map(order => order.status))]
  }, [orders])

  const refreshOrders = useCallback(() => {
    fetchOrders()
  }, [fetchOrders])

  return {
    orders,
    loading,
    error,
    filterOrders,
    uniqueProtocols: getUniqueProtocols(),
    uniqueStatuses: getUniqueStatuses(),
    refreshOrders,
  }
} 