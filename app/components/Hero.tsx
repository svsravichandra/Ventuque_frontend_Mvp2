'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Cinematic entrance animation
            gsap.from('.hero-title', {
                y: 100,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out',
                stagger: 0.2
            });

            gsap.from('.hero-subtitle', {
                y: 50,
                opacity: 0,
                duration: 1,
                delay: 0.5,
                ease: 'power3.out'
            });

            gsap.from('.hero-cta', {
                scale: 0.8,
                opacity: 0,
                duration: 0.8,
                delay: 0.8,
                ease: 'back.out(1.7)'
            });

            // Floating animation for decorative elements
            gsap.to('.float-element', {
                y: -30,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.3
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <motion.section
            ref={containerRef}
            style={{ y, opacity }}
            className="relative min-h-screen flex items-center justify-center overflow-hidden"
        >
            {/* Hero Background Image */}
            <div className="absolute inset-0">
                <Image
                    src="/images/HEro section background.png"
                    alt="Ventique chibi figurine"
                    fill
                    className="object-cover object-center"
                    priority
                    quality={90}
                />
                {/* Stronger dark overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
            </div>

            {/* Animated Gradient Orbs */}
            <div className="absolute top-1/4 -left-32 w-96 h-96 bg-accent-copper/20 rounded-full blur-[120px] float-element" />
            <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-accent-orange/20 rounded-full blur-[120px] float-element" style={{ animationDelay: '1s' }} />

            {/* Content */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1 }}
                >
                    {/* Eyebrow */}
                    <p className="hero-subtitle text-accent-copper text-sm md:text-base tracking-[0.3em] uppercase mb-6 font-medium drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                        Transform Your Memories
                    </p>

                    {/* Main Headline with Strong Text Shadow */}
                    <h1 className="hero-title font-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.9] mb-8">
                        <span className="block animate-shimmer drop-shadow-[0_8px_16px_rgba(0,0,0,1)]">VENTIQUE</span>
                    </h1>

                    {/* Subheadline with Enhanced Contrast */}
                    <h2 className="hero-title text-3xl md:text-5xl lg:text-6xl font-body font-light text-white mb-12 max-w-4xl mx-auto drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                        Turn your photos into{' '}
                        <span className="text-gradient font-semibold drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">custom 3D-printed</span>
                        {' '}chibi car vent figurines
                    </h2>

                    {/* CTA Buttons */}
                    <div className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center">
                        <motion.button
                            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212, 119, 60, 0.5)' }}
                            whileTap={{ scale: 0.95 }}
                            className="group relative px-12 py-5 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold text-lg overflow-hidden transition-all duration-300 shadow-2xl"
                        >
                            <span className="relative z-10">Start Creating</span>
                            <motion.div
                                className="absolute inset-0 bg-white/20"
                                initial={{ x: '-100%' }}
                                whileHover={{ x: '100%' }}
                                transition={{ duration: 0.5 }}
                            />
                        </motion.button>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="px-12 py-5 border-2 border-accent-copper rounded-full text-white font-semibold text-lg hover:bg-accent-copper/20 transition-all duration-300 backdrop-blur-sm bg-black/30 shadow-xl"
                        >
                            See Examples
                        </motion.button>
                    </div>

                    {/* Scroll Indicator */}
                    <motion.div
                        className="absolute bottom-12 left-1/2 -translate-x-1/2"
                        animate={{ y: [0, 10, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                    >
                        <div className="w-6 h-10 border-2 border-accent-copper rounded-full flex justify-center pt-2 backdrop-blur-sm bg-black/30 shadow-lg">
                            <motion.div
                                className="w-1.5 h-1.5 bg-accent-copper rounded-full shadow-[0_0_8px_rgba(212,119,60,0.8)]"
                                animate={{ y: [0, 16, 0] }}
                                transition={{ duration: 2, repeat: Infinity }}
                            />
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </motion.section>
    );
}
