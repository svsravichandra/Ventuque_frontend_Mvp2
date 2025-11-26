import { apiClient } from '../lib/api-client';
import { Order, ShippingAddress } from '../types';

export const orderService = {
    /**
     * Create order from cart
     */
    async createOrder(shippingAddress: ShippingAddress): Promise<Order> {
        return apiClient.post<Order>('/api/orders', { shippingAddress });
    },

    /**
     * Get user's orders
     */
    async getOrders(): Promise<Order[]> {
        return apiClient.get<Order[]>('/api/orders');
    },

    /**
     * Get order by ID
     */
    async getOrderById(id: string): Promise<Order> {
        return apiClient.get<Order>(`/api/orders/${id}`);
    },

    /**
     * Get order by order number
     */
    async getOrderByNumber(orderNumber: string): Promise<Order> {
        return apiClient.get<Order>(`/api/orders/number/${orderNumber}`);
    },

    /**
     * Cancel order
     */
    async cancelOrder(id: string): Promise<Order> {
        return apiClient.patch<Order>(`/api/orders/${id}/cancel`, {});
    }
};
