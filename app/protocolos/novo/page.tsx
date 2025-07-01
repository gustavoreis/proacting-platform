"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { CirclePlus, Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"
import { usePractitioner } from "@/hooks/use-practitioner"
import { 
  createJobAction, 
  getJobStatusAction, 
  createTrackFromJobAction 
} from "@/app/actions"
import { toast } from "@/hooks/use-toast"

type Step = "idle" | "openai" | "creating"

export default function NovoProtocolo() {
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
  }, [jobId, practitioner, router])

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

  return (
    <div className="max-w-3xl mx-auto px-4 mt-20 space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold">Adicionar novo protocolo</h1>
        <p className="text-muted-foreground">
          Descreva o protocolo que você quer criar e nossa IA irá gerar uma versão inicial para você.
        </p>
      </div>

      {/* Loading overlay */}
      {step !== "idle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="flex flex-col items-center gap-4 p-6 bg-white dark:bg-zinc-900 rounded-xl shadow-xl">
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

      {/* Form */}
      {step === "idle" && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="prompt">Descreva seu objetivo</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ex: Quero gerar um protocolo para acompanhar fertilidade de mulheres na casa dos 40 anos."
              className="min-h-[100px]"
            />
            {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
          </div>

          <Button
            type="submit"
            className="inline-flex items-center gap-2"
          >
            <CirclePlus className="w-5 h-5" /> 
            Criar protocolo
          </Button>
        </form>
      )}
    </div>
  )
} 