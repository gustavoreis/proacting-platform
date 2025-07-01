"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
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
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"
import { 
  Archive, 
  ArchiveX, 
  Trash2, 
  ArrowLeft,
  ExternalLink
} from "lucide-react"
import { fetchTrackById } from "@/lib/sanity"
import type { TrackType } from "@/lib/sanity"
import { toast } from "@/hooks/use-toast"
import Link from "next/link"

export default function ProtocoloDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [protocol, setProtocol] = useState<TrackType | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const protocolId = params?.id as string

  useEffect(() => {
    if (!protocolId) {
      setError("ID do protocolo não fornecido")
      setLoading(false)
      return
    }

    const loadProtocol = async () => {
      try {
        setLoading(true)
        const data = await fetchTrackById(protocolId)
        console.log("🔍 Dados do protocolo carregados:", {
          title: data.title,
          hasHowItWorksTemplate: !!data.howItWorksTemplate,
          templateSteps: data.howItWorksTemplate?.steps?.length || 0,
          hasDirectHowItWorks: !!data.howItWorks,
          directSteps: data.howItWorks?.length || 0
        })
        setProtocol(data)
      } catch (err) {
        console.error("Erro ao carregar protocolo:", err)
        setError("Erro ao carregar protocolo")
        toast({
          title: "Erro",
          description: "Não foi possível carregar o protocolo",
          variant: "destructive"
        })
      } finally {
        setLoading(false)
      }
    }

    loadProtocol()
  }, [protocolId])

  const renderAbout = (about: any[]) => {
    if (!about || !Array.isArray(about)) return null

    return about.map((block, blockIndex) => {
      if (!block.children) return null

      return block.children.map((child: any, index: number) => {
        const key = `${block._key || blockIndex}-${index}`
        
        switch (block.style) {
          case "h1":
            return <h1 className="text-2xl font-bold mb-4" key={key}>{child.text}</h1>
          case "h2":
            return <h2 className="text-xl font-semibold mb-3" key={key}>{child.text}</h2>
          case "h3":
            return <h3 className="text-lg font-semibold mb-2" key={key}>{child.text}</h3>
          case "h4":
            return <h4 className="text-base font-semibold mb-2" key={key}>{child.text}</h4>
          case "normal":
          default:
            return <p className="mb-3 leading-relaxed" key={key}>{child.text}</p>
        }
      })
    })
  }

  if (loading) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center space-y-2">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                <p className="text-muted-foreground">Carregando protocolo...</p>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    )
  }

  if (error || !protocol) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center min-h-screen">
              <div className="text-center space-y-4">
                <p className="text-destructive">{error || "Protocolo não encontrado"}</p>
                <Button asChild>
                  <Link href="/protocolos">Voltar para protocolos</Link>
                </Button>
              </div>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    )
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>
          {/* Header */}
          <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
            <div className="flex items-center gap-2 px-4">
              <SidebarTrigger className="-ml-1" />
              <Separator orientation="vertical" className="mr-2 h-4" />
              <Breadcrumb>
                <BreadcrumbList>
                  <BreadcrumbItem>
                    <BreadcrumbLink asChild>
                      <Link href="/protocolos">Protocolos</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                  <BreadcrumbItem>
                    <BreadcrumbPage>{protocol.title}</BreadcrumbPage>
                  </BreadcrumbItem>
                </BreadcrumbList>
              </Breadcrumb>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 p-6">
            <div className="mb-6">
              <Button variant="ghost" asChild className="mb-4">
                <Link href="/protocolos">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Voltar para protocolos
                </Link>
              </Button>
              
              <h1 className="text-3xl font-bold mb-2">{protocol.title}</h1>
              <p className="text-muted-foreground mb-4">{protocol.shortDescription}</p>
              
              {/* Action buttons */}
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm">
                  <Archive className="h-4 w-4 mr-2" />
                  Arquivar
                </Button>
                <Button variant="outline" size="sm">
                  <ArchiveX className="h-4 w-4 mr-2" />
                  Ocultar
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="general" className="w-full">
              <TabsList className="grid grid-cols-5 w-full">
                <TabsTrigger value="general">Geral</TabsTrigger>
                <TabsTrigger value="howItWorks">Como Funciona</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="sources">Fontes</TabsTrigger>
                <TabsTrigger value="biomarkers">Biomarcadores</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="mt-6">
                <div className="prose prose-sm max-w-none">
                  {protocol.about && renderAbout(protocol.about)}
                </div>
              </TabsContent>

              <TabsContent value="howItWorks" className="mt-6">
                <div className="space-y-4">
                  {(() => {
                    // Prioriza o template, mas também verifica o campo direto para compatibilidade
                    const steps = protocol.howItWorksTemplate?.steps || protocol.howItWorks;
                    
                    if (!steps || steps.length === 0) {
                      return <p className="text-muted-foreground">Nenhuma informação disponível.</p>;
                    }

                    return steps.map((step: any, index: number) => (
                      <div key={step._key || index} className="border rounded-lg p-4">
                        <h3 className="font-semibold mb-2">
                          {step.order || index + 1}. {step.title}
                        </h3>
                        {step.subTitle && (
                          <h4 className="text-sm font-medium text-muted-foreground mb-2">
                            {step.subTitle}
                          </h4>
                        )}
                        <p className="text-sm leading-relaxed">{step.description}</p>
                      </div>
                    ));
                  })()}
                </div>
              </TabsContent>

              <TabsContent value="faq" className="mt-6">
                <Accordion type="single" collapsible>
                  {protocol.faq?.map((item) => (
                    <AccordionItem key={item._key} value={item._key}>
                      <AccordionTrigger className="text-left">
                        {item.question}
                      </AccordionTrigger>
                      <AccordionContent>
                        <p className="leading-relaxed">{item.answer}</p>
                      </AccordionContent>
                    </AccordionItem>
                  )) || <p className="text-muted-foreground">Nenhuma pergunta frequente disponível.</p>}
                </Accordion>
              </TabsContent>

              <TabsContent value="sources" className="mt-6">
                <div className="space-y-3">
                  {protocol.sources?.map((source) => (
                    <div key={source._key} className="border rounded-lg p-4">
                      <h3 className="font-semibold mb-2">{source.title}</h3>
                      {source.description && (
                        <p className="text-sm text-muted-foreground mb-2">{source.description}</p>
                      )}
                      {source.sourceFileOrLink?.link && (
                        <Button variant="outline" size="sm" asChild>
                          <a 
                            href={source.sourceFileOrLink.link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-2" />
                            Acessar fonte
                          </a>
                        </Button>
                      )}
                    </div>
                  )) || <p className="text-muted-foreground">Nenhuma fonte disponível.</p>}
                </div>
              </TabsContent>

              <TabsContent value="biomarkers" className="mt-6">
                <div className="space-y-3">
                  {protocol.biomarkers?.map((biomarker) => (
                    <div key={biomarker._key} className="border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-semibold">{biomarker.name}</h3>
                        <span className="text-xs bg-muted px-2 py-1 rounded">
                          TUSS: {biomarker.id_tuss}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{biomarker.observation}</p>
                    </div>
                  )) || <p className="text-muted-foreground">Nenhum biomarcador disponível.</p>}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </SidebarInset>
      </SidebarProvider>
    </AuthGuard>
  )
} 