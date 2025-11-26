'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Order, OrderStatus } from '../../types';

// Mock admin service (will use real API later)
const adminService = {
    async getAllOrders() {
        const response = await fetch('http://localhost:3001/api/orders/admin/all');
        const data = await response.json();
        return data.data;
    },

    async getStatistics() {
        const response = await fetch('http://localhost:3001/api/orders/admin/statistics');
        const data = await response.json();
        return data.data;
    },

    async updateOrderStatus(orderId: string, status: OrderStatus, tracking?: { trackingNumber: string; carrier: string }) {
        const response = await fetch(`http://localhost:3001/api/orders/admin/${orderId}/status`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, ...tracking })
        });
        const data = await response.json();
        return data.data;
    }
};

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'users'>('overview');
    const [orders, setOrders] = useState<{ orders: Order[]; total: number } | null>(null);
    const [statistics, setStatistics] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            const [ordersData, statsData] = await Promise.all([
                adminService.getAllOrders(),
                adminService.getStatistics()
            ]);
            setOrders(ordersData);
            setStatistics(statsData);
        } catch (error) {
            console.error('Error loading admin data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (orderId: string, newStatus: OrderStatus) => {
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            await loadData(); // Reload data
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-bg-primary flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-accent-copper border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-text-secondary">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-bg-primary">
            {/* Header */}
            <div className="bg-bg-secondary border-b border-text-secondary/10">
                <div className="max-w-7xl mx-auto px-6 py-6">
                    <h1 className="font-display text-5xl mb-2">
                        <span className="text-gradient">ADMIN</span>{' '}
                        <span className="text-text-primary">DASHBOARD</span>
                    </h1>
                    <p className="text-text-secondary">Manage orders, users, and view analytics</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-bg-secondary border-b border-text-secondary/10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex gap-8">
                        {[
                            { id: 'overview', label: 'Overview' },
                            { id: 'orders', label: 'Orders' },
                            { id: 'users', label: 'Users' }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`py-4 px-2 border-b-2 transition-colors font-medium ${activeTab === tab.id
                                    ? 'border-accent-copper text-accent-copper'
                                    : 'border-transparent text-text-secondary hover:text-text-primary'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Content */}
            <div className="max-w-7xl mx-auto px-6 py-12">
                {activeTab === 'overview' && statistics && (
                    <div>
                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10"
                            >
                                <p className="text-text-secondary text-sm mb-2">Total Orders</p>
                                <p className="font-display text-4xl text-gradient">{statistics.total}</p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.1 }}
                                className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10"
                            >
                                <p className="text-text-secondary text-sm mb-2">Total Revenue</p>
                                <p className="font-display text-4xl text-gradient">
                                    ${statistics.totalRevenue.toFixed(2)}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                                className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10"
                            >
                                <p className="text-text-secondary text-sm mb-2">Pending Orders</p>
                                <p className="font-display text-4xl text-accent-orange">
                                    {statistics.byStatus.pending_payment + statistics.byStatus.confirmed}
                                </p>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.3 }}
                                className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10"
                            >
                                <p className="text-text-secondary text-sm mb-2">Delivered</p>
                                <p className="font-display text-4xl text-green-400">
                                    {statistics.byStatus.delivered}
                                </p>
                            </motion.div>
                        </div>

                        {/* Status Breakdown */}
                        <div className="bg-bg-secondary rounded-2xl p-8 border border-text-secondary/10">
                            <h2 className="font-display text-3xl mb-6 text-text-primary">Order Status Breakdown</h2>
                            <div className="space-y-4">
                                {Object.entries(statistics.byStatus).map(([status, count]: [string, any]) => (
                                    <div key={status} className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-3 h-3 rounded-full ${status === 'delivered' ? 'bg-green-400' :
                                                status === 'shipped' ? 'bg-blue-400' :
                                                    status === 'in_production' ? 'bg-yellow-400' :
                                                        status === 'confirmed' ? 'bg-accent-copper' :
                                                            status === 'pending_payment' ? 'bg-accent-orange' :
                                                                'bg-red-400'
                                                }`} />
                                            <span className="text-text-primary capitalize">
                                                {status.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <span className="font-semibold text-text-primary">{count}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'orders' && orders && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-display text-3xl text-text-primary">All Orders ({orders.total})</h2>
                        </div>

                        <div className="space-y-4">
                            {orders.orders.map((order) => (
                                <motion.div
                                    key={order.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="bg-bg-secondary rounded-2xl p-6 border border-text-secondary/10"
                                >
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="font-display text-2xl text-text-primary mb-1">
                                                {order.orderNumber}
                                            </h3>
                                            <p className="text-text-secondary text-sm">
                                                {new Date(order.createdAt).toLocaleDateString()} • {order.shippingName}
                                            </p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-display text-2xl text-gradient">${order.total.toFixed(2)}</p>
                                            <p className="text-text-secondary text-sm">{order.items.length} items</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <select
                                            value={order.status}
                                            onChange={(e) => handleStatusUpdate(order.id, e.target.value as OrderStatus)}
                                            className="px-4 py-2 bg-bg-primary border border-text-secondary/30 rounded-lg text-text-primary focus:border-accent-copper focus:outline-none"
                                        >
                                            <option value="pending_payment">Pending Payment</option>
                                            <option value="confirmed">Confirmed</option>
                                            <option value="in_production">In Production</option>
                                            <option value="shipped">Shipped</option>
                                            <option value="delivered">Delivered</option>
                                            <option value="cancelled">Cancelled</option>
                                            <option value="refunded">Refunded</option>
                                        </select>

                                        {order.trackingNumber && (
                                            <div className="flex items-center gap-2 text-sm text-text-secondary">
                                                <span>Tracking:</span>
                                                <span className="font-mono text-accent-copper">{order.trackingNumber}</span>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {activeTab === 'users' && (
                    <div className="text-center py-20">
                        <h2 className="font-display text-4xl mb-4 text-text-primary">User Management</h2>
                        <p className="text-text-secondary text-lg mb-8">
                            User management features coming soon
                        </p>
                        <div className="inline-block px-8 py-4 bg-bg-secondary rounded-xl border border-text-secondary/20">
                            <p className="text-text-secondary">
                                This section will include user accounts, permissions, and activity logs
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
