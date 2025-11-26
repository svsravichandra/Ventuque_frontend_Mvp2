'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { useEffect, useRef, useState, MouseEvent } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

export default function Hero() {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    const { scrollYProgress } = useScroll({
        target: containerRef,
        offset: ["start start", "end start"]
    });

    const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);
    const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

    // Enhanced mouse move for parallax and magnetic effects
    const handleMouseMove = (e: MouseEvent) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });

        // Update custom cursor
        if (cursorRef.current) {
            cursorRef.current.style.left = `${e.clientX}px`;
            cursorRef.current.style.top = `${e.clientY}px`;
        }

        // Magnetic effect
        const magneticElements = document.querySelectorAll('.magnetic-hero');
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
                htmlEl.style.transform = `translate(${deltaX * strength / 100}px, ${deltaY * strength / 100}px) scale(1.05)`;
            } else {
                htmlEl.style.transform = 'translate(0, 0) scale(1)';
            }
        });
    };

    // Canvas particle system
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        let particleArray: Array<{ x: number; y: number; vx: number; vy: number; size: number; opacity: number }> = [];

        // Create ambient particles
        for (let i = 0; i < 50; i++) {
            particleArray.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                size: Math.random() * 3 + 1,
                opacity: Math.random() * 0.5
            });
        }

        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particleArray.forEach(particle => {
                particle.x += particle.vx;
                particle.y += particle.vy;

                // Wrap around screen
                if (particle.x < 0) particle.x = canvas.width;
                if (particle.x > canvas.width) particle.x = 0;
                if (particle.y < 0) particle.y = canvas.height;
                if (particle.y > canvas.height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(212, 119, 60, ${particle.opacity})`;
                ctx.fill();
            });

            requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
        };
    }, []);

    useEffect(() => {
        const ctx = gsap.context(() => {
            // Explosive entrance animation
            gsap.from('.hero-title', {
                scale: 0.5,
                opacity: 0,
                rotationX: -90,
                duration: 1.5,
                ease: 'elastic.out(1, 0.5)',
                stagger: 0.2
            });

            gsap.from('.hero-subtitle', {
                y: 80,
                opacity: 0,
                duration: 1.2,
                delay: 0.4,
                ease: 'power4.out'
            });

            gsap.from('.hero-cta', {
                scale: 0,
                opacity: 0,
                duration: 1,
                delay: 0.7,
                ease: 'back.out(2)',
                stagger: 0.15
            });

            // Floating animation with 3D effect
            gsap.to('.float-element', {
                y: -40,
                rotateY: 15,
                rotateX: 10,
                duration: 4,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.4
            });

            // Pulsing glow effect
            gsap.to('.glow-orb-hero', {
                scale: 1.3,
                opacity: 0.3,
                duration: 3,
                ease: 'sine.inOut',
                repeat: -1,
                yoyo: true,
                stagger: 0.5
            });
        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="relative cursor-none">
            {/* Custom Cursor */}
            <div
                ref={cursorRef}
                className="custom-cursor-hero fixed w-10 h-10 pointer-events-none z-[9999] mix-blend-difference"
                style={{
                    transform: 'translate(-50%, -50%)',
                    transition: 'width 0.3s, height 0.3s'
                }}
            >
                <div className="w-full h-full rounded-full border-2 border-white animate-pulse" />
            </div>

            {/* Particle Canvas */}
            <canvas
                ref={canvasRef}
                className="fixed inset-0 pointer-events-none z-20 mix-blend-screen opacity-60"
            />

            <motion.section
                ref={containerRef}
                style={{ y, opacity }}
                className="relative min-h-screen flex items-center justify-center overflow-hidden"
                onMouseMove={handleMouseMove}
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
                    {/* Enhanced dark overlay with liquid gradient */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/90" />
                </div>

                {/* Liquid Morphing Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div
                        className="glow-orb-hero absolute top-[15%] left-[-5%] w-[50%] h-[50%] opacity-25 transition-all duration-[2000ms]"
                        style={{
                            background: 'radial-gradient(circle, rgba(212, 119, 60, 0.4), transparent 70%)',
                            transform: `translate(${mousePos.x * 40}px, ${mousePos.y * 40}px) scale(${1 + Math.abs(mousePos.x) * 0.15})`,
                            borderRadius: `${45 + mousePos.x * 25}% ${55 - mousePos.x * 25}% ${50 + mousePos.y * 25}% ${50 - mousePos.y * 25}%`,
                            filter: 'blur(140px) saturate(1.5)',
                            animation: 'morph-hero 18s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="glow-orb-hero absolute bottom-[10%] right-[-5%] w-[55%] h-[55%] opacity-25 transition-all duration-[2000ms]"
                        style={{
                            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.4), transparent 70%)',
                            transform: `translate(${-mousePos.x * 40}px, ${-mousePos.y * 40}px) rotate(${mousePos.x * 25}deg)`,
                            borderRadius: `${60 - mousePos.y * 25}% ${40 + mousePos.y * 25}% ${55 - mousePos.x * 25}% ${45 + mousePos.x * 25}%`,
                            filter: 'blur(140px) saturate(1.5)',
                            animation: 'morph-hero 22s ease-in-out infinite reverse'
                        }}
                    />
                    <div
                        className="glow-orb-hero absolute top-[45%] left-[50%] w-[40%] h-[40%] -translate-x-1/2 -translate-y-1/2 opacity-20"
                        style={{
                            background: 'radial-gradient(circle, rgba(244, 162, 97, 0.3), transparent 70%)',
                            borderRadius: `${50 + mousePos.x * 30}% ${50 - mousePos.x * 30}% ${50 + mousePos.y * 30}% ${50 - mousePos.y * 30}%`,
                            filter: 'blur(120px) saturate(2)',
                            animation: 'morph-hero 15s ease-in-out infinite'
                        }}
                    />

                    {/* Floating particles with glow */}
                    <div className="absolute inset-0">
                        {[...Array(30)].map((_, i) => (
                            <div
                                key={i}
                                className="float-element absolute rounded-full bg-accent-copper/20 backdrop-blur-sm"
                                style={{
                                    width: `${3 + (i % 6)}px`,
                                    height: `${3 + (i % 6)}px`,
                                    left: `${(i * 9) % 100}%`,
                                    top: `${(i * 17) % 100}%`,
                                    boxShadow: `0 0 ${15 + i % 15}px rgba(212, 119, 60, 0.6)`,
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
                </div>

                {/* Content */}
                <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center" style={{ perspective: '1500px' }}>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 1 }}
                    >
                        {/* Eyebrow with glow */}
                        <div className="hero-subtitle inline-flex items-center gap-3 px-6 py-3 rounded-full mb-8 bg-gradient-to-r from-white/10 to-white/5 border border-accent-copper/30 backdrop-blur-xl shadow-[0_0_30px_rgba(212,119,60,0.3)]">
                            <span className="text-accent-copper text-xs md:text-sm tracking-[0.3em] uppercase font-bold" style={{ textShadow: '0 0 20px rgba(212, 119, 60, 0.8)' }}>
                                ✨ Transform Your Memories
                            </span>
                        </div>

                        {/* Main Headline with shimmer effect */}
                        <h1 className="hero-title font-display text-7xl md:text-9xl lg:text-[12rem] leading-[0.9] mb-8" style={{ transformStyle: 'preserve-3d' }}>
                            <span
                                className="block"
                                style={{
                                    background: 'linear-gradient(135deg, #fff, #d4773c, #ff6b35, #fff)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    backgroundSize: '300% auto',
                                    animation: 'shimmer-hero 4s linear infinite',
                                    filter: 'drop-shadow(0 8px 24px rgba(212, 119, 60, 0.5))',
                                    transform: 'translateZ(50px)'
                                }}
                            >
                                VENTIQUE
                            </span>
                        </h1>

                        {/* Subheadline with gradient */}
                        <h2 className="hero-title text-3xl md:text-5xl lg:text-6xl font-body font-light text-white/95 mb-16 max-w-5xl mx-auto leading-tight">
                            Turn your photos into{' '}
                            <span
                                className="font-bold relative inline-block"
                                style={{
                                    background: 'linear-gradient(135deg, #d4773c, #ff6b35, #f4a261)',
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    textShadow: '0 0 30px rgba(212, 119, 60, 0.6)'
                                }}
                            >
                                custom 3D-printed
                                <div
                                    className="absolute -bottom-2 left-0 right-0 h-1 rounded-full"
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, #d4773c, transparent)',
                                        animation: 'slideIn-hero 1.5s ease-out 1s backwards'
                                    }}
                                />
                            </span>
                            {' '}chibi car vent figurines
                        </h2>

                        {/* CTA Buttons with magnetic effect */}
                        <div className="hero-cta flex flex-col sm:flex-row gap-6 justify-center items-center">
                            <motion.button
                                className="magnetic-hero group relative px-14 py-6 bg-gradient-to-r from-accent-copper via-accent-orange to-accent-copper rounded-full text-bg-primary font-bold text-lg overflow-hidden transition-all duration-500 shadow-[0_10px_40px_rgba(212,119,60,0.4)] will-change-transform"
                                whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(212, 119, 60, 0.6)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{ backgroundSize: '200% auto' }}
                            >
                                <span className="relative z-10 flex items-center gap-2">
                                    Start Creating
                                    <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
                                </span>
                                {/* Animated shine */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                    style={{
                                        background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
                                        animation: 'shine-hero 3s ease-in-out infinite'
                                    }}
                                />
                                {/* Ripple effect */}
                                <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100" style={{ animation: 'ripple-hero 2s ease-out infinite' }} />
                            </motion.button>

                            <motion.button
                                className="magnetic-hero group px-14 py-6 border-2 backdrop-blur-xl rounded-full text-white font-semibold text-lg transition-all duration-500 bg-gradient-to-r from-black/40 to-black/30 shadow-[0_10px_40px_rgba(0,0,0,0.3)] will-change-transform"
                                whileHover={{ scale: 1.08, boxShadow: '0 0 60px rgba(212, 119, 60, 0.4)' }}
                                whileTap={{ scale: 0.95 }}
                                style={{
                                    borderImage: 'linear-gradient(135deg, #d4773c, #ff6b35, #d4773c) 1'
                                }}
                            >
                                <span className="flex items-center gap-2">
                                    See Examples
                                    <span className="text-xl opacity-0 group-hover:opacity-100 transition-all duration-300">✨</span>
                                </span>
                            </motion.button>
                        </div>

                        {/* Enhanced Scroll Indicator */}
                        <motion.div
                            className="absolute bottom-12 left-1/2 -translate-x-1/2 cursor-pointer"
                            animate={{ y: [0, 15, 0] }}
                            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <div className="relative w-7 h-12 border-2 border-accent-copper rounded-full flex justify-center pt-2 backdrop-blur-md bg-gradient-to-b from-black/40 to-black/60 shadow-[0_0_30px_rgba(212,119,60,0.4)]">
                                <motion.div
                                    className="w-2 h-2 bg-gradient-to-b from-accent-copper to-accent-orange rounded-full"
                                    style={{ boxShadow: '0 0 15px rgba(212, 119, 60, 1)' }}
                                    animate={{ y: [0, 20, 0], opacity: [1, 0.3, 1] }}
                                    transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
                                />
                            </div>
                            <p className="mt-4 text-accent-copper/70 text-xs tracking-widest uppercase">Scroll Down</p>
                        </motion.div>
                    </motion.div>
                </div>
            </motion.section>

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes morph-hero {
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

                @keyframes shimmer-hero {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                @keyframes shine-hero {
                    0% {
                        transform: translateX(-100%) rotate(20deg);
                    }
                    100% {
                        transform: translateX(200%) rotate(20deg);
                    }
                }

                @keyframes slideIn-hero {
                    from {
                        transform: scaleX(0);
                        opacity: 0;
                    }
                    to {
                        transform: scaleX(1);
                        opacity: 1;
                    }
                }

                @keyframes ripple-hero {
                    0% {
                        transform: scale(1);
                        opacity: 0.5;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                .cursor-none * {
                    cursor: none !important;
                }

                .magnetic-hero {
                    will-change: transform;
                    transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
                }
            `}</style>
        </div>
    );
}
