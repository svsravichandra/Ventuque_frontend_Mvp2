'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { orderService } from '../../../services/order.service';
import { Order } from '../../../types';

export default function OrderConfirmationPage() {
    const params = useParams();
    const orderId = params.id as string;

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const orderData = await orderService.getOrderById(orderId);
                setOrder(orderData);
            } catch (err) {
                console.error('Error fetching order:', err);
                setError(err instanceof Error ? err.message : 'Failed to load order');
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-copper border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading order details...</p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-display text-4xl mb-4 text-text-primary">Order Not Found</h2>
                    <p className="text-text-secondary mb-8">{error || 'Unable to load order details'}</p>
                    <motion.a
                        href="/cart"
                        whileHover={{ scale: 1.05 }}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold"
                    >
                        Back to Cart
                    </motion.a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-6">
            <div className="max-w-4xl mx-auto">
                {/* Success Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: 'spring' }}
                        className="w-24 h-24 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full flex items-center justify-center mx-auto mb-6"
                    >
                        <svg className="w-12 h-12 text-bg-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </motion.div>

                    <h1 className="font-display text-6xl md:text-8xl mb-4">
                        <span className="text-gradient">ORDER</span>
                        <br />
                        <span className="text-text-primary">CONFIRMED!</span>
                    </h1>

                    <p className="text-text-secondary text-xl mb-2">
                        Thank you for your order!
                    </p>
                    <p className="text-accent-copper text-2xl font-semibold">
                        Order #{order.orderNumber}
                    </p>
                </motion.div>

                {/* Order Details */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-bg-secondary rounded-3xl p-8 border border-text-secondary/10 mb-8"
                >
                    <h2 className="font-display text-3xl mb-6 text-text-primary">Order Details</h2>

                    <div className="space-y-4 mb-6">
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Order Number</span>
                            <span className="text-text-primary font-semibold">{order.orderNumber}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Status</span>
                            <span className="px-3 py-1 bg-accent-copper/20 text-accent-copper rounded-full text-sm font-medium">
                                {order.status.replace('_', ' ').toUpperCase()}
                            </span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-text-secondary">Order Date</span>
                            <span className="text-text-primary">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>

                    <div className="border-t border-text-secondary/20 pt-6">
                        <h3 className="font-display text-2xl mb-4 text-text-primary">Items</h3>
                        {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between mb-3">
                                <span className="text-text-secondary">
                                    Custom Figurine x{item.quantity}
                                </span>
                                <span className="text-text-primary font-medium">
                                    ${item.totalPrice.toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>

                    <div className="border-t border-text-secondary/20 pt-6 mt-6">
                        <div className="space-y-3">
                            <div className="flex justify-between text-text-secondary">
                                <span>Subtotal</span>
                                <span>${order.subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Shipping</span>
                                <span>${order.shippingCost.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-text-secondary">
                                <span>Tax</span>
                                <span>${order.tax.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between items-center pt-3 border-t border-text-secondary/20">
                                <span className="font-display text-2xl text-text-primary">Total</span>
                                <span className="font-display text-4xl text-gradient">
                                    ${order.total.toFixed(2)}
                                </span>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Shipping Address */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-bg-secondary rounded-3xl p-8 border border-text-secondary/10 mb-8"
                >
                    <h2 className="font-display text-3xl mb-6 text-text-primary">Shipping Address</h2>
                    <div className="text-text-secondary space-y-1">
                        <p className="text-text-primary font-semibold">{order.shippingName}</p>
                        <p>{order.shippingAddressLine1}</p>
                        {order.shippingAddressLine2 && <p>{order.shippingAddressLine2}</p>}
                        <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                        <p>{order.shippingCountry}</p>
                    </div>
                </motion.div>

                {/* Actions */}
                <div className="flex gap-4">
                    <motion.a
                        href="/customize"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 text-center bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold"
                    >
                        Create Another Figurine
                    </motion.a>
                    <motion.a
                        href="/"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="flex-1 py-4 text-center border-2 border-text-secondary/30 rounded-full text-text-primary font-medium hover:border-accent-copper/50 transition-colors"
                    >
                        Back to Home
                    </motion.a>
                </div>
            </div>
        </div>
    );
}
