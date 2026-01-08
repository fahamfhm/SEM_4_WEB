import api from './api';

export interface OrderItem {
  menuItemId?: string;
  id?: string;
  name: string;
  basePrice: number;
  quantity: number;
  customizations?: Record<string, any>;
  itemTotal: number;
}

export interface GuestInfo {
  name: string;
  phone: string;
}

export interface CreateOrderRequest {
  items: OrderItem[];
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  paymentMethod: 'card' | 'cash';
  specialNotes?: string;
  guestSessionId?: string;
  guestInfo?: GuestInfo;
}

export interface Order {
  _id: string;
  orderNumber: string;
  user?: string;
  guestSessionId?: string;
  guestInfo?: GuestInfo;
  items: OrderItem[];
  orderType: 'dine-in' | 'takeaway';
  tableNumber?: string;
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  paymentMethod: 'card' | 'cash';
  paymentStatus: 'pending' | 'paid' | 'failed' | 'refunded';
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'served' | 'completed' | 'cancelled';
  specialNotes?: string;
  orderedAt: string;
  confirmedAt?: string;
  preparedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrdersResponse {
  success: boolean;
  count: number;
  data: Order[];
}

export interface OrderResponse {
  success: boolean;
  data: Order;
}

class OrderService {
  // Generate or retrieve guest session ID
  static getGuestSessionId(): string {
    let sessionId = localStorage.getItem('guestSessionId');
    if (!sessionId) {
      sessionId = `guest_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      localStorage.setItem('guestSessionId', sessionId);
    }
    return sessionId;
  }

  // Check if user has active guest session with orders
  static hasGuestSession(): boolean {
    return !!localStorage.getItem('guestSessionId');
  }

  // Clear guest session
  static clearGuestSession(): void {
    localStorage.removeItem('guestSessionId');
  }

  // Create new order
  static async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    console.log('Creating order with data:', orderData);
    console.log('API base URL:', import.meta.env.VITE_API_URL || 'http://localhost:5000/api');
    const response = await api.post<OrderResponse>('/orders', orderData);
    console.log('Order created successfully:', response.data);
    return response.data.data;
  }

  // Get orders (authenticated user or guest)
  static async getOrders(guestSessionId?: string): Promise<Order[]> {
    const params = guestSessionId ? { guestSessionId } : {};
    const response = await api.get<OrdersResponse>('/orders', { params });
    return response.data.data;
  }

  // Get single order by ID
  static async getOrder(orderId: string, guestSessionId?: string): Promise<Order> {
    const params = guestSessionId ? { guestSessionId } : {};
    const response = await api.get<OrderResponse>(`/orders/${orderId}`, { params });
    return response.data.data;
  }

  // Cancel order
  static async cancelOrder(orderId: string, guestSessionId?: string): Promise<Order> {
    const data = guestSessionId ? { guestSessionId } : {};
    const response = await api.put<OrderResponse>(`/orders/${orderId}/cancel`, data);
    return response.data.data;
  }

  // Admin/Kitchen: Get all orders
  static async getAllOrders(filters?: {
    status?: string;
    orderType?: string;
    limit?: number;
    page?: number;
  }): Promise<{ orders: Order[]; total: number; pages: number }> {
    const response = await api.get<{
      success: boolean;
      count: number;
      total: number;
      page: number;
      pages: number;
      data: Order[];
    }>('/orders/admin/all', { params: filters });
    return {
      orders: response.data.data,
      total: response.data.total,
      pages: response.data.pages,
    };
  }

  // Admin/Kitchen: Update order status
  static async updateOrderStatus(orderId: string, status: Order['status']): Promise<Order> {
    const response = await api.put<OrderResponse>(`/orders/${orderId}/status`, { status });
    return response.data.data;
  }
}

export default OrderService;
