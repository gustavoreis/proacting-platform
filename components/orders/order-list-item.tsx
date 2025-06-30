"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Clock, User } from "lucide-react"
import type { Order } from "@/types/order"
import { getStatusColor, getStatusDisplayName, formatDate } from "@/utils/order-utils"

interface OrderListItemProps {
  order: Order
  isSelected: boolean
  onSelect: (order: Order) => void
}

export const OrderListItem = React.memo<OrderListItemProps>(({ order, isSelected, onSelect }) => {
  return (
    <div
      className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
        isSelected ? "bg-muted" : ""
      }`}
      onClick={() => onSelect(order)}
    >
      <div className="flex items-center gap-4 flex-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{order.id}</span>
            <Badge className={getStatusColor(order.status)}>{getStatusDisplayName(order.status)}</Badge>
          </div>
          <p className="text-sm text-muted-foreground">{order.protocol}</p>
        </div>
      </div>
      <div className="flex items-center gap-6 text-sm text-muted-foreground">
        <div className="flex items-center gap-1">
          <User className="h-4 w-4" />
          <span className="hidden sm:inline">{order.userName}</span>
        </div>
        <div className="flex items-center gap-1">
          <Clock className="h-4 w-4" />
          <span>{formatDate(order.date)}</span>
        </div>
      </div>
    </div>
  )
})

OrderListItem.displayName = "OrderListItem"
