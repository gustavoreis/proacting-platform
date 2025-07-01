"use server"

import { supabase } from "@/lib/supabase"
import { createTrack } from "@/lib/sanity.server"

interface CreateTrackFromJobData {
  jobId: string
  practitionerId: string
}

export async function createTrackFromJobAction(data: CreateTrackFromJobData) {
  try {
    const { data: job, error } = await supabase
      .from("ai_jobs")
      .select("result, status, error")
      .eq("id", data.jobId)
      .single()

    if (error || !job) {
      return {
        success: false,
        error: "Job não encontrado"
      }
    }

    if (job.status !== "completed") {
      return {
        success: false,
        error: "Job ainda não finalizado"
      }
    }

    const trackData = {
      ...job.result,
      practitionerId: data.practitionerId,
    }

    console.log("🚀 Dados da track recebidos:", {
      title: trackData.title,
      status: trackData.status,
      howItWorksCount: trackData.howItWorks?.length || 0,
      howItWorksFirst: trackData.howItWorks?.[0]?.title || 'N/A'
    })

    const trackId = await createTrack(trackData)

    console.log("✅ Track criada com sucesso:", trackId)
    
    return {
      success: true,
      data: { trackId }
    }
  } catch (error) {
    console.error("Server Action Error - Create Track From Job:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao criar track"
    }
  }
} 