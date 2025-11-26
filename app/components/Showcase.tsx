'use client';

import { motion, useScroll, useTransform, useInView } from 'framer-motion';
import { useRef, useEffect, useState, MouseEvent } from 'react';
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
        image: '/images/ChatGPT Image Nov 17, 2025, 12_51_33 PM.png',
        color: '#d4773c'
    },
    {
        title: 'Multiple Styles',
        description: 'Collect them all',
        image: '/images/ChatGPT Image Nov 17, 2025, 01_05_06 PM.png',
        color: '#ff6b35'
    },
    {
        title: 'Premium Detail',
        description: 'Crafted with care',
        image: '/images/ChatGPT Image Nov 17, 2025, 01_07_41 PM.png',
        color: '#f4a261'
    }
];

export default function Showcase() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const isInView = useInView(containerRef, { once: true, margin: '-100px' });
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start end", "end start"]
    });

    const rotate = useTransform(scrollYProgress, [0, 1], [0, 180]);

    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });

        // Magnetic effect
        const magneticElements = document.querySelectorAll('.magnetic-showcase');
        magneticElements.forEach((el) => {
            const htmlEl = el as HTMLElement;
            const elRect = htmlEl.getBoundingClientRect();
            const elCenterX = elRect.left + elRect.width / 2;
            const elCenterY = elRect.top + elRect.height / 2;
            const deltaX = e.clientX - elCenterX;
            const deltaY = e.clientY - elCenterY;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
            const magneticRadius = 150;

            if (distance < magneticRadius) {
                const strength = (1 - distance / magneticRadius) * 20;
                htmlEl.style.transform = `translate(${deltaX * strength / 100}px, ${deltaY * strength / 100}px) scale(1.05) rotateY(${deltaX * 0.05}deg) rotateX(${-deltaY * 0.05}deg)`;
            } else {
                htmlEl.style.transform = 'translate(0, 0) scale(1) rotateY(0deg) rotateX(0deg)';
            }
        });
    };

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
                y: (i) => (i % 2 === 0 ? -80 : 80),
                ease: 'none'
            });

            // Text reveal animation
            if (titleRef.current) {
                const text = titleRef.current.textContent || '';
                const chars = text.split('');
                titleRef.current.innerHTML = chars
                    .map((char) => `<span class="inline-block" style="transform-style: preserve-3d;">${char === ' ' ? '&nbsp;' : char}</span>`)
                    .join('');

                gsap.from(titleRef.current.children, {
                    scrollTrigger: {
                        trigger: titleRef.current,
                        start: 'top 85%',
                    },
                    opacity: 0,
                    y: 60,
                    rotateX: -90,
                    rotateZ: 10,
                    scale: 0.5,
                    stagger: 0.03,
                    duration: 1,
                    ease: 'elastic.out(1, 0.5)'
                });
            }

            // Pulsing glow
            gsap.to('.glow-orb-showcase', {
                scale: 1.3,
                opacity: 0.3,
                duration: 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={containerRef} className="relative py-32 px-6 overflow-hidden bg-bg-primary" onMouseMove={handleMouseMove}>
            {/* Animated Background */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <motion.div
                    style={{ rotate }}
                    className="glow-orb-showcase absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-15"
                >
                    <div
                        style={{
                            background: 'radial-gradient(circle, rgba(212, 119, 60, 0.4), transparent 70%)',
                            width: '100%',
                            height: '100%',
                            borderRadius: `${45 + mousePos.x * 15}% ${55 - mousePos.x * 15}% ${55 + mousePos.y * 15}% ${45 - mousePos.y * 15}%`,
                            filter: 'blur(140px)',
                            animation: 'morph-showcase 18s ease-in-out infinite'
                        }}
                    />
                </motion.div>

                {/* Additional morphing blobs */}
                <div
                    className="absolute top-[20%] right-[10%] w-[40%] h-[40%] opacity-10 transition-all duration-[2000ms]"
                    style={{
                        background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3), transparent 70%)',
                        transform: `translate(${-mousePos.x * 30}px, ${mousePos.y * 30}px)`,
                        borderRadius: `${60 - mousePos.y * 20}% ${40 + mousePos.y * 20}% ${50 - mousePos.x * 20}% ${50 + mousePos.x * 20}%`,
                        filter: 'blur(120px)',
                        animation: 'morph-showcase 22s ease-in-out infinite reverse'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto">
                {/* Section Title */}
                <h2
                    ref={titleRef}
                    className="font-display text-6xl md:text-8xl lg:text-9xl text-center mb-24"
                    style={{ perspective: '1500px', transformStyle: 'preserve-3d' }}
                >
                    <span
                        style={{
                            background: 'linear-gradient(135deg, #fff, #d4773c, #ff6b35, #fff)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundSize: '200% auto',
                            animation: 'shimmer-showcase 3s linear infinite',
                            filter: 'drop-shadow(0 5px 20px rgba(212, 119, 60, 0.3))'
                        }}
                    >
                        GALLERY
                    </span>
                </h2>

                {/* Showcase Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-10" style={{ perspective: '2000px' }}>
                    {showcaseItems.map((item, index) => (
                        <motion.div
                            key={index}
                            className="showcase-item magnetic-showcase group relative aspect-square rounded-[2.5rem] overflow-hidden cursor-pointer"
                            initial={{ opacity: 0, scale: 0.7, rotateY: -30 }}
                            animate={isInView ? { opacity: 1, scale: 1, rotateY: 0 } : {}}
                            transition={{ duration: 0.8, delay: index * 0.25, ease: 'back.out(1.5)' }}
                            whileHover={{ scale: 1.08 }}
                            style={{ transformStyle: 'preserve-3d', willChange: 'transform' }}
                        >
                            {/* Multi-layer glow effects */}
                            <div
                                className="absolute inset-[-40%] rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-700 blur-[120px]"
                                style={{ backgroundColor: item.color }}
                            />
                            <div
                                className="absolute inset-[5%] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-[80px] animate-spin-slow"
                                style={{
                                    background: `conic-gradient(from 0deg, ${item.color}00, ${item.color}ff, ${item.color}00)`
                                }}
                            />

                            {/* Main card */}
                            <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 backdrop-blur-2xl shadow-[0_25px_100px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:shadow-[0_35px_140px_rgba(0,0,0,0.5)]"
                                style={{
                                    background: 'linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))',
                                    borderColor: `${item.color}44`,
                                    transform: 'translateZ(50px)'
                                }}
                            >
                                {/* Product Image */}
                                <div className="absolute inset-0">
                                    <Image
                                        src={item.image}
                                        alt={item.title}
                                        fill
                                        className="object-cover object-center transition-transform duration-700 group-hover:scale-115"
                                        sizes="(max-width: 768px) 100vw, 33vw"
                                        style={{ transform: 'translateZ(20px)' }}
                                    />
                                </div>

                                {/* Gradient Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/60 to-transparent opacity-70 group-hover:opacity-85 transition-opacity duration-700" />

                                {/* Shine sweep effect */}
                                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                                    style={{
                                        background: `linear-gradient(110deg, transparent 30%, ${item.color}55 50%, transparent 70%)`,
                                        animation: 'shine-showcase 3s ease-in-out infinite'
                                    }}
                                />

                                {/* Rotating border gradient */}
                                <div className="absolute inset-0 rounded-[2.5rem] opacity-0 group-hover:opacity-70 transition-opacity duration-500 animate-spin-slow"
                                    style={{
                                        background: `conic-gradient(from 0deg, ${item.color}00, ${item.color}aa, ${item.color}00)`,
                                        mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                        maskComposite: 'exclude',
                                        padding: '2px'
                                    }}
                                />

                                {/* Content */}
                                <div className="absolute bottom-0 left-0 right-0 p-8 transition-all duration-700 group-hover:p-10">
                                    <h3 className="font-display text-3xl md:text-4xl lg:text-5xl mb-3 text-white transition-all duration-500 group-hover:scale-105"
                                        style={{
                                            textShadow: `0 0 30px ${item.color}88`,
                                            transform: 'translateZ(30px)'
                                        }}
                                    >
                                        {item.title}
                                    </h3>
                                    <p className="text-text-secondary text-lg md:text-xl opacity-80 group-hover:opacity-100 transition-all duration-500 group-hover:text-white/90"
                                        style={{ transform: 'translateZ(25px)' }}
                                    >
                                        {item.description}
                                    </p>

                                    {/* Decorative accent line */}
                                    <div className="mt-4 w-0 h-1 rounded-full group-hover:w-24 transition-all duration-700"
                                        style={{
                                            background: `linear-gradient(90deg, ${item.color}, transparent)`,
                                            boxShadow: `0 0 15px ${item.color}88`
                                        }}
                                    />
                                </div>

                                {/* SVG corner accents */}
                                <svg className="absolute top-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 48 48">
                                    <path d="M 2 2 L 2 18 M 2 2 L 18 2" stroke={item.color} strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>
                                <svg className="absolute bottom-4 left-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-180" viewBox="0 0 48 48">
                                    <path d="M 2 2 L 2 18 M 2 2 L 18 2" stroke={item.color} strokeWidth="3" fill="none" strokeLinecap="round" />
                                </svg>

                                {/* Particle scatter on hover */}
                                {[...Array(6)].map((_, i) => (
                                    <div
                                        key={i}
                                        className="absolute w-2 h-2 rounded-full opacity-0 group-hover:opacity-100"
                                        style={{
                                            backgroundColor: item.color,
                                            top: '50%',
                                            left: '50%',
                                            animation: `particle-scatter-showcase 1.5s ease-out ${i * 0.1}s infinite`,
                                            transform: `rotate(${i * 60}deg) translateX(0)`
                                        }}
                                    />
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 60 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 1, delay: 1 }}
                    className="text-center mt-24"
                >
                    <motion.button
                        whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(212, 119, 60, 0.6)' }}
                        whileTap={{ scale: 0.95 }}
                        className="group relative px-14 py-6 bg-gradient-to-r from-accent-copper via-accent-orange to-accent-copper rounded-full text-bg-primary font-bold text-lg overflow-hidden shadow-[0_10px_40px_rgba(212,119,60,0.4)] transition-all duration-500"
                        style={{ backgroundSize: '200% auto' }}
                    >
                        <span className="relative z-10 flex items-center gap-2">
                            View Full Gallery
                            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">→</span>
                        </span>
                        {/* Shine effect */}
                        <div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{
                            background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                            animation: 'shine-showcase 3s ease-in-out infinite'
                        }} />
                    </motion.button>
                </motion.div>
            </div>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes morph-showcase {
                    0%, 100% {
                        border-radius: 60% 40% 30% 70% / 60% 30% 70% 40%;
                    }
                    25% {
                        border-radius: 30% 60% 70% 40% / 50% 60% 30% 60%;
                    }
                    50% {
                        border-radius: 50% 60% 30% 60% / 30% 60% 70% 40%;
                    }
                    75% {
                        border-radius: 60% 40% 60% 40% / 70% 30% 50% 60%;
                    }
                }

                @keyframes shimmer-showcase {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                @keyframes shine-showcase {
                    0% {
                        transform: translateX(-100%) rotate(20deg);
                    }
                    100% {
                        transform: translateX(200%) rotate(20deg);
                    }
                }

                @keyframes particle-scatter-showcase {
                    0% {
                        transform: rotate(var(--angle, 0deg)) translateX(0) scale(1);
                        opacity: 1;
                    }
                    100% {
                        transform: rotate(var(--angle, 0deg)) translateX(80px) scale(0);
                        opacity: 0;
                    }
                }

                .animate-spin-slow {
                    animation: rotate 20s linear infinite;
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                .magnetic-showcase {
                    will-change: transform;
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
            `}</style>
        </section>
    );
}
