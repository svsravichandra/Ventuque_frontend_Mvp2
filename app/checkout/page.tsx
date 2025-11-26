'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { useAppSelector } from '../../hooks/redux';
import { orderService } from '../../services/order.service';
import { ShippingAddress } from '../../types';

export default function CheckoutPage() {
    const router = useRouter();
    const { cart } = useAppSelector((state) => state.cart);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [shippingAddress, setShippingAddress] = useState<ShippingAddress>({
        name: '',
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: 'US'
    });

    const handleInputChange = (field: keyof ShippingAddress, value: string) => {
        setShippingAddress(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const order = await orderService.createOrder(shippingAddress);
            console.log('Order created:', order);
            router.push(`/orders/${order.id}`);
        } catch (err) {
            console.error('Error creating order:', err);
            setError(err instanceof Error ? err.message : 'Failed to create order');
            setLoading(false);
        }
    };

    if (!cart || cart.items.length === 0) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-display text-4xl mb-4 text-text-primary">Your cart is empty</h2>
                    <p className="text-text-secondary mb-8">Add items before checking out</p>
                    <motion.a
                        href="/customize"
                        whileHover={{ scale: 1.05 }}
                        className="inline-block px-8 py-4 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold"
                    >
                        Create Figurine
                    </motion.a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-6">
            <div className="max-w-7xl mx-auto">
                <h1 className="font-display text-6xl md:text-8xl mb-12">
                    <span className="text-gradient">CHECKOUT</span>
                </h1>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                    >
                        <p className="text-red-400">{error}</p>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Shipping Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="bg-bg-secondary rounded-3xl p-8 border border-text-secondary/10">
                            <h2 className="font-display text-3xl mb-6 text-text-primary">Shipping Information</h2>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-text-secondary mb-2 font-medium">Full Name *</label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingAddress.name}
                                        onChange={(e) => handleInputChange('name', e.target.value)}
                                        className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                        placeholder="John Doe"
                                    />
                                </div>

                                <div>
                                    <label className="block text-text-secondary mb-2 font-medium">Address Line 1 *</label>
                                    <input
                                        type="text"
                                        required
                                        value={shippingAddress.line1}
                                        onChange={(e) => handleInputChange('line1', e.target.value)}
                                        className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                        placeholder="123 Main St"
                                    />
                                </div>

                                <div>
                                    <label className="block text-text-secondary mb-2 font-medium">Address Line 2</label>
                                    <input
                                        type="text"
                                        value={shippingAddress.line2 || ''}
                                        onChange={(e) => handleInputChange('line2', e.target.value)}
                                        className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                        placeholder="Apt 4B (optional)"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-text-secondary mb-2 font-medium">City *</label>
                                        <input
                                            type="text"
                                            required
                                            value={shippingAddress.city}
                                            onChange={(e) => handleInputChange('city', e.target.value)}
                                            className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                            placeholder="San Francisco"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-text-secondary mb-2 font-medium">State *</label>
                                        <input
                                            type="text"
                                            required
                                            maxLength={2}
                                            value={shippingAddress.state}
                                            onChange={(e) => handleInputChange('state', e.target.value.toUpperCase())}
                                            className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                            placeholder="CA"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-text-secondary mb-2 font-medium">ZIP Code *</label>
                                        <input
                                            type="text"
                                            required
                                            pattern="[0-9]{5}"
                                            value={shippingAddress.zip}
                                            onChange={(e) => handleInputChange('zip', e.target.value)}
                                            className="w-full px-4 py-3 bg-bg-primary border border-text-secondary/30 rounded-xl text-text-primary focus:border-accent-copper focus:outline-none transition-colors"
                                            placeholder="94102"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-text-secondary mb-2 font-medium">Country</label>
                                        <input
                                            type="text"
                                            value="United States"
                                            disabled
                                            className="w-full px-4 py-3 bg-bg-primary/50 border border-text-secondary/30 rounded-xl text-text-secondary cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                            </div>

                            <motion.button
                                type="submit"
                                disabled={loading}
                                whileHover={!loading ? { scale: 1.02 } : {}}
                                whileTap={!loading ? { scale: 0.98 } : {}}
                                className="w-full mt-8 py-5 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Processing...' : 'Place Order'}
                            </motion.button>
                        </form>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 bg-bg-secondary rounded-3xl p-8 border border-text-secondary/10">
                            <h2 className="font-display text-3xl mb-6 text-text-primary">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-text-secondary">
                                    <span>Items ({cart.items.reduce((sum, item) => sum + item.quantity, 0)})</span>
                                    <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Shipping</span>
                                    <span className="font-medium">${cart.shipping.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-text-secondary">
                                    <span>Tax</span>
                                    <span className="font-medium">${cart.tax.toFixed(2)}</span>
                                </div>
                                <div className="pt-4 border-t border-text-secondary/20">
                                    <div className="flex justify-between items-center">
                                        <span className="font-display text-2xl text-text-primary">Total</span>
                                        <span className="font-display text-4xl text-gradient">
                                            ${cart.total.toFixed(2)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-3">
                                {cart.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Custom Figurine x{item.quantity}</span>
                                        <span className="text-text-primary font-medium">${item.totalPrice.toFixed(2)}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
