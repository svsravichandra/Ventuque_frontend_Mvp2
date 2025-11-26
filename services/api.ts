import { apiClient } from '../lib/api-client';
import { Cart, Customization } from '../types';

export const cartService = {
    /**
     * Get current user's cart
     */
    async getCart(): Promise<Cart> {
        return apiClient.get<Cart>('/api/cart');
    },

    /**
     * Get cart item count
     */
    async getCartCount(): Promise<number> {
        const data = await apiClient.get<{ count: number }>('/api/cart/count');
        return data.count;
    },

    /**
     * Add item to cart
     */
    async addToCart(customizationId: string, quantity: number = 1): Promise<Cart> {
        return apiClient.post<Cart>('/api/cart', {
            customizationId,
            quantity
        });
    },

    /**
     * Update cart item quantity
     */
    async updateCartItem(itemId: string, quantity: number): Promise<Cart> {
        return apiClient.patch<Cart>(`/api/cart/${itemId}`, { quantity });
    },

    /**
     * Remove item from cart
     */
    async removeFromCart(itemId: string): Promise<Cart> {
        return apiClient.delete<Cart>(`/api/cart/${itemId}`);
    },

    /**
     * Clear entire cart
     */
    async clearCart(): Promise<Cart> {
        return apiClient.delete<Cart>('/api/cart');
    }
};

export const customizationService = {
    /**
     * Get product options
     */
    async getOptions() {
        return apiClient.get('/api/customization/options');
    },

    /**
     * Calculate price for customization
     */
    async calculatePrice(options: {
        style: string;
        finish: string;
        mountType: string;
    }): Promise<number> {
        const data = await apiClient.post<{ price: number }>(
            '/api/customization/calculate-price',
            options
        );
        return data.price;
    },

    /**
     * Create customization
     */
    async createCustomization(data: {
        photoId: string;
        style: string;
        finish: string;
        mountType: string;
        personalizationText?: string;
    }): Promise<Customization> {
        return apiClient.post<Customization>('/api/customization', data);
    },

    /**
     * Get user's customizations
     */
    async getCustomizations(): Promise<Customization[]> {
        return apiClient.get<Customization[]>('/api/customization');
    },

    /**
     * Get customization by ID
     */
    async getCustomizationById(id: string): Promise<Customization> {
        return apiClient.get<Customization>(`/api/customization/${id}`);
    }
};
