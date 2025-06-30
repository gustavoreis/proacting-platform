import { LineItem } from "./orders"
import { TrackType } from "./sanity"
import { Order } from "@/types/order"
import { Protocol } from "@/types/protocol"

// Adaptador para converter LineItem do Supabase para Order esperado pela UI
export function adaptLineItemToOrder(lineItem: LineItem): Order {
  const orderStatus = lineItem.order.confirmed ? "completed" : 
                     lineItem.order.cancelledAt ? "cancelled" : "pending"

  return {
    id: `ORD-${lineItem.order.id}`,
    status: orderStatus as "pending" | "in-progress" | "completed" | "cancelled",
    userName: `${lineItem.order.buyer.firstName} ${lineItem.order.buyer.lastName}`,
    date: lineItem.order.createdAt,
    service: lineItem.title,
    protocol: lineItem.title, // O título do produto é o protocolo
    userEmail: lineItem.order.buyer.email,
    userPhone: lineItem.order.buyer.phone,
    timeline: [
      {
        date: lineItem.order.createdAt,
        status: "Order Placed",
        description: "Pedido realizado"
      },
      ...(lineItem.order.confirmed ? [{
        date: lineItem.order.createdAt,
        status: "Completed",
        description: "Atendimento finalizado"
      }] : []),
      ...(lineItem.order.cancelledAt ? [{
        date: lineItem.order.cancelledAt,
        status: "Cancelled",
        description: "Pedido cancelado"
      }] : [])
    ],
    labResults: {
      // Dados mock para compatibilidade - podem ser expandidos no futuro
      price: parseFloat(lineItem.order.totalPrice) || 0,
      quantity: lineItem.quantity,
      discount: parseFloat(lineItem.order.totalDiscounts) || 0,
    },
    suggestedReport: `Atendimento para ${lineItem.title}. Valor: R$ ${lineItem.order.totalPrice}. Quantidade: ${lineItem.quantity}.`
  }
}

// Adaptador para converter TrackType do Sanity para Protocol esperado pela UI
export function adaptTrackToProtocol(track: TrackType): Protocol {
  return {
    id: track._id,
    name: track.title,
    description: track.shortDescription,
    category: "Protocolo", // Categoria padrão - pode ser expandida
    tests: track.biomarkers?.length || 0,
    duration: "4-8 semanas", // Duração padrão - pode ser expandida
    priceRange: {
      min: 1000,
      max: 3000
    },
    icon: undefined as any, // Será definido no componente
    color: "bg-blue-100 text-blue-800",
    status: track.status as "active" | "draft" | "inactive",
    // Campos expandidos do Sanity
    _id: track._id,
    _createdAt: track._createdAt,
    title: track.title,
    shortDescription: track.shortDescription,
    about: track.about as any, // Compatibilidade com tipos diferentes
    biomarkers: track.biomarkers,
    faq: track.faq,
    howItWorks: track.howItWorks,
    sources: track.sources as any, // Compatibilidade com tipos diferentes
    shopifyProductId: track.shopifyProductId?.toString(),
    practitioner: {
      _ref: track.practitioner._id,
      _type: "reference"
    },
    productImage: track.previewImageUrl ? {
      _type: "image",
      alt: track.title,
      asset: {
        _ref: track.previewImageUrl,
        _type: "reference"
      }
    } : undefined
  }
}

// Função helper para agrupar LineItems por pedido
export function groupLineItemsByOrder(lineItems: LineItem[]): Order[] {
  const orderMap = new Map<number, LineItem[]>()
  
  lineItems.forEach(item => {
    const orderId = item.order.id
    if (!orderMap.has(orderId)) {
      orderMap.set(orderId, [])
    }
    orderMap.get(orderId)?.push(item)
  })

  return Array.from(orderMap.values()).map(items => {
    // Usar o primeiro item como base e combinar informações se necessário
    const baseItem = items[0]
    const combinedTitle = items.length > 1 
      ? `${items.length} itens` 
      : baseItem.title

    return {
      ...adaptLineItemToOrder(baseItem),
      service: combinedTitle,
      protocol: combinedTitle,
    }
  })
} 