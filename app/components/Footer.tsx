'use client';

import { motion } from 'framer-motion';

const footerLinks = {
    product: ['Features', 'Pricing', 'Gallery', 'FAQ'],
    company: ['About', 'Blog', 'Careers', 'Contact'],
    legal: ['Privacy', 'Terms', 'Cookies', 'Licenses'],
    social: ['Instagram', 'Twitter', 'Facebook', 'TikTok']
};

export default function Footer() {
    return (
        <footer className="relative bg-bg-secondary border-t border-accent-copper/20">
            {/* Top Gradient Line */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-accent-copper to-transparent" />

            <div className="max-w-7xl mx-auto px-6 py-20">
                {/* Main Footer Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="lg:col-span-2">
                        <motion.h3
                            className="font-display text-5xl mb-4 text-gradient"
                            whileHover={{ scale: 1.05 }}
                        >
                            VENTIQUE
                        </motion.h3>
                        <p className="text-text-secondary text-lg mb-6 max-w-md">
                            Transform your memories into unique 3D-printed chibi figurines. Premium quality, personalized for you.
                        </p>
                        {/* Newsletter */}
                        <div className="flex gap-2">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-4 py-3 bg-bg-primary border border-accent-copper/30 rounded-full text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent-copper transition-colors"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="px-6 py-3 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold"
                            >
                                Subscribe
                            </motion.button>
                        </div>
                    </div>

                    {/* Links Columns */}
                    {Object.entries(footerLinks).map(([category, links]) => (
                        <div key={category}>
                            <h4 className="font-display text-xl text-text-primary mb-4 uppercase tracking-wider">
                                {category}
                            </h4>
                            <ul className="space-y-3">
                                {links.map((link) => (
                                    <li key={link}>
                                        <motion.a
                                            href="#"
                                            className="text-text-secondary hover:text-accent-copper transition-colors duration-300 inline-block"
                                            whileHover={{ x: 5 }}
                                        >
                                            {link}
                                        </motion.a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-accent-copper/10 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-text-muted text-sm">
                        © 2024 Ventique. All rights reserved.
                    </p>
                    <div className="flex gap-6">
                        {['Instagram', 'Twitter', 'Facebook'].map((social) => (
                            <motion.a
                                key={social}
                                href="#"
                                className="w-10 h-10 rounded-full border border-accent-copper/30 flex items-center justify-center text-text-secondary hover:text-accent-copper hover:border-accent-copper transition-all duration-300"
                                whileHover={{ scale: 1.1, rotate: 5 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <span className="text-xl">{social[0]}</span>
                            </motion.a>
                        ))}
                    </div>
                </div>
            </div>

            {/* Decorative Bottom Gradient */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent-copper via-accent-orange to-accent-gold" />
        </footer>
    );
}
