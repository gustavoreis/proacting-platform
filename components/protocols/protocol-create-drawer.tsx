"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CirclePlus, Loader2, X } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePractitioner } from "@/hooks/use-practitioner"
import { 
  createJobAction, 
  getJobStatusAction, 
  createTrackFromJobAction 
} from "@/app/actions"
import { toast } from "@/hooks/use-toast"

interface ProtocolCreateDrawerProps {
  onClose: () => void
}

type Step = "idle" | "openai" | "creating"

export function ProtocolCreateDrawer({ onClose }: ProtocolCreateDrawerProps) {
  const router = useRouter()
  const { user } = useAuth()
  const { practitioner } = usePractitioner()
  
  const [step, setStep] = useState<Step>("idle")
  const [error, setError] = useState<string | null>(null)
  const [jobId, setJobId] = useState<string | null>(null)
  const [prompt, setPrompt] = useState("")

  // Polling para verificar status do job
  useEffect(() => {
    if (!jobId) return

    const interval = setInterval(async () => {
      const result = await getJobStatusAction(jobId)
      
      if (!result.success) {
        clearInterval(interval)
        setStep("idle")
        setError(result.error || "Erro desconhecido")
        setJobId(null)
        return
      }

      if (!result.data) {
        clearInterval(interval)
        setStep("idle")
        setError("Dados do job não encontrados")
        setJobId(null)
        return
      }

      const { status, result: jobResult, error: jobError } = result.data

      if (status === "completed") {
        clearInterval(interval)
        setStep("creating")
        
        if (!practitioner?._id) {
          setStep("idle")
          setError("Profissional não encontrado")
          return
        }

        // Criar track com o resultado da IA
        const createResult = await createTrackFromJobAction({
          jobId,
          practitionerId: practitioner._id
        })

        if (createResult.success && createResult.data?.trackId) {
          toast({
            title: "Protocolo criado!",
            description: "Seu novo protocolo foi criado com sucesso.",
          })
          onClose()
          router.push(`/protocolos/${createResult.data.trackId}`)
        } else {
          setStep("idle")
          setError(createResult.error || "Erro ao criar protocolo")
        }
        
        setJobId(null)
      } else if (status === "failed") {
        clearInterval(interval)
        setStep("idle")
        setError(jobError || "Erro ao gerar protocolo")
        setJobId(null)
      }
    }, 2000)

    return () => clearInterval(interval)
  }, [jobId, practitioner, router, onClose])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!prompt.trim()) {
      setError("O prompt é obrigatório")
      return
    }

    if (!user?.id) {
      setError("Usuário não autenticado")
      return
    }

    setError(null)
    setStep("openai")

    const result = await createJobAction({
      prompt,
      userId: user.id
    })

    if (result.success && result.data) {
      setJobId(result.data.jobId)
    } else {
      setStep("idle")
      setError(result.error || "Erro ao criar job")
    }
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
        style={{ width: "max(600px, 50vw)" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold">Novo Protocolo</h2>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Loading overlay dentro do drawer */}
          {step !== "idle" && (
            <div className="absolute inset-0 z-10 flex items-center justify-center bg-background/90 backdrop-blur-sm">
              <div className="flex flex-col items-center gap-4 p-6 bg-card rounded-xl shadow-xl border">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
                {step === "openai" && (
                  <p className="text-muted-foreground text-sm">
                    🤖 Agente OpenAI trabalhando...
                  </p>
                )}
                {step === "creating" && (
                  <p className="text-muted-foreground text-sm">
                    📦 Criando protocolo rascunho...
                  </p>
                )}
              </div>
            </div>
          )}

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-muted-foreground">
                Descreva o protocolo que você quer criar e nossa IA irá gerar uma versão inicial para você.
              </p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="prompt">Descreva seu objetivo</Label>
                <Textarea
                  id="prompt"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Ex: Quero gerar um protocolo para acompanhar fertilidade de mulheres na casa dos 40 anos."
                  className="min-h-[200px]"
                  disabled={step !== "idle"}
                />
                {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  className="inline-flex items-center gap-2"
                  disabled={step !== "idle"}
                >
                  <CirclePlus className="w-5 h-5" /> 
                  Criar protocolo
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={step !== "idle"}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
} 