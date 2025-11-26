'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';

const features = [
    {
        title: 'Upload Your Photo',
        description: 'Simply upload any photo and watch our AI transform it into a chibi-style 3D model',
        icon: '📸',
        gradient: 'from-accent-copper to-accent-orange'
    },
    {
        title: 'Customize Everything',
        description: 'Choose from multiple styles, finishes, and mount options to make it uniquely yours',
        icon: '🎨',
        gradient: 'from-accent-orange to-accent-gold'
    },
    {
        title: 'Real-Time 3D Preview',
        description: 'See your figurine come to life with our interactive 3D viewer before you buy',
        icon: '👁️',
        gradient: 'from-accent-gold to-accent-copper'
    },
    {
        title: 'Premium Quality',
        description: 'High-quality 3D printing with attention to every detail, delivered to your door',
        icon: '✨',
        gradient: 'from-accent-copper to-accent-orange'
    }
];

export default function Features() {
    const containerRef = useRef<HTMLDivElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    return (
        <section ref={containerRef} className="relative py-32 px-6 bg-bg-secondary">
            {/* Background Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary opacity-50" />

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8 }}
                    className="text-center mb-20"
                >
                    <h2 className="font-display text-6xl md:text-8xl mb-6">
                        <span className="text-gradient">HOW IT WORKS</span>
                    </h2>
                    <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto font-light">
                        From photo to figurine in four simple steps
                    </p>
                </motion.div>

                {/* Features Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 50 }}
                            animate={isInView ? { opacity: 1, y: 0 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ y: -10, transition: { duration: 0.3 } }}
                            className="group relative card rounded-3xl p-8 md:p-12 overflow-hidden"
                        >
                            {/* Hover Gradient Effect */}
                            <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />

                            {/* Number */}
                            <div className="absolute top-8 right-8 font-display text-8xl text-text-muted/20 group-hover:text-accent-copper/30 transition-colors duration-500">
                                {String(index + 1).padStart(2, '0')}
                            </div>

                            {/* Icon */}
                            <motion.div
                                className="text-6xl mb-6"
                                whileHover={{ scale: 1.2, rotate: 10 }}
                                transition={{ type: 'spring', stiffness: 300 }}
                            >
                                {feature.icon}
                            </motion.div>

                            {/* Content */}
                            <h3 className="font-display text-3xl md:text-4xl mb-4 text-text-primary group-hover:text-gradient transition-all duration-300">
                                {feature.title}
                            </h3>
                            <p className="text-text-secondary text-lg leading-relaxed">
                                {feature.description}
                            </p>

                            {/* Decorative Line */}
                            <motion.div
                                className={`h-1 bg-gradient-to-r ${feature.gradient} mt-8 rounded-full`}
                                initial={{ width: 0 }}
                                whileInView={{ width: '100%' }}
                                transition={{ duration: 0.8, delay: index * 0.2 + 0.3 }}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
