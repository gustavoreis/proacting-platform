"use client"

import type React from "react"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { X, Calendar, User, Mail, Phone, CheckCircle, Clock, AlertCircle, FileText, Edit3, Send } from "lucide-react"
import type { Order } from "@/types/order"
import { getStatusColor, getStatusDisplayName, formatDate } from "@/utils/order-utils"

interface OrderDetailsDrawerProps {
  order: Order
  onClose: () => void
}

function getStatusIcon(status: string) {
  switch (status.toLowerCase()) {
    case "completed":
      return <CheckCircle className="h-4 w-4 text-green-600" />
    case "in progress":
    case "design phase":
    case "testing":
      return <Clock className="h-4 w-4 text-blue-600" />
    case "review":
      return <AlertCircle className="h-4 w-4 text-yellow-600" />
    default:
      return <Clock className="h-4 w-4 text-gray-600" />
  }
}

export function OrderDetailsDrawer({ order, onClose }: OrderDetailsDrawerProps) {
  const [editableReport, setEditableReport] = useState(order.suggestedReport)

  const handleDeployReport = () => {
    // Here you would deploy the report to the user
    console.log("Deploying report to user:", editableReport)
    alert("Report deployed to user successfully!")
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-40 flex">
      {/* Dark Overlay - clicking anywhere on this will close the drawer */}
      <div className="absolute inset-0 bg-black/50 animate-in fade-in duration-300" onClick={handleOverlayClick} />

      {/* Drawer */}
      <div
        className="relative ml-auto bg-background border-l z-50 flex flex-col animate-in slide-in-from-right duration-300 shadow-2xl"
        style={{ width: "max(900px, 70vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">{order.id}</h2>
            <Badge className={getStatusColor(order.status)}>{getStatusDisplayName(order.status)}</Badge>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Order Data with Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Dados do Pedido & Timeline
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Serviço:</span>
                  <p className="font-medium">{order.service}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data do Pedido:</span>
                  <p className="font-medium">{formatDate(order.date)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Protocolo:</span>
                  <p className="font-medium">{order.protocol}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Status:</span>
                  <p className="font-medium">{getStatusDisplayName(order.status)}</p>
                </div>
              </div>
              <Separator />
              <div className="space-y-3">
                <h4 className="font-medium">Timeline</h4>
                {order.timeline.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    {getStatusIcon(item.status)}
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{item.status}</span>
                        <span className="text-xs text-muted-foreground">{formatDate(item.date)}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Data */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Dados do Usuário
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="font-medium">{order.userName}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.userEmail}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">{order.userPhone}</span>
              </div>
            </CardContent>
          </Card>

          {/* Lab Results */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Resultados Laboratoriais
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {Object.entries(order.labResults).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="capitalize">{key.replace(/([A-Z])/g, " $1").trim()}</span>
                    <span className="font-medium">{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Suggested Report */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Edit3 className="h-5 w-5" />
                  Relatório Sugerido
                </div>
                <div className="flex gap-2">
                  <Button onClick={handleDeployReport} className="flex items-center gap-2">
                    <Send className="h-4 w-4" />
                    Enviar para Usuário
                  </Button>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className="min-h-[120px] p-3 border rounded-md focus-within:ring-2 focus-within:ring-ring focus-within:border-ring transition-colors cursor-text"
                onClick={(e) => {
                  const target = e.currentTarget.querySelector("[contentEditable]") as HTMLElement
                  if (target) target.focus()
                }}
              >
                <div
                  contentEditable
                  suppressContentEditableWarning={true}
                  className="outline-none text-sm leading-relaxed min-h-[100px] prose prose-sm max-w-none"
                  style={{ whiteSpace: "pre-wrap" }}
                  onInput={(e) => {
                    const target = e.currentTarget
                    setEditableReport(target.textContent || "")
                  }}
                  onKeyDown={(e) => {
                    // Allow basic formatting shortcuts
                    if (e.metaKey || e.ctrlKey) {
                      if (e.key === "b") {
                        e.preventDefault()
                        document.execCommand("bold")
                      } else if (e.key === "i") {
                        e.preventDefault()
                        document.execCommand("italic")
                      }
                    }
                  }}
                  dangerouslySetInnerHTML={{ __html: editableReport }}
                />
                <div className="text-xs text-muted-foreground mt-2 opacity-60">
                  Clique para editar • Cmd+B para negrito • Cmd+I para itálico
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Finalizar Atendimento</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Solicitar Informações Adicionais
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
