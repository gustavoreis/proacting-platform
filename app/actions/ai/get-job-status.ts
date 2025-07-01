"use server"

import { supabase } from "@/lib/supabase"

export async function getJobStatusAction(jobId: string) {
  try {
    const { data, error } = await supabase
      .from("ai_jobs")
      .select("status, result, error")
      .eq("id", jobId)
      .single()

    if (error || !data) {
      return {
        success: false,
        error: error?.message || "Job não encontrado",
      }
    }

    return {
      success: true,
      data: {
        status: data.status,
        result: data.result,
        error: data.error
      }
    }
  } catch (error) {
    console.error("Server Action Error - Get Job Status:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Erro ao buscar status do job"
    }
  }
} 