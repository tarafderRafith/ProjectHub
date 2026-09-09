

const API_URL = "http://localhost:5038/api/orders";

export interface CreateOrderData {
  projectId: number;
  buyerMessage?: string;
}

export interface Order {
  id: number;
  projectId: number;
  projectTitle: string;

  buyerId?: number;
  buyerName?: string;
  buyerUsername?: string;

  sellerId: number;
  sellerName: string;
  sellerUsername: string;

  projectPrice: number;
  commissionAmount: number;
  sellerAmount: number;

  status: string;

  buyerMessage: string | null;
  deliveryNote: string | null;

  expectedDeliveryDate: string | null;

  createdAt: string;
  updatedAt: string;
}

export interface CreateOrderResponse {
  message: string;
  orderId: number;
  projectId: number;
  projectTitle: string;

  projectPrice: number;
  commissionRate: number;
  commissionAmount: number;
  sellerAmount: number;

  status: string;
  expectedDeliveryDate: string;
  createdAt: string;
}

const getToken = () => {
  return (
    localStorage.getItem("projecthub_token") ||
    sessionStorage.getItem("projecthub_token")
  );
};

const getAuthHeaders = () => {
  const token = getToken();

  if (!token) {
    throw new Error("You are not logged in.");
  }

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const createOrder = async (
  data: CreateOrderData
): Promise<CreateOrderResponse> => {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(data),
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to create the order."
    );
  }

  return result;
};

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await fetch(
    `${API_URL}/my-orders`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to load your orders."
    );
  }

  return result;
};

export const getOrderById = async (
  orderId: number
): Promise<Order> => {
  const response = await fetch(
    `${API_URL}/${orderId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message || "Unable to load the order."
    );
  }

  return result;
};