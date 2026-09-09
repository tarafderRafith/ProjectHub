const API_URL = "http://localhost:5038/api/payments";

export interface SubmitPaymentData {
  orderId: number;
  transactionId: string;
}

export interface SubmitPaymentResponse {
  message: string;
  paymentId: number;
  orderId: number;
  amount: number;
  paymentMethod: string;
  status: string;
  submittedAt: string;
}

export interface Payment {
  id: number;
  orderId: number;
  projectId: number;
  projectTitle: string;
  amount: number;
  paymentMethod: string;
  transactionId: string | null;
  status: string;
  adminNote?: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  updatedAt?: string;
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

export const submitPayment = async (
  data: SubmitPaymentData
): Promise<SubmitPaymentResponse> => {
  const response = await fetch(
    `${API_URL}/submit`,
    {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Unable to submit the payment."
    );
  }

  return result;
};

export const getMyPayments = async (): Promise<
  Payment[]
> => {
  const response = await fetch(
    `${API_URL}/my-payments`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Unable to load your payments."
    );
  }

  return result;
};

export const getPaymentById = async (
  paymentId: number
): Promise<Payment> => {
  const response = await fetch(
    `${API_URL}/${paymentId}`,
    {
      method: "GET",
      headers: getAuthHeaders(),
    }
  );

  const result = await response.json();

  if (!response.ok) {
    throw new Error(
      result.message ||
        "Unable to load the payment."
    );
  }

  return result;
};