"use server"

import { updateTrackStatus } from "@/lib/sanity.server"

interface UpdateTrackStatusData {
  trackId: string
  status: "active" | "published" | "draft" | "inactive" | "waiting_list" | "archived" | "hidden" | "deleted"
}

export async function updateTrackStatusAction(data: UpdateTrackStatusData) {
  try {
    const result = await updateTrackStatus(data.trackId, data.status)
    return { success: true, data: result }
  } catch (error) {
    console.error("Server Action Error - Update Track Status:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao atualizar status da track" 
    }
  }
}

export async function archiveTrackAction(trackId: string) {
  return await updateTrackStatusAction({ trackId, status: "archived" })
}

export async function hideTrackAction(trackId: string) {
  return await updateTrackStatusAction({ trackId, status: "hidden" })
}

export async function deleteTrackAction(trackId: string) {
  return await updateTrackStatusAction({ trackId, status: "deleted" })
} 