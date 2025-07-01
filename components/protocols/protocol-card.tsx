"use client"

import React from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Image from "next/image"
import type { Protocol } from "@/types/protocol"
import { Button } from "@/components/ui/button"

interface ProtocolCardProps {
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
    draft: "Rascunho",
    inactive: "Inativo",
  }

  return statusMap[status] || status
}

// Format price range in BRL
const formatPriceRange = (priceRange: { min: number; max: number }) => {
  return `R$ ${priceRange.min} - ${priceRange.max}`
}

export const ProtocolCard = React.memo<ProtocolCardProps>(({ protocol, onProtocolClick }) => {
  const protocolImage = getProtocolImage(protocol.id)
  const categoryBadgeStyle = getCategoryBadgeStyle(protocol.category)
  const statusDotStyle = getStatusDotStyle(protocol.status)
  const statusDisplayText = getStatusDisplayText(protocol.status)
  const priceRangeText = formatPriceRange(protocol.priceRange)

  const handleCardClick = () => {
    onProtocolClick(protocol.id)
  }

  const handleButtonClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onProtocolClick(protocol.id)
  }

  return (
    <Card
      className="group transition-all duration-300 cursor-pointer overflow-hidden shadow-sm border border-gray-200/60"
      onClick={handleCardClick}
    >
      {/* Header Section with Blurred Background - reduced height */}
      <div className="relative h-10 overflow-hidden">
        {/* Blurred Background Image */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-110 blur-md opacity-70"
          style={{
            backgroundImage: `url(${protocolImage})`,
            filter: "blur(8px) saturate(1.2)",
          }}
        />

        {/* Additional overlay for color diffusion */}
        <div className="absolute inset-0 bg-white/20" />

        {/* Ver detalhes button - positioned over header image */}
        <Button
          variant="secondary"
          size="sm"
          className="absolute top-1 right-2 bg-gray-100 text-gray-700 hover:bg-gray-200 text-xs px-2 py-1 h-auto opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10"
          onClick={handleButtonClick}
        >
          Ver detalhes
        </Button>
      </div>

      {/* Icon Container - positioned to overlap header and content */}
      <div className="relative -mt-6 ml-4 z-10 w-fit">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 relative overflow-hidden w-12 h-12">
          <Image
            src={protocolImage || "/placeholder.svg"}
            alt={protocol.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
      </div>

      {/* Content Section */}
      <CardHeader className="pt-4 pb-3">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CardTitle className="text-lg font-semibold">{protocol.name}</CardTitle>
            {/* Status Badge with Dot Style */}
            <div className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 ${statusDotStyle.textColor}`}>
              <div className={`w-2 h-2 rounded-full ${statusDotStyle.dotColor}`} />
              <span className="text-xs font-medium">{statusDisplayText}</span>
            </div>
          </div>
          <Badge className={`w-fit text-xs font-medium border-0 ${categoryBadgeStyle}`}>{protocol.category}</Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <CardDescription className="text-sm text-muted-foreground mb-6 line-clamp-2">
          {protocol.description}
        </CardDescription>

        {/* Stats */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <span>
            <span className="font-semibold text-foreground">{protocol.tests}</span> biomarcadores
          </span>
          <span>•</span>
          <span>
            <span className="font-semibold text-foreground">{priceRangeText}</span>
          </span>
        </div>
      </CardContent>
    </Card>
  )
})

ProtocolCard.displayName = "ProtocolCard"
