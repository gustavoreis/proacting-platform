export interface Order {
  id: string
  status: "pending" | "in-progress" | "completed" | "cancelled"
  userName: string
  date: string
  service: string
  protocol: string
  userEmail: string
  userPhone: string
  timeline: TimelineItem[]
  labResults: Record<string, number>
  suggestedReport: string
}

// Tipos migrados do projeto principal
export interface RealOrder {
  id: number;
  shopifyOrderId: string;
  cancelledAt: string;
  createdAt: string;
  confirmed: boolean;
  totalPrice: string;
  totalDiscounts: string;
  buyer: Buyer;
}

export interface Buyer {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
}

export interface LineItem {
  id: number;
  quantity: number;
  price: number;
  variantTitle: string;
  title: string;
  order: RealOrder;
}

export interface TimelineItem {
  date: string
  status: string
  description: string
}

export interface OrderFilters {
  search: string
  protocol: string
  status: string
}
