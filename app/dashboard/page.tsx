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
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Clock, User, Search } from "lucide-react"
import { OrderDetailsDrawer } from "@/components/orders/order-details-drawer"
import { useOrders } from "@/hooks/use-orders"
import { getStatusColor, getStatusDisplayName, formatDate } from "@/utils/order-utils"
import type { Order } from "@/types/order"

export default function DashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [protocolFilter, setProtocolFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  const { orders, uniqueProtocols, uniqueStatuses } = useOrders()
  const selectedOrder = selectedOrderId ? orders.find((order) => order.id === selectedOrderId) : null

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

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.protocol.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesProtocol = protocolFilter === "all" || order.protocol === protocolFilter
      const matchesStatus = statusFilter === "all" || order.status === statusFilter

      return matchesSearch && matchesProtocol && matchesStatus
    })
  }, [orders, searchTerm, protocolFilter, statusFilter])

  const handleOrderClick = useCallback(
    (order: Order) => {
      setSelectedOrderId(order.id)
      // Update URL with order ID parameter
      const newSearchParams = new URLSearchParams(searchParams.toString())
      newSearchParams.set("id", order.id)
      router.push(`/dashboard?${newSearchParams.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const handleCloseDrawer = useCallback(() => {
    setSelectedOrderId(null)
    // Remove order parameter from URL
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("id")
    const newUrl = newSearchParams.toString() ? `/dashboard?${newSearchParams.toString()}` : "/dashboard"
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
                  <BreadcrumbLink href="#">Gerenciamento</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Dashboard</h1>
              <Badge variant="secondary">{filteredOrders.length} atendimentos</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar atendimentos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <Select value={protocolFilter} onValueChange={setProtocolFilter}>
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
              <Select value={statusFilter} onValueChange={setStatusFilter}>
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
          </div>

          {/* Orders List */}
          <div className="flex flex-col gap-4">
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredOrders.map((order) => (
                    <div
                      key={order.id}
                      className={`flex items-center justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors ${
                        selectedOrder?.id === order.id ? "bg-muted" : ""
                      }`}
                      onClick={() => handleOrderClick(order)}
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
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Order Details Drawer - Fixed overlay */}
        {selectedOrder && <OrderDetailsDrawer order={selectedOrder} onClose={handleCloseDrawer} />}
      </SidebarInset>
    </SidebarProvider>
    </AuthGuard>
  )
}
