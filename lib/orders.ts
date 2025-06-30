import { supabase } from "./supabase";
import { convertKeysToCamelCase } from "./converter";

export type Order = {
  id: number;
  shopifyOrderId: string;
  cancelledAt: string;
  createdAt: string;
  confirmed: boolean;
  totalPrice: string;
  totalDiscounts: string;
  buyer: Buyer;
};

type Buyer = {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
};

export type LineItem = {
  id: number;
  quantity: number;
  price: number;
  variantTitle: string;
  title: string;
  order: Order;
};

export async function fetchLineItemsByProductIds(
  productIds: number[]
): Promise<LineItem[]> {
  const { data, error } = await supabase
    .from("line_items")
    .select(
      `
        id,
        quantity,
        price,
        variant_title,
        title,
        order:orders!line_items_order_id_fkey (
          id,
          shopify_order_id,
          cancelled_at,
          created_at,
          confirmed,
          total_price,
          total_discounts,
          buyer:buyers!orders_buyer_id_fkey (
            first_name,
            last_name,
            phone,
            email
          )
        )
      `
    )
    .in("product_id", productIds);
  
  if (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map(convertKeysToCamelCase);
}

export async function fetchOrderItems(orderId: string): Promise<LineItem[]> {
  const { data, error } = await supabase
    .from("line_items")
    .select(
      `
      product_id,
      id,
      quantity,
      price,
      variant_title,
      title,
      order:orders!line_items_order_id_fkey (
        shopify_order_id,
        cancelled_at,
        created_at,
        confirmed,
        total_price,
        total_discounts,
        buyer:buyers!orders_buyer_id_fkey (
          first_name,
          last_name,
          phone,
          email
        )
      )
    `
    )
    .eq("orders.id", orderId);

  if (error) {
    console.error("Erro ao buscar dados:", error);
    return [];
  }

  if (!data) {
    return [];
  }

  const distinctData = data
    .map((item) => item)
    .filter(
      (item, index, self) => self.findIndex((o) => o.id === item.id) === index
    );

  return distinctData.map(convertKeysToCamelCase);
}

export async function getLineItemById(lineItemId: string): Promise<LineItem[] | null> {
  const { data, error } = await supabase
    .from("line_items")
    .select(
      `
      id,
      quantity,
      price,
      variant_title,
      title,
      order:orders!line_items_order_id_fkey (
        id,
        shopify_order_id,
        cancelled_at,
        created_at,
        confirmed,
        total_price,
        total_discounts,
        buyer:buyers!orders_buyer_id_fkey (
          first_name,
          last_name,
          phone,
          email
        )
      )
    `
    )
    .eq("id", lineItemId);
    
  if (error) {
    console.error("Erro ao buscar dados:", error);
    return null;
  }
  
  if (!data) {
    return null;
  }
  
  return data.map(convertKeysToCamelCase);
}

// Função auxiliar para buscar todos os pedidos de um practitioner
export async function fetchOrdersByPractitioner(practitionerId: string): Promise<LineItem[]> {
  // Primeiro buscar os tracks do practitioner para obter os productIds
  const { data: tracks, error: tracksError } = await supabase
    .from("tracks") // Assumindo que existe uma tabela tracks
    .select("shopify_product_id")
    .eq("practitioner_id", practitionerId);

  if (tracksError) {
    console.error("Erro ao buscar tracks:", tracksError);
    return [];
  }

  if (!tracks || tracks.length === 0) {
    return [];
  }

  const productIds = tracks
    .filter(track => track.shopify_product_id)
    .map(track => track.shopify_product_id);

  if (productIds.length === 0) {
    return [];
  }

  return fetchLineItemsByProductIds(productIds);
}

// Tipos atualizados para compatibilidade com o sistema existente
export interface OrderData extends Omit<Order, 'buyer'> {
  buyer: Buyer;
  lineItems?: LineItem[];
}

export interface OrderFilters {
  search: string;
  protocol: string;
  status: string;
}

export interface OrderStats {
  total: number;
  pending: number;
  inProgress: number;
  completed: number;
  cancelled: number;
} 