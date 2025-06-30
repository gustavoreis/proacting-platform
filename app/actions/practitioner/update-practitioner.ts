"use server"

import { updatePractitioner } from "@/lib/sanity"

interface UpdatePractitionerData {
  _id: string
  prefix?: string | null
  name?: string
  email?: string
  bio?: string | null
}

export async function updatePractitionerAction(data: UpdatePractitionerData) {
  try {
    const { _id, ...updatedFields } = data
    
    await updatePractitioner(_id, {
      prefix: updatedFields.prefix ?? null,
      name: updatedFields.name ?? "",
      email: updatedFields.email ?? "",
      bio: updatedFields.bio ?? null,
    })

    return { success: true }
  } catch (error) {
    console.error("Server Action Error:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro desconhecido" 
    }
  }
} 