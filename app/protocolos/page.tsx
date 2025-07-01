"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
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
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Grid3X3, List, Search, Plus } from "lucide-react"
import { ProtocolCard } from "@/components/protocols/protocol-card"
import { ProtocolListItem } from "@/components/protocols/protocol-list-item"
import { ProtocolDetailDrawer } from "@/components/protocols/protocol-detail-drawer"
import { useProtocols } from "@/hooks/use-protocols"

type ViewMode = "grid" | "list"

export default function ProtocolosPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [viewMode, setViewMode] = useState<ViewMode>("grid")
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProtocolId, setSelectedProtocolId] = useState<string | null>(null)
  const { protocols, filterProtocols, getProtocolById } = useProtocols()

  const filteredProtocols = useMemo(() => 
    filterProtocols({ search: searchTerm, status: "all" }), 
    [filterProtocols, searchTerm]
  )
  const selectedProtocol = selectedProtocolId ? 
    protocols.find(p => p.id === selectedProtocolId) || null : null

  // Handle URL parameters for direct access
  useEffect(() => {
    const protocolParam = searchParams.get("id")
    if (protocolParam) {
      const protocol = protocols.find(p => p.id === protocolParam)
      if (protocol) {
        setSelectedProtocolId(protocolParam)
      }
    }
  }, [searchParams, protocols])

  const handleViewModeChange = (value: string) => {
    if (value === "grid" || value === "list") {
      setViewMode(value)
    }
  }

  const handleProtocolClick = (protocolId: string) => {
    // Se o ID não começar com "PROT-", é um protocolo real do Sanity
    // Redireciona para página específica
    if (!protocolId.startsWith("PROT-")) {
      router.push(`/protocolos/${protocolId}`)
      return
    }

    // Para protocolos mock, usa o drawer
    setSelectedProtocolId(protocolId)
    // Update URL with protocol ID parameter
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.set("id", protocolId)
    router.push(`/protocolos?${newSearchParams.toString()}`, { scroll: false })
  }

  const handleCloseDrawer = () => {
    setSelectedProtocolId(null)
    // Remove protocol parameter from URL
    const newSearchParams = new URLSearchParams(searchParams.toString())
    newSearchParams.delete("id")
    const newUrl = newSearchParams.toString() ? `/protocolos?${newSearchParams.toString()}` : "/protocolos"
    router.push(newUrl, { scroll: false })
  }

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
                  <BreadcrumbPage>Protocolos</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          {/* Header Actions */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h1 className="text-xl font-semibold">Protocolos</h1>
              <Badge variant="secondary">{filteredProtocols.length} protocolos</Badge>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Buscar protocolos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8 w-64"
                />
              </div>
              <ToggleGroup type="single" value={viewMode} onValueChange={handleViewModeChange} aria-label="View mode">
                <ToggleGroupItem value="grid" aria-label="Grid view">
                  <Grid3X3 className="h-4 w-4" />
                </ToggleGroupItem>
                <ToggleGroupItem value="list" aria-label="List view">
                  <List className="h-4 w-4" />
                </ToggleGroupItem>
              </ToggleGroup>
              <Button variant="secondary" asChild>
                <Link href="/protocolos/novo">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Protocolo
                </Link>
              </Button>
            </div>
          </div>

          {/* Content */}
          {viewMode === "grid" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProtocols.map((protocol) => (
                <ProtocolCard key={protocol.id} protocol={protocol} onProtocolClick={handleProtocolClick} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="divide-y">
                  {filteredProtocols.map((protocol) => (
                    <ProtocolListItem key={protocol.id} protocol={protocol} onProtocolClick={handleProtocolClick} />
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Protocol Detail Drawer - Fixed overlay */}
        {selectedProtocol && <ProtocolDetailDrawer protocol={selectedProtocol} onClose={handleCloseDrawer} />}
      </SidebarInset>
    </SidebarProvider>
    </AuthGuard>
  )
}
