"use server"

import { updatePractitionerPhoneNumber } from "@/lib/sanity"

interface UpdatePhoneData {
  _id: string
  phoneNumber: string
}

export async function updatePractitionerPhoneAction(data: UpdatePhoneData) {
  try {
    await updatePractitionerPhoneNumber(data._id, {
      phoneNumber: data.phoneNumber
    })

    return { success: true }
  } catch (error) {
    console.error("Server Action Error - Update Phone:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao atualizar telefone" 
    }
  }
} 