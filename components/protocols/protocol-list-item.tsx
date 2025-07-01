"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import type { Protocol } from "@/types/protocol"

interface ProtocolListItemProps {
  protocol: Protocol
  onProtocolClick: (protocolId: string) => void
}

// Map protocol IDs to their respective images
const getProtocolImage = (protocolId: string) => {
  const imageMap: Record<string, string> = {
    "PROT-001": "/images/mens-fertility.png", // Fertilidade Masculina
    "PROT-002": "/images/female-fertility.png", // Fertilidade Feminina
    "PROT-003": "/images/menopause.png", // Menopausa Saudável
    "PROT-004": "/images/anti-inflammatory.png", // Anti-inflamatória
    "PROT-005": "/images/energy-vitality.png", // Energia & Vitalidade
    "PROT-006": "/images/digestive-health.png", // Digestão Saudável
  }

  return imageMap[protocolId] || "/images/energy-vitality.png"
}

// Map protocol categories to colored badge styles
const getCategoryBadgeStyle = (category: string) => {
  const categoryStyles: Record<string, string> = {
    Fertilidade: "bg-green-100 text-green-800 hover:bg-green-100",
    Hormonal: "bg-purple-100 text-purple-800 hover:bg-purple-100",
    Nutrição: "bg-orange-100 text-orange-800 hover:bg-orange-100",
    Metabolismo: "bg-blue-100 text-blue-800 hover:bg-blue-100",
    Digestão: "bg-teal-100 text-teal-800 hover:bg-teal-100",
  }

  return categoryStyles[category] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

// Map status to dot badge styles
const getStatusDotStyle = (status: string) => {
  const statusStyles: Record<string, { dotColor: string; textColor: string }> = {
    active: { dotColor: "bg-green-500", textColor: "text-green-700" },
    draft: { dotColor: "bg-yellow-500", textColor: "text-yellow-700" },
    inactive: { dotColor: "bg-red-500", textColor: "text-red-700" },
  }

  return statusStyles[status] || { dotColor: "bg-gray-500", textColor: "text-gray-700" }
}

// Map status to display text
const getStatusDisplayText = (status: string) => {
  const statusMap: Record<string, string> = {
    active: "Publicado",
    published: "Publicado",
    draft: "Rascunho",
    inactive: "Inativo",
    waiting_list: "Lista de Espera",
    archived: "Arquivado",
    hidden: "Oculto",
    deleted: "Excluído",
  }

  return statusMap[status] || status
}

// Format price range in BRL
const formatPriceRange = (priceRange: { min: number; max: number }) => {
  return `R$ ${priceRange.min} - ${priceRange.max}`
}

export const ProtocolListItem = React.memo<ProtocolListItemProps>(({ protocol, onProtocolClick }) => {
  const protocolImage = getProtocolImage(protocol.id)
  const categoryBadgeStyle = getCategoryBadgeStyle(protocol.category)
  const statusDotStyle = getStatusDotStyle(protocol.status)
  const statusDisplayText = getStatusDisplayText(protocol.status)
  const priceRangeText = formatPriceRange(protocol.priceRange)

  const handleClick = () => {
    onProtocolClick(protocol.id)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onProtocolClick(protocol.id)
  }

  return (
    <div
      className="flex items-start justify-between p-4 hover:bg-muted/50 cursor-pointer transition-colors min-h-[80px]"
      onClick={handleClick}
    >
      <div className="flex items-start gap-4 flex-1">
        {/* Protocol Image */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden w-16 h-16 flex-shrink-0">
          <Image
            src={protocolImage || "/placeholder.svg"}
            alt={protocol.name}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start gap-2 mb-2">
            <h3 className="font-semibold text-lg leading-tight">{protocol.name}</h3>
            {/* Status Badge with Dot Style */}
            <div
              className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 ${statusDotStyle.textColor} flex-shrink-0`}
            >
              <div className={`w-2 h-2 rounded-full ${statusDotStyle.dotColor}`} />
              <span className="text-xs font-medium">{statusDisplayText}</span>
            </div>
          </div>

          <div className="flex items-center gap-2 mb-2">
            <Badge className={`text-xs font-medium border-0 ${categoryBadgeStyle}`}>{protocol.category}</Badge>
          </div>

          <p className="text-sm text-muted-foreground line-clamp-2">{protocol.description}</p>
        </div>
      </div>

      <div className="flex items-center gap-6 text-sm flex-shrink-0 ml-4">
        <div className="text-center">
          <p className="text-muted-foreground">Biomarcadores</p>
          <p className="font-medium">{protocol.tests}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Duração</p>
          <p className="font-medium">{protocol.duration}</p>
        </div>
        <div className="text-center">
          <p className="text-muted-foreground">Preço</p>
          <p className="font-bold text-primary">{priceRangeText}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={handleButtonClick}>
          Ver Detalhes
        </Button>
      </div>
    </div>
  )
})

ProtocolListItem.displayName = "ProtocolListItem"
