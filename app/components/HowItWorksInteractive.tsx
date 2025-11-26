'use client';

import { useEffect, useRef, useState, MouseEvent, useLayoutEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Image from 'next/image';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const stages = [
    {
        id: 1,
        title: 'Upload Your Photo',
        description: 'Start with any photo - a selfie, portrait, or favorite picture. Our AI analyzes your facial features to create a perfect likeness.',
        image: '/images/user-portrait.png',
        color: '#d4773c',
        gradient: 'from-amber-600 to-orange-500',
        icon: '📸',
        bgEffect: 'radial-gradient(circle at 30% 50%, rgba(212, 119, 60, 0.15), transparent 70%)'
    },
    {
        id: 2,
        title: 'AI Chibi Transformation',
        description: 'Watch as our advanced AI transforms your photo into an adorable chibi character, capturing your unique personality and style with stunning detail.',
        image: '/images/chibi-character.png',
        color: '#ff6b35',
        gradient: 'from-pink-500 to-rose-400',
        icon: '✨',
        bgEffect: 'radial-gradient(circle at 70% 50%, rgba(255, 107, 53, 0.15), transparent 70%)'
    },
    {
        id: 3,
        title: '3D Preview Figurine',
        description: 'See your custom figurine come to life in stunning 3D. Rotate, zoom, and inspect every detail before we bring it to reality.',
        image: '/images/3d-preview.png',
        color: '#4f46e5',
        gradient: 'from-indigo-600 to-purple-500',
        icon: '🎨',
        bgEffect: 'radial-gradient(circle at 50% 30%, rgba(79, 70, 229, 0.15), transparent 70%)'
    },
    {
        id: 4,
        title: 'Select Scent & Style',
        description: 'Complete your masterpiece by choosing from premium fragrances and versatile mount styles to personalize your experience.',
        color: '#10b981',
        gradient: 'from-emerald-500 to-teal-400',
        icon: '🌸',
        bgEffect: 'radial-gradient(circle at 50% 70%, rgba(16, 185, 129, 0.15), transparent 70%)',
        scents: ['New Car', 'Rosemary', 'Linen', 'Black Ice', 'Vanilla', 'Ocean Breeze'],
        mounts: [
            { name: 'Vent Clip', icon: '🎯', desc: 'Clips onto any AC vent' },
            { name: 'Hanging', icon: '🔗', desc: 'Classic mirror style' },
            { name: 'Dashboard', icon: '📍', desc: 'Premium dash mount' }
        ]
    }
];

export default function HowItWorksInteractive() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentStage, setCurrentStage] = useState(0);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // Optimized mouse move for parallax only
    const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;

        // Throttle updates using requestAnimationFrame
        if (!sectionRef.current.dataset.ticking) {
            window.requestAnimationFrame(() => {
                setMousePos({ x, y });
                if (sectionRef.current) {
                    sectionRef.current.dataset.ticking = '';
                }
            });
            sectionRef.current.dataset.ticking = 'true';
        }
    };

    // Use useLayoutEffect for GSAP to prevent flash of unstyled content and ensure measurements are correct
    // We use a safe version that falls back to useEffect on the server
    const useIsomorphicLayoutEffect = typeof window !== 'undefined' ? useLayoutEffect : useEffect;

    useIsomorphicLayoutEffect(() => {
        if (!sectionRef.current || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const slides = gsap.utils.toArray('.stage-panel') as HTMLElement[];
            const totalSlides = slides.length;

            // Initial setup
            gsap.set(slides, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: (i) => i,
                visibility: 'hidden'
            });

            // Make first slide visible immediately
            gsap.set(slides[0], { opacity: 1, visibility: 'visible' });

            // Main ScrollTrigger timeline
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: `+=${totalSlides * 100}%`,
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        const progress = self.progress;
                        const index = Math.min(
                            Math.floor(progress * totalSlides),
                            totalSlides - 1
                        );
                        if (index !== currentStage) {
                            setCurrentStage(index);
                        }
                    }
                }
            });

            // Enhanced transitions with creative particle and liquid morphing effects
            for (let i = 1; i < totalSlides; i++) {
                const slideTl = gsap.timeline();

                // Different transition styles for different stages
                if (i === 1) {
                    // Photo to Chibi: Particle dissolution and reformation
                    slideTl
                        .to(slides[i - 1].querySelectorAll('.floating-element'),
                            {
                                scale: 1.5,
                                opacity: 0,
                                filter: 'blur(40px)',
                                duration: 1,
                                ease: 'power2.in',
                                stagger: 0.1
                            }
                        )
                        .fromTo(slides[i],
                            {
                                opacity: 0,
                                visibility: 'hidden',
                                scale: 0.3,
                                rotateY: -90,
                                rotateZ: -15,
                                filter: 'blur(30px) hue-rotate(0deg) brightness(2)',
                            },
                            {
                                opacity: 1,
                                visibility: 'visible',
                                scale: 1,
                                rotateY: 0,
                                rotateZ: 0,
                                filter: 'blur(0px) hue-rotate(0deg) brightness(1)',
                                duration: 1.5,
                                ease: 'elastic.out(1, 0.6)',
                            },
                            '-=0.5'
                        )
                        .to(slides[i - 1], { opacity: 0, duration: 0.3 }, '<');

                } else if (i === 2) {
                    // Chibi to 3D: Liquid morph with depth extrusion
                    slideTl
                        .to(slides[i - 1],
                            {
                                opacity: 0,
                                scale: 0.5,
                                rotateX: -90,
                                rotateY: 180,
                                filter: 'blur(25px) brightness(3) saturate(3)',
                                duration: 1.2,
                                ease: 'power4.in'
                            }
                        )
                        .fromTo(slides[i],
                            {
                                opacity: 0,
                                visibility: 'hidden',
                                scale: 0.1,
                                rotateX: 90,
                                rotateY: -180,
                                rotateZ: 45,
                                filter: 'blur(40px) brightness(0) contrast(2)',
                                transformOrigin: 'center center -200px'
                            },
                            {
                                opacity: 1,
                                visibility: 'visible',
                                scale: 1,
                                rotateX: 0,
                                rotateY: 0,
                                rotateZ: 0,
                                filter: 'blur(0px) brightness(1) contrast(1)',
                                duration: 1.8,
                                ease: 'expo.out',
                                transformOrigin: 'center center 0px'
                            },
                            '-=0.6'
                        );

                } else {
                    // 3D to Final: Explosive reveal with particle scatter
                    slideTl
                        .to(slides[i - 1],
                            {
                                opacity: 0,
                                scale: 2,
                                rotateZ: 360,
                                filter: 'blur(50px) saturate(5) brightness(2)',
                                duration: 1.5,
                                ease: 'power3.in'
                            }
                        )
                        .fromTo(slides[i],
                            {
                                opacity: 0,
                                visibility: 'hidden',
                                scale: 0.5,
                                filter: 'blur(60px) saturate(0) contrast(3)',
                            },
                            {
                                opacity: 1,
                                visibility: 'visible',
                                scale: 1,
                                filter: 'blur(0px) saturate(1.2) contrast(1)',
                                duration: 2,
                                ease: 'power4.out'
                            },
                            '-=0.8'
                        );
                }

                tl.add(slideTl);
            }

            // Creative floating animation with 3D rotation
            gsap.to('.floating-element', {
                y: -25,
                rotateY: 10,
                rotateX: 5,
                duration: 3,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: {
                    each: 0.2,
                    from: 'random'
                }
            });

            // Pulsing glow animation
            gsap.to('.glow-orb', {
                scale: 1.2,
                opacity: 0.4,
                duration: 2.5,
                repeat: -1,
                yoyo: true,
                ease: 'power1.inOut',
                stagger: 0.3
            });

            // Animated icon micro-interactions
            gsap.to('.stage-icon', {
                rotation: 360,
                duration: 20,
                repeat: -1,
                ease: 'none'
            });

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    // Effect to trigger entrance animations when stage changes
    useIsomorphicLayoutEffect(() => {
        const ctx = gsap.context(() => {
            // Animate content of the current stage
            const activeSlide = document.querySelector(`.stage-panel:nth-child(${currentStage + 1})`);
            if (activeSlide) {
                gsap.fromTo(activeSlide.querySelectorAll('.animate-in'),
                    { y: 30, opacity: 0 },
                    { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'back.out(1.7)' }
                );
            }
        }, sectionRef);
        return () => ctx.revert();
    }, [currentStage]);

    return (
        <div className="relative w-full"> {/* Wrapper to isolate GSAP pinning from React tree */}
            <section
                ref={sectionRef}
                className="relative h-screen bg-bg-primary overflow-hidden"
                style={{ perspective: '2000px' }}
                onMouseMove={handleMouseMove}
            >
                {/* Dynamic Animated Background with Liquid Blobs */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Liquid blob morphing backgrounds */}
                    <div
                        className="glow-orb absolute top-[-20%] left-[-10%] w-[70%] h-[70%] opacity-30 transition-all duration-[2000ms] ease-out"
                        style={{
                            background: stages[currentStage].bgEffect,
                            transform: `translate(${mousePos.x * 30}px, ${mousePos.y * 30}px) scale(${1 + Math.abs(mousePos.x) * 0.1})`,
                            borderRadius: `${40 + mousePos.x * 20}% ${60 - mousePos.x * 20}% ${50 + mousePos.y * 20}% ${50 - mousePos.y * 20}%`,
                            filter: 'blur(120px) saturate(1.5)',
                            animation: 'morph 15s ease-in-out infinite'
                        }}
                    />
                    <div
                        className="glow-orb absolute bottom-[-20%] right-[-10%] w-[70%] h-[70%] opacity-30 transition-all duration-[2000ms] ease-out"
                        style={{
                            background: stages[currentStage].bgEffect,
                            transform: `translate(${-mousePos.x * 30}px, ${-mousePos.y * 30}px) rotate(${mousePos.x * 20}deg)`,
                            borderRadius: `${60 - mousePos.y * 20}% ${40 + mousePos.y * 20}% ${50 - mousePos.x * 20}% ${50 + mousePos.x * 20}%`,
                            filter: 'blur(120px) saturate(1.5)',
                            animation: 'morph 18s ease-in-out infinite reverse'
                        }}
                    />
                    <div
                        className="glow-orb absolute top-[50%] left-[50%] w-[50%] h-[50%] -translate-x-1/2 -translate-y-1/2 opacity-20 transition-all duration-[2000ms]"
                        style={{
                            background: stages[currentStage].bgEffect,
                            borderRadius: `${45 + mousePos.x * 30}% ${55 - mousePos.x * 30}% ${55 + mousePos.y * 30}% ${45 - mousePos.y * 30}%`,
                            filter: 'blur(100px) saturate(2)',
                            animation: 'morph 12s ease-in-out infinite'
                        }}
                    />

                    {/* Animated gradient overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stages[currentStage].gradient} opacity-[0.08] transition-all duration-1000`}
                    />

                    {/* Grid overlay for depth */}
                    <div
                        className="absolute inset-0 opacity-[0.02]"
                        style={{
                            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
                            backgroundSize: '50px 50px',
                            transform: `perspective(1000px) rotateX(60deg) scale(2) translateY(-50%)`
                        }}
                    />

                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.04] mix-blend-overlay" />

                    {/* Enhanced floating particles with trails */}
                    <div className="absolute inset-0">
                        {[...Array(25)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute rounded-full bg-white/10 backdrop-blur-sm"
                                style={{
                                    width: `${2 + (i % 5)}px`,
                                    height: `${2 + (i % 5)}px`,
                                    left: `${(i * 7) % 100}%`,
                                    top: `${(i * 13) % 100}%`,
                                    animation: `float ${4 + i % 6}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.15}s`,
                                    boxShadow: `0 0 ${10 + i % 10}px ${stages[currentStage].color}66`
                                }}
                            />
                        ))}
                    </div>

                    {/* SVG Filter for liquid effect */}
                    <svg className="absolute inset-0 w-0 h-0">
                        <defs>
                            <filter id="goo">
                                <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
                                <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8" result="goo" />
                            </filter>
                        </defs>
                    </svg>
                </div>

                {/* Fixed Header */}
                <div className="absolute top-0 left-0 right-0 z-30 py-8 px-6 text-center">
                    <h2 className="font-display text-4xl md:text-6xl mb-2 tracking-tight">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/70">
                            HOW IT WORKS
                        </span>
                    </h2>
                    <div className="flex items-center justify-center gap-2 text-text-secondary/80">
                        <span className="text-sm uppercase tracking-widest">Scroll to Explore</span>
                        <div className="w-px h-4 bg-text-secondary/50" />
                        <span className="text-sm font-mono">0{currentStage + 1} / 0{stages.length}</span>
                    </div>
                </div>

                {/* Stages Container */}
                <div ref={containerRef} className="relative w-full h-full max-w-7xl mx-auto z-10">
                    {stages.map((stage, index) => (
                        <div
                            key={stage.id}
                            className="stage-panel flex items-center justify-center px-6 pt-24 pb-12 w-full h-full"
                        >
                            <div
                                className="w-full max-w-6xl"
                                style={{
                                    transform: `rotateY(${mousePos.x * 5}deg) rotateX(${-mousePos.y * 5}deg)`,
                                    transition: 'transform 0.1s ease-out'
                                }}
                            >
                                {/* Stage 1-3: Image-based stages */}
                                {stage.image && !stage.scents && !stage.mounts && (
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-20 items-center">
                                        {/* Content */}
                                        <div className="text-center lg:text-left order-2 lg:order-1">
                                            <div className="animate-in inline-flex items-center gap-3 px-5 py-3 rounded-full mb-8 bg-gradient-to-r from-white/10 to-white/5 border border-white/20 backdrop-blur-xl shadow-lg transition-all duration-300">
                                                <span className="stage-icon text-2xl" style={{ filter: 'drop-shadow(0 0 8px currentColor)' }}>{stage.icon}</span>
                                                <span className="text-sm font-bold tracking-widest uppercase" style={{ color: stage.color, textShadow: `0 0 20px ${stage.color}88` }}>
                                                    STAGE 0{stage.id}
                                                </span>
                                            </div>
                                            <h3 className="animate-in font-display text-5xl md:text-7xl mb-6 text-white leading-tight" style={{
                                                background: `linear-gradient(135deg, white, ${stage.color}dd, white)`,
                                                WebkitBackgroundClip: 'text',
                                                WebkitTextFillColor: 'transparent',
                                                backgroundSize: '200% auto',
                                                animation: 'shimmer 3s linear infinite'
                                            }}>
                                                {stage.title}
                                            </h3>
                                            <p className="animate-in text-text-secondary text-xl md:text-2xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                                                {stage.description}
                                            </p>

                                            {/* Decorative elements */}
                                            <div className="mt-8 flex gap-2 justify-center lg:justify-start">
                                                {[...Array(3)].map((_, i) => (
                                                    <div
                                                        key={i}
                                                        className="w-16 h-1 rounded-full transition-all duration-500"
                                                        style={{
                                                            background: `linear-gradient(90deg, transparent, ${stage.color}, transparent)`,
                                                            opacity: 0.6,
                                                            animation: `slideIn 1s ease-out ${i * 0.2}s backwards`
                                                        }}
                                                    />
                                                ))}
                                            </div>
                                        </div>

                                        {/* Enhanced Image Card with 3D Depth */}
                                        <div className="flex justify-center order-1 lg:order-2" style={{ perspective: '1500px' }}>
                                            <div className="floating-element relative w-full max-w-lg aspect-square transition-transform duration-300">
                                                {/* Multi-layer animated glow orbs */}
                                                <div
                                                    className="glow-orb absolute inset-[-20%] rounded-full opacity-40 transition-all duration-1000"
                                                    style={{
                                                        backgroundColor: stage.color,
                                                        filter: 'blur(120px)',
                                                        animation: 'pulse 4s ease-in-out infinite'
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-[5%] rounded-full blur-[80px] opacity-25 animate-spin-slow"
                                                    style={{
                                                        background: `conic-gradient(from 0deg, ${stage.color}00, ${stage.color}ff, ${stage.color}00)`,
                                                    }}
                                                />
                                                <div
                                                    className="absolute inset-[10%] rounded-full blur-[60px] opacity-30"
                                                    style={{
                                                        backgroundColor: stage.color,
                                                        animation: 'pulse 3s ease-in-out infinite reverse'
                                                    }}
                                                />

                                                {/* Main 3D card with enhanced glassmorphism */}
                                                <div
                                                    className="relative w-full h-full rounded-[3rem] overflow-hidden border-2 backdrop-blur-3xl shadow-[0_25px_100px_rgba(0,0,0,0.4)] p-10 flex items-center justify-center group"
                                                    style={{
                                                        background: `linear-gradient(135deg, rgba(255,255,255,0.15), rgba(255,255,255,0.05))`,
                                                        borderImage: `linear-gradient(135deg, ${stage.color}44, transparent, ${stage.color}44) 1`,
                                                        transform: 'translateZ(0)',
                                                        transformStyle: 'preserve-3d'
                                                    }}
                                                >
                                                    {/* Animated shine sweep */}
                                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                                                        style={{
                                                            background: `linear-gradient(110deg, transparent 30%, ${stage.color}33 50%, transparent 70%)`,
                                                            animation: 'shine 3s ease-in-out infinite'
                                                        }}
                                                    />

                                                    {/* Rotating border gradient */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-spin-slow"
                                                        style={{
                                                            background: `conic-gradient(from 0deg, ${stage.color}00, ${stage.color}88, ${stage.color}00)`,
                                                            mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                                                            maskComposite: 'exclude',
                                                            padding: '2px'
                                                        }}
                                                    />

                                                    {/* Image with 3D transform */}
                                                    <div className="relative w-full h-full flex items-center justify-center" style={{ transformStyle: 'preserve-3d' }}>
                                                        <Image
                                                            src={stage.image}
                                                            alt={stage.title}
                                                            width={500}
                                                            height={500}
                                                            className="object-contain transition-all duration-700 group-hover:scale-110 relative z-10"
                                                            style={{
                                                                filter: `contrast(1.15) saturate(1.2) drop-shadow(0 15px 50px ${stage.color}88)`,
                                                                transform: 'translateZ(50px)'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Animated corner accents with SVG */}
                                                    <svg className="absolute top-3 right-3 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 48 48">
                                                        <path d="M 2 2 L 2 20 M 2 2 L 20 2" stroke={stage.color} strokeWidth="3" fill="none" strokeLinecap="round" />
                                                    </svg>
                                                    <svg className="absolute bottom-3 left-3 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-180" viewBox="0 0 48 48">
                                                        <path d="M 2 2 L 2 20 M 2 2 L 20 2" stroke={stage.color} strokeWidth="3" fill="none" strokeLinecap="round" />
                                                    </svg>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stage 4: Combined Scent & Style Selection */}
                                {stage.scents && stage.mounts && (
                                    <div className="w-full h-full flex flex-col justify-center items-center px-4 py-8">
                                        <div className="text-center mb-12 max-w-3xl">
                                            <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 bg-white/5 border border-white/10 backdrop-blur-md">
                                                <span className="text-xl">{stage.icon}</span>
                                                <span className="text-sm font-bold tracking-wider" style={{ color: stage.color }}>
                                                    STAGE 0{stage.id}
                                                </span>
                                            </div>
                                            <h3 className="animate-in font-display text-4xl md:text-6xl lg:text-7xl mb-4 text-white leading-tight">
                                                {stage.title}
                                            </h3>
                                            <p className="animate-in text-text-secondary text-lg md:text-xl lg:text-2xl">
                                                {stage.description}
                                            </p>
                                        </div>

                                        <div className="w-full max-w-7xl space-y-10">
                                            {/* Scent Selection */}
                                            <div className="animate-in">
                                                <h4 className="text-2xl md:text-3xl font-display text-white/90 mb-6 text-center">
                                                    Choose Your Scent
                                                </h4>
                                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                                                    {stage.scents.map((scent, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer border-2 bg-white/5 backdrop-blur-xl transition-all duration-500 hover:shadow-2xl"
                                                            style={{
                                                                borderColor: `${stage.color}22`,
                                                                background: `linear-gradient(135deg, rgba(255,255,255,0.08), rgba(255,255,255,0.03))`
                                                            }}
                                                        >
                                                            {/* Ripple effect on hover */}
                                                            <div
                                                                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                                style={{
                                                                    background: `radial-gradient(circle at center, ${stage.color}33, transparent 70%)`,
                                                                    animation: 'ripple 2s ease-out infinite'
                                                                }}
                                                            />

                                                            {/* Icon with glow */}
                                                            <div
                                                                className="relative w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-125 transition-all duration-500 group-hover:rotate-12"
                                                                style={{
                                                                    boxShadow: `0 0 20px ${stage.color}66`
                                                                }}
                                                            >
                                                                <span style={{ filter: 'drop-shadow(0 0 10px currentColor)' }}>🌸</span>
                                                            </div>
                                                            <p className="text-white font-semibold text-sm md:text-base tracking-wide relative z-10 group-hover:scale-110 transition-transform duration-300">{scent}</p>

                                                            {/* Corner highlights */}
                                                            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: stage.color }} />
                                                            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ borderColor: stage.color }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Mount Style Selection */}
                                            <div className="animate-in">
                                                <h4 className="text-2xl md:text-3xl font-display text-white/90 mb-6 text-center">
                                                    Select Mount Style
                                                </h4>
                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                                    {stage.mounts.map((mount, idx) => (
                                                        <div
                                                            key={idx}
                                                            className="group relative rounded-3xl p-8 text-center cursor-pointer border-2 backdrop-blur-2xl transition-all duration-700 hover:shadow-2xl"
                                                            style={{
                                                                borderColor: `${stage.color}33`,
                                                                background: `linear-gradient(135deg, rgba(255,255,255,0.12), rgba(255,255,255,0.05))`,
                                                                boxShadow: `0 10px 40px ${stage.color}22`
                                                            }}
                                                        >
                                                            {/* Animated gradient background */}
                                                            <div
                                                                className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                                                                style={{
                                                                    background: `radial-gradient(circle at 50% 50%, ${stage.color}22, transparent 70%)`,
                                                                    animation: 'pulse 2s ease-in-out infinite'
                                                                }}
                                                            />

                                                            {/* Icon container with 3D effect */}
                                                            <div
                                                                className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden p-10 flex items-center justify-center transition-all duration-700 group-hover:scale-105"
                                                                style={{
                                                                    background: `linear-gradient(135deg, ${stage.color}11, rgba(255,255,255,0.05))`,
                                                                    boxShadow: `inset 0 0 30px ${stage.color}22, 0 5px 20px ${stage.color}33`,
                                                                    transform: 'translateZ(30px)',
                                                                    transformStyle: 'preserve-3d'
                                                                }}
                                                            >
                                                                {/* Rotating glow behind icon */}
                                                                <div
                                                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                                                                    style={{
                                                                        background: `conic-gradient(from 0deg, transparent, ${stage.color}44, transparent)`,
                                                                        animation: 'rotate 3s linear infinite'
                                                                    }}
                                                                />

                                                                {/* Icon with enhanced animations */}
                                                                <div className="relative text-6xl md:text-7xl group-hover:scale-125 transition-all duration-700 group-hover:rotate-12"
                                                                    style={{
                                                                        filter: `drop-shadow(0 0 20px ${stage.color}88)`,
                                                                        transform: 'translateZ(20px)'
                                                                    }}
                                                                >
                                                                    {mount.icon}
                                                                </div>
                                                            </div>

                                                            {/* Text content */}
                                                            <h4 className="font-display text-2xl md:text-3xl mb-3 text-white transition-all duration-500 relative z-10 group-hover:scale-105"
                                                                style={{
                                                                    textShadow: `0 0 20px ${stage.color}66`
                                                                }}
                                                            >
                                                                {mount.name}
                                                            </h4>
                                                            <p className="text-text-secondary text-sm md:text-base relative z-10 transition-all duration-300 group-hover:text-white/80">{mount.desc}</p>

                                                            {/* Decorative corner elements */}
                                                            <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 rounded-tl-lg opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ borderColor: stage.color }} />
                                                            <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 rounded-tr-lg opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ borderColor: stage.color }} />
                                                            <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 rounded-bl-lg opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ borderColor: stage.color }} />
                                                            <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 rounded-br-lg opacity-0 group-hover:opacity-100 transition-all duration-500" style={{ borderColor: stage.color }} />
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Desktop Progress Indicator */}
                <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-6 z-50 hidden lg:flex">
                    {stages.map((stage, index) => (
                        <button
                            key={stage.id}
                            onClick={() => {
                                // Optional: Add scroll to logic here if needed, 
                                // but ScrollTrigger usually handles the scroll position.
                                // For now, just visual feedback or we could scroll the window.
                                const scrollHeight = sectionRef.current?.offsetHeight || 0;
                                const targetScroll = sectionRef.current?.offsetTop! + (scrollHeight * index);
                                window.scrollTo({ top: targetScroll, behavior: 'smooth' });
                            }}
                            className="group flex items-center gap-4 cursor-pointer"
                        >
                            <span
                                className={`text-sm font-medium transition-all duration-300 ${currentStage === index ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
                                    }`}
                                style={{ color: stage.color }}
                            >
                                Stage {stage.id}
                            </span>
                            <div
                                className={`w-3 h-3 rounded-full transition-all duration-500 border-2 ${currentStage === index ? 'scale-125 bg-transparent' : 'bg-white/20 border-transparent hover:bg-white/40'
                                    }`}
                                style={{ borderColor: currentStage === index ? stage.color : 'transparent' }}
                            >
                                {currentStage === index && (
                                    <div
                                        className="w-full h-full rounded-full bg-current opacity-50 animate-ping"
                                        style={{ color: stage.color }}
                                    />
                                )}
                            </div>
                        </button>
                    ))}
                </div>

                {/* Mobile Progress Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-4 z-50 lg:hidden">
                    {stages.map((stage, index) => (
                        <div
                            key={stage.id}
                            className={`w-2 h-2 rounded-full transition-all duration-300 ${currentStage === index ? 'w-8 bg-white' : 'bg-white/30'
                                }`}
                            style={{ backgroundColor: currentStage === index ? stage.color : undefined }}
                        />
                    ))}
                </div>
            </section>

            {/* Enhanced CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.15;
                    }
                    25% {
                        transform: translateY(-30px) translateX(15px);
                        opacity: 0.4;
                    }
                    50% {
                        transform: translateY(-50px) translateX(-15px);
                        opacity: 0.6;
                    }
                    75% {
                        transform: translateY(-25px) translateX(8px);
                        opacity: 0.4;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.6;
                        transform: scale(1.08);
                    }
                }

                @keyframes morph {
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

                @keyframes shimmer {
                    0% {
                        background-position: -200% center;
                    }
                    100% {
                        background-position: 200% center;
                    }
                }

                @keyframes shine {
                    0% {
                        transform: translateX(-100%) rotate(0deg);
                    }
                    100% {
                        transform: translateX(200%) rotate(20deg);
                    }
                }

                @keyframes rotate {
                    from {
                        transform: rotate(0deg);
                    }
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes ripple {
                    0% {
                        transform: scale(0.8);
                        opacity: 1;
                    }
                    100% {
                        transform: scale(1.5);
                        opacity: 0;
                    }
                }

                @keyframes slideIn {
                    from {
                        transform: scaleX(0);
                        opacity: 0;
                    }
                    to {
                        transform: scaleX(1);
                        opacity: 1;
                    }
                }

                .animate-spin-slow {
                    animation: rotate 20s linear infinite;
                }
            `}</style>
        </div>
    );
}
