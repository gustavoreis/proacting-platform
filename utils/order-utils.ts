import type { Order } from "@/types/order"

export const STATUS_DISPLAY_MAP = {
  pending: "Novos",
  "in-progress": "Em atendimento",
  completed: "Finalizados",
  cancelled: "Cancelados",
} as const

export function getStatusColor(status: Order["status"]): string {
  const colorMap = {
    completed: "bg-green-100 text-green-800 hover:bg-green-100",
    "in-progress": "bg-blue-100 text-blue-800 hover:bg-blue-100",
    pending: "bg-yellow-100 text-yellow-800 hover:bg-yellow-100",
    cancelled: "bg-red-100 text-red-800 hover:bg-red-100",
  }

  return colorMap[status] || "bg-gray-100 text-gray-800 hover:bg-gray-100"
}

export function getStatusDisplayName(status: Order["status"]): string {
  return STATUS_DISPLAY_MAP[status] || status.replace("-", " ")
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString()
}
