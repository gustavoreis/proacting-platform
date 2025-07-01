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
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { fetchTrackById } from "@/lib/sanity"
import type { TrackType } from "@/lib/sanity"
import { toast } from "@/hooks/use-toast"
import { archiveTrackAction, hideTrackAction, deleteTrackAction } from "@/app/actions"
import Link from "next/link"

export default function ProtocoloDetalhePage() {
  const params = useParams()
  const router = useRouter()
  const [protocol, setProtocol] = useState<TrackType | null>(null)
  const [loading, setLoading] = useState(true)
  const [actionLoading, setActionLoading] = useState<string | null>(null)

  useEffect(() => {
    async function loadProtocol() {
      if (params?.id) {
        try {
          const data = await fetchTrackById(params.id as string)
          setProtocol(data)
        } catch (error) {
          console.error("Erro ao carregar protocolo:", error)
          toast({
            title: "Erro",
            description: "Não foi possível carregar o protocolo.",
            variant: "destructive",
          })
        } finally {
          setLoading(false)
        }
      }
    }

    loadProtocol()
  }, [params?.id])

  const handleArchive = async () => {
    if (!protocol?._id) return
    
    setActionLoading("archive")
    try {
      const result = await archiveTrackAction(protocol._id)
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Protocolo arquivado com sucesso.",
        })
        router.push("/protocolos")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Erro ao arquivar protocolo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível arquivar o protocolo.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleHide = async () => {
    if (!protocol?._id) return
    
    setActionLoading("hide")
    try {
      const result = await hideTrackAction(protocol._id)
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Protocolo ocultado com sucesso.",
        })
        router.push("/protocolos")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Erro ao ocultar protocolo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível ocultar o protocolo.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  const handleDelete = async () => {
    if (!protocol?._id) return
    
    setActionLoading("delete")
    try {
      const result = await deleteTrackAction(protocol._id)
      
      if (result.success) {
        toast({
          title: "Sucesso",
          description: "Protocolo excluído com sucesso.",
        })
        router.push("/protocolos")
      } else {
        throw new Error(result.error)
      }
    } catch (error) {
      console.error("Erro ao excluir protocolo:", error)
      toast({
        title: "Erro",
        description: "Não foi possível excluir o protocolo.",
        variant: "destructive",
      })
    } finally {
      setActionLoading(null)
    }
  }

  if (loading) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center h-64">
              <p>Carregando protocolo...</p>
            </div>
          </SidebarInset>
        </SidebarProvider>
      </AuthGuard>
    )
  }

  if (!protocol) {
    return (
      <AuthGuard>
        <SidebarProvider>
          <AppSidebar />
          <SidebarInset>
            <div className="flex items-center justify-center h-64">
              <p>Protocolo não encontrado.</p>
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
                  <BreadcrumbLink href="/protocolos">Protocolos</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{protocol.title}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
        </header>

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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={actionLoading === "archive"}>
                      <Archive className="h-4 w-4 mr-2" />
                      {actionLoading === "archive" ? "Arquivando..." : "Arquivar"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Arquivar Protocolo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja arquivar este protocolo? Ele não ficará mais visível na lista principal, mas pode ser restaurado posteriormente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleArchive}>Arquivar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={actionLoading === "hide"}>
                      <ArchiveX className="h-4 w-4 mr-2" />
                      {actionLoading === "hide" ? "Ocultando..." : "Ocultar"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Ocultar Protocolo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja ocultar este protocolo? Ele ficará invisível para os usuários, mas pode ser reativado posteriormente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleHide}>Ocultar</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm" disabled={actionLoading === "delete"}>
                      <Trash2 className="h-4 w-4 mr-2" />
                      {actionLoading === "delete" ? "Excluindo..." : "Excluir"}
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Excluir Protocolo</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tem certeza que deseja excluir este protocolo? Esta ação não pode ser desfeita e todos os dados associados serão perdidos permanentemente.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                        Excluir Permanentemente
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="overview" className="w-full">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="overview">Visão Geral</TabsTrigger>
                <TabsTrigger value="faq">FAQ</TabsTrigger>
                <TabsTrigger value="sources">Fontes</TabsTrigger>
                <TabsTrigger value="biomarkers">Biomarcadores</TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-xl font-semibold mb-3">Sobre este protocolo</h2>
                    <div className="prose prose-sm max-w-none">
                      {protocol.about?.map((block, index) => (
                        <p key={index} className="leading-relaxed">
                          {block.children?.map((child) => child.text).join("")}
                        </p>
                      )) || <p className="text-muted-foreground">Nenhuma descrição disponível.</p>}
                    </div>
                  </div>

                  {protocol.howItWorksTemplate && (
                    <div>
                      <h2 className="text-xl font-semibold mb-3">Como funciona</h2>
                      <div className="space-y-4">
                        {protocol.howItWorksTemplate.steps?.map((step, index) => (
                          <div key={step._key} className="border rounded-lg p-4">
                            <div className="flex items-start gap-3">
                              <div className="bg-primary text-primary-foreground rounded-full w-6 h-6 flex items-center justify-center text-sm font-medium flex-shrink-0">
                                {index + 1}
                              </div>
                              <div>
                                <h3 className="font-semibold mb-1">{step.title}</h3>
                                <p className="text-sm text-muted-foreground mb-2">{step.subTitle}</p>
                                <p className="text-sm leading-relaxed">{step.description}</p>
                              </div>
                            </div>
                          </div>
                        )) || <p className="text-muted-foreground">Nenhuma etapa disponível.</p>}
                      </div>
                    </div>
                  )}
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