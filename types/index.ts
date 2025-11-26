export interface CartItem {
    id: string;
    customizationId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    addedAt: string;
}

export interface Cart {
    userId: string;
    items: CartItem[];
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    updatedAt: string;
}

export interface Customization {
    id: string;
    userId: string;
    photoId: string;
    style: string;
    finish: string;
    mountType: string;
    personalizationText?: string;
    previewStatus: 'pending' | 'generating' | 'ready' | 'failed';
    previewS3Key?: string;
    modelS3Key?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ProductOption {
    id: string;
    name: string;
    price: number;
    description?: string;
    image?: string;
}

export interface ProductOptions {
    styles: ProductOption[];
    finishes: ProductOption[];
    mountTypes: ProductOption[];
}

export interface Photo {
    id: string;
    userId: string;
    s3Key: string;
    s3Url: string;
    fileName: string;
    fileSize: number;
    mimeType: string;
    status: 'uploaded' | 'processing' | 'ready' | 'flagged';
    moderationStatus: 'pending' | 'approved' | 'rejected';
    createdAt: string;
}

export type OrderStatus =
    | 'pending_payment'
    | 'confirmed'
    | 'in_production'
    | 'shipped'
    | 'delivered'
    | 'cancelled'
    | 'refunded';

export interface OrderItem {
    id: string;
    customizationId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
}

export interface Order {
    id: string;
    orderNumber: string;
    userId: string;
    status: OrderStatus;
    items: OrderItem[];
    subtotal: number;
    shippingCost: number;
    tax: number;
    total: number;
    currency: string;
    shippingName: string;
    shippingAddressLine1: string;
    shippingAddressLine2?: string;
    shippingCity: string;
    shippingState: string;
    shippingZip: string;
    shippingCountry: string;
    trackingNumber?: string;
    carrier?: string;
    createdAt: string;
    updatedAt: string;
}

export interface ShippingAddress {
    name: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
    country?: string;
}
