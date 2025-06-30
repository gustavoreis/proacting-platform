"use client"

import React from "react"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search } from "lucide-react"
import type { OrderFilters } from "@/types/order"
import { getStatusDisplayName } from "@/utils/order-utils"

interface OrderFiltersProps {
  filters: OrderFilters
  uniqueProtocols: string[]
  uniqueStatuses: string[]
  onSearchChange: (search: string) => void
  onProtocolChange: (protocol: string) => void
  onStatusChange: (status: string) => void
}

export const OrderFiltersComponent = React.memo<OrderFiltersProps>(
  ({ filters, uniqueProtocols, uniqueStatuses, onSearchChange, onProtocolChange, onStatusChange }) => {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar atendimentos..."
            value={filters.search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-8 w-64"
          />
        </div>
        <Select value={filters.protocol} onValueChange={onProtocolChange}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filtrar por protocolo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os protocolos</SelectItem>
            {uniqueProtocols.map((protocol) => (
              <SelectItem key={protocol} value={protocol}>
                {protocol}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filters.status} onValueChange={onStatusChange}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            {uniqueStatuses.map((status) => (
              <SelectItem key={status} value={status}>
                {getStatusDisplayName(status as any)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    )
  },
)

OrderFiltersComponent.displayName = "OrderFiltersComponent"
