"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function OffersPage() {
  const router = useRouter()

  useEffect(() => {
    // Redirecionar para protocolos (que é o equivalente a offers)
    router.push("/protocolos")
  }, [router])

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="text-center space-y-4">
        <h1 className="text-2xl font-bold">Redirecionando...</h1>
        <p className="text-muted-foreground">Você está sendo redirecionado para Protocolos</p>
      </div>
    </div>
  )
} 