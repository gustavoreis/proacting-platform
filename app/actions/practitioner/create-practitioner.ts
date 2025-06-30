"use server"

import { createPractitioner } from "@/lib/sanity"

interface CreatePractitionerData {
  loginUserId: string
  name: string
}

export async function createPractitionerAction(data: CreatePractitionerData) {
  try {
    const result = await createPractitioner(data)
    return { success: true, data: result }
  } catch (error) {
    console.error("Server Action Error - Create Practitioner:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao criar profissional" 
    }
  }
} 