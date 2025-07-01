"use server"

import { supabase } from "@/lib/supabase"

interface CreateJobData {
  prompt: string
  userId: string
}

export async function createJobAction(data: CreateJobData) {
  try {
    const { data: job, error: jobError } = await supabase
      .from("ai_jobs")
      .insert({
        prompt: data.prompt,
        user_id: data.userId,
        status: "pending",
      })
      .select()
      .single()

    if (jobError || !job) {
      return { 
        success: false, 
        error: "Erro ao criar job no Supabase." 
      }
    }

    try {
      fetch(
        "https://xtbtfvbfjddamrgrsejr.supabase.co/functions/v1/track_generator",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ jobId: job.id }),
        }
      )
    } catch (err) {
      console.warn("Erro ao chamar a Edge Function:", err)
    }

    return { 
      success: true, 
      data: { 
        jobId: job.id 
      } 
    }
  } catch (error) {
    console.error("Server Action Error - Create Job:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao criar job" 
    }
  }
} 