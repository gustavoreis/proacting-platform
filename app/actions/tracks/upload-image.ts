"use server"

import { uploadDefaultImage } from "@/lib/sanity"

export async function uploadImageAction() {
  try {
    const result = await uploadDefaultImage()
    return { success: true, data: result }
  } catch (error) {
    console.error("Server Action Error - Upload Image:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao fazer upload da imagem" 
    }
  }
} 