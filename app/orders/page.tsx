"use client"

import { useState, useMemo, useCallback, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { AuthGuard } from "@/components/auth-guard"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { OrderDetailsDrawer } from "@/components/orders/order-details-drawer"
import { OrderList } from "@/components/orders/order-list"
import { OrderFiltersComponent } from "@/components/orders/order-filters"
import { useOrders } from "@/hooks/use-orders"
import { useOrderFilters } from "@/hooks/use-order-filters"
import type { Order } from "@/types/order"

export default function OrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const { orders, uniqueProtocols, uniqueStatuses, filterOrders } = useOrders()
  const { filters, updateSearch, updateProtocol, updateStatus } = useOrderFilters(uniqueStatuses)

  const filteredOrders = useMemo(() => filterOrders(filters), [filterOrders, filters])
  const selectedOrder = selectedOrderId ? orders.find((order) => order.id === selectedOrderId) || null : null

  // Handle URL parameters for direct access
  useEffect(() => {
    const orderParam = searchParams.get("id")
    if (orderParam) {
      const order = orders.find((o) => o.id === orderParam)
      if (order) {
        setSelectedOrderId(orderParam)
      }
    }
  }, [searchParams, orders])

  const handleOrderSelect = useCallback(
    (order: Order) => {
      setSelectedOrderId(order.id)
      // Update URL with order ID parameter
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("id", order.id)
      router.push(`/orders?${newSearchParams.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const handleCloseDrawer = useCallback(() => {
    setSelectedOrderId(null)
    // Remove order parameter from URL
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("id")
    const newUrl = newSearchParams.toString() ? `/orders?${newSearchParams.toString()}` : "/orders"
    router.push(newUrl, { scroll: false })
  }, [router, searchParams])

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Service Management</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Atendimentos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Atendimentos</h1>
              <Badge variant="secondary">{filteredOrders.length} atendimentos</Badge>
            </div>
            <OrderFiltersComponent
              filters={filters}
              uniqueProtocols={uniqueProtocols}
              uniqueStatuses={uniqueStatuses}
              onSearchChange={updateSearch}
              onProtocolChange={updateProtocol}
              onStatusChange={updateStatus}
            />
          </div>

          {/* Orders List - Full Width */}
          <div className="flex flex-col gap-4">
            <OrderList orders={filteredOrders} selectedOrder={selectedOrder} onOrderSelect={handleOrderSelect} />
          </div>
        </div>

        {/* Order Details Drawer - Fixed overlay */}
        {selectedOrder && <OrderDetailsDrawer order={selectedOrder} onClose={handleCloseDrawer} />}
      </SidebarInset>
    </SidebarProvider>
    </AuthGuard>
  )
}
