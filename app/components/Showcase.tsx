'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const showcaseItems = [
    {
        title: 'On Your Vent',
        description: 'Perfect car companion',
        image: '/images/ChatGPT Image Nov 17, 2025, 12_51_33 PM.png'
    },
    {
        title: 'Multiple Styles',
        description: 'Collect them all',
        image: '/images/ChatGPT Image Nov 17, 2025, 01_05_06 PM.png'
    },
    {
        title: 'Premium Detail',
        description: 'Crafted with care',
        image: '/images/ChatGPT Image Nov 17, 2025, 01_07_41 PM.png'
    }
];

export default function Showcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.8, 1, 0.8]);
    const rotate = useTransform(scrollYProgress, [0, 1], [0, 360]);

    useEffect(() => {
        if (!containerRef.current) return;

        const ctx = gsap.context(() => {
            // Parallax effect for showcase items
            gsap.to('.showcase-item', {
                scrollTrigger: {
                    trigger: containerRef.current,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                y: (i) => (i % 2 === 0 ? -100 : 100),
                ease: 'none'
            });

            // Text reveal animation
            if (titleRef.current) {
                const chars = titleRef.current.textContent?.split('') || [];
                titleRef.current.innerHTML = chars
                    .map((char) => `<span class="inline-block">${char === ' ' ? '&nbsp;' : char}</span>`)
                    .join('');

                gsap.from(titleRef.current.children, {
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 80%',
                    },
                    opacity: 0,
                    y: 50,
                    rotateX: -90,
                    stagger: 0.02,
                    duration: 0.8,
                    ease: 'back.out(1.7)'
                });
            }
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-32 px-6 overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 bg-bg-primary">
                <motion.div
                    style={{ rotate }}
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-accent-copper/10 to-accent-orange/10 rounded-full blur-[100px]"
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Title */}
                <h2
                    ref={titleRef}
                    className="font-display text-6xl md:text-8xl lg:text-9xl text-center mb-20 perspective-1000"
                >
                    <span className="text-gradient">GALLERY</span>
                </h2>

                {/* Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {showcaseItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="showcase-item group relative aspect-square rounded-3xl overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={isInView ? { opacity: 1, scale: 1 } : {}}
                            transition={{ duration: 0.6, delay: index * 0.2 }}
                            whileHover={{ scale: 1.05 }}
                            style={{ scale }}
                        >
                            {/* Product Image */}
                            <div className="absolute inset-0">
                                <Image
                                    src={item.image}
                                    alt={item.title}
                                    fill
                                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                                    sizes="(max-width: 768px) 100vw, 33vw"
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500" />

                            {/* Content */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                                <h3 className="font-display text-3xl md:text-4xl mb-2 text-text-primary">
                                    {item.title}
                                </h3>
                                <p className="text-text-secondary text-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    {item.description}
                                </p>
                            </div>

                            {/* Glow Effect */}
                            <div
                                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                style={{
                                    boxShadow: `inset 0 0 60px rgba(212, 119, 60, 0.4)`
                                }}
                            />
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, delay: 0.8 }}
                    className="text-center mt-20"
                >
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="px-12 py-5 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold text-lg shadow-lg hover:shadow-2xl transition-shadow duration-300"
                    >
                        View Full Gallery
                    </motion.button>
                </motion.div>
            </div>
        </section>
    );
}
