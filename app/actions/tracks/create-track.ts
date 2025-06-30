"use server"

import { createTrack } from "@/lib/sanity"

type CreateTrackInput = {
  title: string
  shortDescription: string
  practitionerId: string
  status: string
  about: {
    _type: "block"
    style: string
    children: {
      _type: "span"
      text: string
      marks: string[]
    }[]
    markDefs: any[]
  }[]
  faq: {
    question: string
    answer: string
  }[]
  sources?: {
    title: string
    link: string
    description?: string
  }[]
  biomarkers?: {
    name: string
    tuss_id: string
    description: string
  }[]
  howItWorks?: {
    title: string
    subTitle: string
    description: string
  }[]
}

export async function createTrackAction(data: CreateTrackInput) {
  try {
    const result = await createTrack(data)
    return { success: true, data: result }
  } catch (error) {
    console.error("Server Action Error - Create Track:", error)
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Erro ao criar track" 
    }
  }
} 