"use client"

import React from "react"
import { Card, CardContent } from "@/components/ui/card"
import { OrderListItem } from "./order-list-item"
import type { Order } from "@/types/order"

interface OrderListProps {
  orders: Order[]
  selectedOrder: Order | null
  onOrderSelect: (order: Order) => void
}

export const OrderList = React.memo<OrderListProps>(({ orders, selectedOrder, onOrderSelect }) => {
  return (
    <Card>
      <CardContent className="p-0">
        <div className="divide-y">
          {orders.map((order) => (
            <OrderListItem
              key={order.id}
              order={order}
              isSelected={selectedOrder?.id === order.id}
              onSelect={onOrderSelect}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
})

OrderList.displayName = "OrderList"
