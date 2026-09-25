const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api/v1";

class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string | null) {
    this.token = token;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...options.headers,
    };

    if (this.token) {
      (headers as Record<string, string>)["Authorization"] = `Bearer ${this.token}`;
    }

    const response = await fetch(`${this.baseUrl}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "An error occurred" }));
      throw new Error(error.message || `HTTP error! status: ${response.status}`);
    }

    if (response.status === 204) {
      return {} as T;
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(endpoint: string, data: unknown): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const api = new ApiClient();

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number;
    to: number;
  };
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
}

export interface Category {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: number;
  category_id: number | null;
  title: string;
  slug: string;
  description: string | null;
  wash_details: string | null;
  denim_weight: string | null;
  base_price: number;
  is_dropped: boolean;
  release_date: string | null;
  created_at: string;
  updated_at: string;
  category?: Category;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: number;
  product_id: number;
  sku: string;
  size: string;
  color: string | null;
  stock: number;
  price: number | null;
  created_at: string;
  updated_at: string;
  product?: Product;
}

export interface Order {
  id: number;
  order_number: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  shipping_address: string;
  total_amount: number;
  shipping_cost: number;
  status: "pending" | "paid" | "processing" | "shipped" | "cancelled";
  payment_token: string | null;
  tracking_number: string | null;
  payment_details: Record<string, unknown> | null;
  shipping_details: Record<string, unknown> | null;
  created_at: string;
  updated_at: string;
  items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  variant_id: number;
  quantity: number;
  price: number;
  created_at: string;
  updated_at: string;
  variant?: ProductVariant;
}

export interface CartItem {
  variant_id: number;
  quantity: number;
  variant?: ProductVariant;
}

export interface CreateOrderData {
  user_name: string;
  user_email: string;
  user_phone: string;
  shipping_address: string;
  items: Array<{ variant_id: number; quantity: number }>;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string | null;
  avatar: string | null;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  user: User;
  token: string;
  message: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
  remember?: boolean;
}

export interface ForgotPasswordData {
  email: string;
}

export interface ResetPasswordData {
  token: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface UpdateProfileData {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface UpdatePasswordData {
  current_password: string;
  password: string;
  password_confirmation: string;
}