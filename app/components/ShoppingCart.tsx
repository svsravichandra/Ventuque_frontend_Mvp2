'use client';

import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../hooks/redux';
import { fetchCart, updateCartItem, removeFromCart, clearCart } from '../../store/slices/cartSlice';

export default function ShoppingCart() {
    const dispatch = useAppDispatch();
    const { cart, loading, error } = useAppSelector((state) => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleQuantityChange = (itemId: string, newQuantity: number) => {
        if (newQuantity >= 1 && newQuantity <= 10) {
            dispatch(updateCartItem({ itemId, quantity: newQuantity }));
        }
    };

    const handleRemoveItem = (itemId: string) => {
        dispatch(removeFromCart(itemId));
    };

    const handleClearCart = () => {
        if (confirm('Are you sure you want to clear your cart?')) {
            dispatch(clearCart());
        }
    };

    if (loading && !cart) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-copper border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading your cart...</p>
                </div>
            </div>
        );
    }

    const isEmpty = !cart || cart.items.length === 0;

    return (
        <div className="min-h-screen bg-bg-primary py-12 px-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-12">
                    <h1 className="font-display text-6xl md:text-8xl mb-4">
                        <span className="text-gradient">SHOPPING</span>
                        <br />
                        <span className="text-text-primary">CART</span>
                    </h1>
                    {!isEmpty && (
                        <p className="text-text-secondary text-xl">
                            {cart.items.reduce((sum, item) => sum + item.quantity, 0)} items in your cart
                        </p>
                    )}
                </div>

                {/* Error Message */}
                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                    >
                        <p className="text-red-400">{error}</p>
                    </motion.div>
                )}

                {isEmpty ? (
                    /* Empty State */
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-20"
                    >
                        <div className="mb-8">
                            <svg
                                className="w-32 h-32 mx-auto text-text-secondary/30"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                                />
                            </svg>
                        </div>
                        <h2 className="font-display text-4xl mb-4 text-text-primary">Your cart is empty</h2>
                        <p className="text-text-secondary text-lg mb-8">
                            Start creating your custom figurine!
                        </p>
                        <motion.a
                            href="/customize"
                            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212, 119, 60, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            className="inline-block px-12 py-5 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold text-lg"
                        >
                            Create Figurine
                        </motion.a>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Cart Items */}
                        <div className="lg:col-span-2 space-y-4">
                            <AnimatePresence>
                                {cart.items.map((item) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10 hover:border-accent-copper/30 transition-colors"
                                    >
                                        <div className="flex items-center gap-6">
                                            {/* Placeholder Image */}
                                            <div className="w-24 h-24 bg-bg-primary rounded-xl flex items-center justify-center flex-shrink-0">
                                                <svg
                                                    className="w-12 h-12 text-text-secondary/50"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={1.5}
                                                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                                                    />
                                                </svg>
                                            </div>

                                            {/* Item Details */}
                                            <div className="flex-1">
                                                <h3 className="font-display text-2xl mb-1 text-text-primary">
                                                    Custom Figurine
                                                </h3>
                                                <p className="text-text-secondary text-sm mb-2">
                                                    Customization ID: {item.customizationId.slice(0, 8)}...
                                                </p>
                                                <p className="text-accent-copper font-semibold text-lg">
                                                    ${item.unitPrice.toFixed(2)} each
                                                </p>
                                            </div>

                                            {/* Quantity Controls */}
                                            <div className="flex items-center gap-3">
                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                    className="w-10 h-10 rounded-full bg-bg-primary hover:bg-accent-copper/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                                                    </svg>
                                                </motion.button>

                                                <span className="w-12 text-center font-semibold text-xl text-text-primary">
                                                    {item.quantity}
                                                </span>

                                                <motion.button
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                                    disabled={item.quantity >= 10}
                                                    className="w-10 h-10 rounded-full bg-bg-primary hover:bg-accent-copper/20 disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                                    </svg>
                                                </motion.button>
                                            </div>

                                            {/* Item Total */}
                                            <div className="text-right min-w-[100px]">
                                                <p className="text-text-secondary text-sm mb-1">Total</p>
                                                <p className="font-display text-2xl text-gradient">
                                                    ${item.totalPrice.toFixed(2)}
                                                </p>
                                            </div>

                                            {/* Remove Button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => handleRemoveItem(item.id)}
                                                className="p-2 hover:bg-red-500/20 rounded-lg transition-colors"
                                            >
                                                <svg
                                                    className="w-6 h-6 text-red-400"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                                                    />
                                                </svg>
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Clear Cart Button */}
                            {cart.items.length > 0 && (
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleClearCart}
                                    className="w-full py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors font-medium"
                                >
                                    Clear Cart
                                </motion.button>
                            )}
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 bg-bg-secondary rounded-3xl p-8 border border-text-secondary/10">
                                <h2 className="font-display text-3xl mb-6 text-text-primary">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Subtotal</span>
                                        <span className="font-medium">${cart.subtotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Shipping</span>
                                        <span className="font-medium">${cart.shipping.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-text-secondary">
                                        <span>Tax (8%)</span>
                                        <span className="font-medium">${cart.tax.toFixed(2)}</span>
                                    </div>
                                    <div className="pt-4 border-t border-text-secondary/20">
                                        <div className="flex justify-between items-center">
                                            <span className="font-display text-2xl text-text-primary">Total</span>
                                            <span className="font-display text-4xl text-gradient">
                                                ${cart.total.toFixed(2)}
                                            </span>
                                >
                                            Continue Shopping
                                        </motion.a>
                                    </div>
                                </div>
                            </div>
                )}
                        </div>
                    </div>
                );
}
