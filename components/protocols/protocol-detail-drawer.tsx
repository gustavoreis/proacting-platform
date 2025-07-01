"use client"
import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  X,
  TestTube,
  DollarSign,
  Calendar,
  Edit3,
  Save,
  Plus,
  Trash2,
  FileText,
  HelpCircle,
  Workflow,
  BookOpen,
} from "lucide-react"
import Image from "next/image"
import type { Protocol, Biomarker, FAQ, HowItWorksStep } from "@/types/protocol"
import type React from "react"

interface ProtocolDetailDrawerProps {
  protocol: Protocol
  onClose: () => void
}

// Map protocol IDs to their respective images
const getProtocolImage = (protocolId: string) => {
  const imageMap: Record<string, string> = {
    "PROT-001": "/images/mens-fertility.png",
    "PROT-002": "/images/female-fertility.png",
    "PROT-003": "/images/menopause.png",
    "PROT-004": "/images/anti-inflammatory.png",
    "PROT-005": "/images/energy-vitality.png",
    "PROT-006": "/images/digestive-health.png",
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

export function ProtocolDetailDrawer({ protocol, onClose }: ProtocolDetailDrawerProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedProtocol, setEditedProtocol] = useState<Protocol>(protocol)

  const protocolImage = getProtocolImage(protocol.id)
  const categoryBadgeStyle = getCategoryBadgeStyle(editedProtocol.category)
  const statusDotStyle = getStatusDotStyle(editedProtocol.status)
  const statusDisplayText = getStatusDisplayText(editedProtocol.status)
  const priceRangeText = formatPriceRange(editedProtocol.priceRange)

  const handleSave = () => {
    // Here you would save the changes to your backend
    console.log("Saving protocol changes:", editedProtocol)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProtocol(protocol)
    setIsEditing(false)
  }

  const addBiomarker = () => {
    const newBiomarker: Biomarker = {
      _key: `biomarker-${Date.now()}`,
      id: `bio-${Date.now()}`,
      id_tuss: "",
      name: "",
      observation: "",
    }
    setEditedProtocol({
      ...editedProtocol,
      biomarkers: [...(editedProtocol.biomarkers || []), newBiomarker],
    })
  }

  const removeBiomarker = (key: string) => {
    setEditedProtocol({
      ...editedProtocol,
      biomarkers: editedProtocol.biomarkers?.filter((b) => b._key !== key) || [],
    })
  }

  const updateBiomarker = (key: string, field: keyof Biomarker, value: string) => {
    setEditedProtocol({
      ...editedProtocol,
      biomarkers: editedProtocol.biomarkers?.map((b) => (b._key === key ? { ...b, [field]: value } : b)) || [],
    })
  }

  const addFAQ = () => {
    const newFAQ: FAQ = {
      _key: `faq-${Date.now()}`,
      question: "",
      answer: "",
    }
    setEditedProtocol({
      ...editedProtocol,
      faq: [...(editedProtocol.faq || []), newFAQ],
    })
  }

  const removeFAQ = (key: string) => {
    setEditedProtocol({
      ...editedProtocol,
      faq: editedProtocol.faq?.filter((f) => f._key !== key) || [],
    })
  }

  const updateFAQ = (key: string, field: keyof FAQ, value: string) => {
    setEditedProtocol({
      ...editedProtocol,
      faq: editedProtocol.faq?.map((f) => (f._key === key ? { ...f, [field]: value } : f)) || [],
    })
  }

  const addHowItWorksStep = () => {
    const newStep: HowItWorksStep = {
      _key: `step-${Date.now()}`,
      title: "",
      subTitle: "",
      description: "",
    }
    setEditedProtocol({
      ...editedProtocol,
      howItWorks: [...(editedProtocol.howItWorks || []), newStep],
    })
  }

  const removeHowItWorksStep = (key: string) => {
    setEditedProtocol({
      ...editedProtocol,
      howItWorks: editedProtocol.howItWorks?.filter((s) => s._key !== key) || [],
    })
  }

  const updateHowItWorksStep = (key: string, field: keyof HowItWorksStep, value: string) => {
    setEditedProtocol({
      ...editedProtocol,
      howItWorks: editedProtocol.howItWorks?.map((s) => (s._key === key ? { ...s, [field]: value } : s)) || [],
    })
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
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 relative overflow-hidden w-12 h-12">
              <Image
                src={protocolImage || "/placeholder.svg"}
                alt={editedProtocol.name}
                fill
                className="object-cover"
                sizes="48px"
              />
            </div>
            <div>
              {isEditing ? (
                <Input
                  value={editedProtocol.name}
                  onChange={(e) => setEditedProtocol({ ...editedProtocol, name: e.target.value })}
                  className="text-lg font-semibold border-0 p-0 h-auto focus-visible:ring-0"
                />
              ) : (
                <h2 className="text-lg font-semibold">{editedProtocol.name}</h2>
              )}
              <div className="flex items-center gap-2 mt-1">
                <Badge className={`text-xs font-medium border-0 ${categoryBadgeStyle}`}>
                  {editedProtocol.category}
                </Badge>
                <div
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-md bg-gray-50 ${statusDotStyle.textColor}`}
                >
                  <div className={`w-2 h-2 rounded-full ${statusDotStyle.dotColor}`} />
                  <span className="text-xs font-medium">{statusDisplayText}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {isEditing ? (
              <>
                <Button variant="outline" size="sm" onClick={handleCancel}>
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="h-4 w-4 mr-2" />
                  Salvar
                </Button>
              </>
            ) : (
              <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                <Edit3 className="h-4 w-4 mr-2" />
                Editar
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Basic Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TestTube className="h-5 w-5" />
                Informações Básicas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Categoria</Label>
                  {isEditing ? (
                    <Select
                      value={editedProtocol.category}
                      onValueChange={(value) => setEditedProtocol({ ...editedProtocol, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Fertilidade">Fertilidade</SelectItem>
                        <SelectItem value="Hormonal">Hormonal</SelectItem>
                        <SelectItem value="Nutrição">Nutrição</SelectItem>
                        <SelectItem value="Metabolismo">Metabolismo</SelectItem>
                        <SelectItem value="Digestão">Digestão</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm mt-1">{editedProtocol.category}</p>
                  )}
                </div>
                <div>
                  <Label htmlFor="status">Status</Label>
                  {isEditing ? (
                    <Select
                      value={editedProtocol.status}
                      onValueChange={(value: any) => setEditedProtocol({ ...editedProtocol, status: value })}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="active">Publicado</SelectItem>
                        <SelectItem value="draft">Rascunho</SelectItem>
                        <SelectItem value="inactive">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                  ) : (
                    <p className="text-sm mt-1">{statusDisplayText}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="description">Descrição</Label>
                {isEditing ? (
                  <Textarea
                    value={editedProtocol.description}
                    onChange={(e) => setEditedProtocol({ ...editedProtocol, description: e.target.value })}
                    className="mt-1"
                    rows={3}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">{editedProtocol.description}</p>
                )}
              </div>

              <div>
                <Label htmlFor="shortDescription">Descrição Curta</Label>
                {isEditing ? (
                  <Textarea
                    value={editedProtocol.shortDescription || ""}
                    onChange={(e) => setEditedProtocol({ ...editedProtocol, shortDescription: e.target.value })}
                    className="mt-1"
                    rows={2}
                  />
                ) : (
                  <p className="text-sm text-muted-foreground leading-relaxed mt-1">
                    {editedProtocol.shortDescription}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <TestTube className="h-4 w-4" />
                    <span className="text-xs">Biomarcadores</span>
                  </div>
                  {isEditing ? (
                    <Input
                      type="number"
                      value={editedProtocol.tests}
                      onChange={(e) =>
                        setEditedProtocol({ ...editedProtocol, tests: Number.parseInt(e.target.value) || 0 })
                      }
                      className="text-center"
                    />
                  ) : (
                    <p className="font-semibold">{editedProtocol.tests}</p>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <Calendar className="h-4 w-4" />
                    <span className="text-xs">Duração</span>
                  </div>
                  {isEditing ? (
                    <Input
                      value={editedProtocol.duration}
                      onChange={(e) => setEditedProtocol({ ...editedProtocol, duration: e.target.value })}
                      className="text-center"
                    />
                  ) : (
                    <p className="font-semibold">{editedProtocol.duration}</p>
                  )}
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-muted-foreground mb-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-xs">Preço</span>
                  </div>
                  {isEditing ? (
                    <div className="flex gap-1 items-center">
                      <Input
                        type="number"
                        value={editedProtocol.priceRange.min}
                        onChange={(e) =>
                          setEditedProtocol({
                            ...editedProtocol,
                            priceRange: { ...editedProtocol.priceRange, min: Number.parseInt(e.target.value) || 0 },
                          })
                        }
                        className="text-center text-xs"
                      />
                      <span className="text-xs">-</span>
                      <Input
                        type="number"
                        value={editedProtocol.priceRange.max}
                        onChange={(e) =>
                          setEditedProtocol({
                            ...editedProtocol,
                            priceRange: { ...editedProtocol.priceRange, max: Number.parseInt(e.target.value) || 0 },
                          })
                        }
                        className="text-center text-xs"
                      />
                    </div>
                  ) : (
                    <p className="font-semibold text-primary">{priceRangeText}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* About Section */}
          {editedProtocol.about && editedProtocol.about.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Sobre o Protocolo
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isEditing ? (
                  <Textarea
                    value={editedProtocol.about[0]?.children[0]?.text || ""}
                    onChange={(e) => {
                      const newAbout = [...(editedProtocol.about || [])]
                      if (newAbout[0]) {
                        newAbout[0].children[0].text = e.target.value
                      }
                      setEditedProtocol({ ...editedProtocol, about: newAbout })
                    }}
                    rows={6}
                    className="text-sm"
                  />
                ) : (
                  <p className="text-sm leading-relaxed">{editedProtocol.about[0]?.children[0]?.text}</p>
                )}
              </CardContent>
            </Card>
          )}

          {/* Biomarkers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <TestTube className="h-5 w-5" />
                  Biomarcadores ({editedProtocol.biomarkers?.length || 0})
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addBiomarker}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {editedProtocol.biomarkers?.map((biomarker) => (
                  <div key={biomarker._key} className="flex items-center gap-2 p-3 bg-muted/30 rounded-md">
                    <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0" />
                    {isEditing ? (
                      <div className="flex-1 grid grid-cols-3 gap-2">
                        <Input
                          placeholder="Nome do biomarcador"
                          value={biomarker.name}
                          onChange={(e) => updateBiomarker(biomarker._key, "name", e.target.value)}
                        />
                        <Input
                          placeholder="ID TUSS"
                          value={biomarker.id_tuss}
                          onChange={(e) => updateBiomarker(biomarker._key, "id_tuss", e.target.value)}
                        />
                        <div className="flex gap-1">
                          <Input
                            placeholder="Observação"
                            value={biomarker.observation}
                            onChange={(e) => updateBiomarker(biomarker._key, "observation", e.target.value)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeBiomarker(biomarker._key)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex-1">
                        <span className="font-medium">{biomarker.name}</span>
                        {biomarker.id_tuss && (
                          <span className="text-xs text-muted-foreground ml-2">({biomarker.id_tuss})</span>
                        )}
                        {biomarker.observation && (
                          <p className="text-xs text-muted-foreground mt-1">{biomarker.observation}</p>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* How It Works */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Workflow className="h-5 w-5" />
                  Como Funciona ({editedProtocol.howItWorks?.length || 0} etapas)
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addHowItWorksStep}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Etapa
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editedProtocol.howItWorks?.map((step, index) => (
                  <div key={step._key} className="border rounded-lg p-4">
                    <div className="flex items-start gap-3">
                      <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        {isEditing ? (
                          <div className="space-y-2">
                            <div className="flex gap-2">
                              <Input
                                placeholder="Título"
                                value={step.title}
                                onChange={(e) => updateHowItWorksStep(step._key, "title", e.target.value)}
                              />
                              <Button variant="ghost" size="sm" onClick={() => removeHowItWorksStep(step._key)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            <Input
                              placeholder="Subtítulo"
                              value={step.subTitle}
                              onChange={(e) => updateHowItWorksStep(step._key, "subTitle", e.target.value)}
                            />
                            <Textarea
                              placeholder="Descrição"
                              value={step.description}
                              onChange={(e) => updateHowItWorksStep(step._key, "description", e.target.value)}
                              rows={2}
                            />
                          </div>
                        ) : (
                          <>
                            <h4 className="font-semibold">{step.title}</h4>
                            <p className="text-sm text-muted-foreground">{step.subTitle}</p>
                            <p className="text-sm mt-2">{step.description}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* FAQ */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5" />
                  FAQ ({editedProtocol.faq?.length || 0} perguntas)
                </div>
                {isEditing && (
                  <Button size="sm" onClick={addFAQ}>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar FAQ
                  </Button>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {editedProtocol.faq?.map((faqItem) => (
                  <div key={faqItem._key} className="border rounded-lg p-4">
                    {isEditing ? (
                      <div className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            placeholder="Pergunta"
                            value={faqItem.question}
                            onChange={(e) => updateFAQ(faqItem._key, "question", e.target.value)}
                          />
                          <Button variant="ghost" size="sm" onClick={() => removeFAQ(faqItem._key)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Resposta"
                          value={faqItem.answer}
                          onChange={(e) => updateFAQ(faqItem._key, "answer", e.target.value)}
                          rows={3}
                        />
                      </div>
                    ) : (
                      <>
                        <h4 className="font-semibold mb-2">{faqItem.question}</h4>
                        <p className="text-sm text-muted-foreground">{faqItem.answer}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sources */}
          {editedProtocol.sources && editedProtocol.sources.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  Fontes Científicas ({editedProtocol.sources.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {editedProtocol.sources.map((source) => (
                    <div key={source._key} className="border rounded-lg p-3">
                      <h4 className="font-medium text-sm">{source.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{source.description}</p>
                      {source.sourceFileOrLink?.link && (
                        <a
                          href={source.sourceFileOrLink.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs text-primary hover:underline mt-1 inline-block"
                        >
                          Ver fonte →
                        </a>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <Button className="flex-1">Solicitar Protocolo</Button>
            <Button variant="outline" className="flex-1 bg-transparent">
              Mais Informações
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
