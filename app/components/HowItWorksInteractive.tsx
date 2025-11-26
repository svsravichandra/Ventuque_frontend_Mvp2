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

    // Handle mouse move for parallax effect
    const handleMouseMove = (e: MouseEvent) => {
        if (!sectionRef.current) return;
        const rect = sectionRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setMousePos({ x, y });
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

            // Enhanced transitions between slides with morphing effects
            for (let i = 1; i < totalSlides; i++) {
                const slideTl = gsap.timeline();

                // Different transition styles for different stages
                if (i === 1) {
                    // Photo to Chibi: Morphing transformation
                    slideTl
                        .fromTo(slides[i],
                            { opacity: 0, visibility: 'hidden', scale: 0.8, rotateY: -45, filter: 'blur(20px) hue-rotate(0deg)' },
                            { opacity: 1, visibility: 'visible', scale: 1, rotateY: 0, filter: 'blur(0px) hue-rotate(0deg)', duration: 1.5, ease: 'back.out(1.2)' }
                        )
                        .to(slides[i - 1],
                            { opacity: 0, scale: 1.2, rotateY: 45, filter: 'blur(20px) hue-rotate(30deg)', duration: 1.5 },
                            "<"
                        );
                } else if (i === 2) {
                    // Chibi to 3D: Spin and reveal
                    slideTl
                        .fromTo(slides[i],
                            { opacity: 0, visibility: 'hidden', scale: 0.5, rotateY: 180, rotateX: 20, filter: 'blur(15px) brightness(0.5)' },
                            { opacity: 1, visibility: 'visible', scale: 1, rotateY: 0, rotateX: 0, filter: 'blur(0px) brightness(1)', duration: 1.8, ease: 'power3.out' }
                        )
                        .to(slides[i - 1],
                            { opacity: 0, scale: 0.7, rotateY: -180, rotateX: -20, filter: 'blur(15px) brightness(1.5)', duration: 1.8 },
                            "<"
                        );
                } else {
                    // 3D to Final: Elegant fade with zoom
                    slideTl
                        .fromTo(slides[i],
                            { opacity: 0, visibility: 'hidden', scale: 1.3, filter: 'blur(25px) saturate(0)' },
                            { opacity: 1, visibility: 'visible', scale: 1, filter: 'blur(0px) saturate(1)', duration: 2, ease: 'power2.inOut' }
                        )
                        .to(slides[i - 1],
                            { opacity: 0, scale: 0.85, filter: 'blur(25px) saturate(2)', duration: 2 },
                            "<"
                        );
                }

                tl.add(slideTl);
            }

            // Floating animation for images
            gsap.to('.floating-element', {
                y: -20,
                duration: 2,
                repeat: -1,
                yoyo: true,
                ease: 'sine.inOut',
                stagger: 0.1
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
                className="relative h-screen bg-bg-primary overflow-hidden perspective-1000"
                onMouseMove={handleMouseMove}
            >
                {/* Dynamic Animated Background */}
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    {/* Gradient orbs with smooth transitions */}
                    <div
                        className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-25 transition-all duration-[1500ms] ease-in-out"
                        style={{
                            background: stages[currentStage].bgEffect,
                            transform: `translate(${mousePos.x * 20}px, ${mousePos.y * 20}px)`
                        }}
                    />
                    <div
                        className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full blur-[120px] opacity-25 transition-all duration-[1500ms] ease-in-out"
                        style={{
                            background: stages[currentStage].bgEffect,
                            transform: `translate(${-mousePos.x * 20}px, ${-mousePos.y * 20}px)`
                        }}
                    />
                    {/* Animated gradient overlay */}
                    <div
                        className={`absolute inset-0 bg-gradient-to-br ${stages[currentStage].gradient} opacity-[0.05] transition-all duration-1000`}
                    />
                    {/* Noise texture */}
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />

                    {/* Floating particles */}
                    <div className="absolute inset-0">
                        {[...Array(15)].map((_, i) => (
                            <div
                                key={i}
                                className="absolute w-1 h-1 rounded-full bg-white/10"
                                style={{
                                    left: `${(i * 7) % 100}%`,
                                    top: `${(i * 13) % 100}%`,
                                    animation: `float ${5 + i % 5}s ease-in-out infinite`,
                                    animationDelay: `${i * 0.2}s`
                                }}
                            />
                        ))}
                    </div>
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
                                            <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/5 border border-white/10 backdrop-blur-md">
                                                <span className="text-xl">{stage.icon}</span>
                                                <span className="text-sm font-bold tracking-wider" style={{ color: stage.color }}>
                                                    STAGE 0{stage.id}
                                                </span>
                                            </div>
                                            <h3 className="animate-in font-display text-5xl md:text-7xl mb-6 text-white leading-tight">
                                                {stage.title}
                                            </h3>
                                            <p className="animate-in text-text-secondary text-xl md:text-2xl leading-relaxed max-w-xl mx-auto lg:mx-0">
                                                {stage.description}
                                            </p>
                                        </div>

                                        {/* Enhanced Image Card with Glow Effects */}
                                        <div className="flex justify-center order-1 lg:order-2 perspective-1000">
                                            <div className="floating-element relative w-full max-w-lg aspect-square">
                                                {/* Animated glow orb */}
                                                <div
                                                    className="absolute inset-0 rounded-full blur-[100px] opacity-30 transition-all duration-700 animate-pulse"
                                                    style={{ backgroundColor: stage.color }}
                                                />
                                                {/* Secondary glow for depth */}
                                                <div
                                                    className="absolute inset-[10%] rounded-full blur-[60px] opacity-20"
                                                    style={{ backgroundColor: stage.color }}
                                                />

                                                {/* Main card with glassmorphism */}
                                                <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden border-2 border-white/20 bg-gradient-to-br from-white/15 via-white/10 to-white/5 backdrop-blur-2xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] p-10 flex items-center justify-center group">
                                                    {/* Shine effect */}
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                                                    {/* Animated border gradient */}
                                                    <div
                                                        className="absolute inset-0 opacity-0 group-hover:opacity-50 transition-opacity duration-500"
                                                        style={{
                                                            background: `linear-gradient(135deg, ${stage.color}22, transparent, ${stage.color}22)`,
                                                        }}
                                                    />

                                                    {/* Image with enhanced effects */}
                                                    <div className="relative w-full h-full flex items-center justify-center">
                                                        <Image
                                                            src={stage.image}
                                                            alt={stage.title}
                                                            width={500}
                                                            height={500}
                                                            className="object-contain drop-shadow-[0_10px_40px_rgba(0,0,0,0.5)] transition-all duration-700 group-hover:scale-110 group-hover:drop-shadow-[0_20px_60px_rgba(0,0,0,0.6)] relative z-10"
                                                            style={{
                                                                filter: 'contrast(1.1) saturate(1.1)'
                                                            }}
                                                        />
                                                    </div>

                                                    {/* Corner accents */}
                                                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-white/30 rounded-tr-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-white/30 rounded-bl-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
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
                                                            className="group relative overflow-hidden rounded-2xl p-6 text-center cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-emerald-500/20"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                            <div
                                                                className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl bg-gradient-to-br from-white/10 to-white/5 group-hover:scale-110 transition-transform duration-300"
                                                            >
                                                                🌸
                                                            </div>
                                                            <p className="text-white font-semibold text-sm md:text-base tracking-wide relative z-10">{scent}</p>
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
                                                            className="group relative rounded-3xl p-6 text-center cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500 hover:-translate-y-3 hover:shadow-2xl hover:shadow-teal-500/20"
                                                        >
                                                            <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-3xl" />
                                                            <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-gradient-to-br from-white/10 to-white/5 p-8 flex items-center justify-center">
                                                                <div className="text-6xl md:text-7xl group-hover:scale-125 transition-transform duration-500 filter drop-shadow-lg">
                                                                    {mount.icon}
                                                                </div>
                                                            </div>
                                                            <h4 className="font-display text-2xl md:text-3xl mb-2 text-white group-hover:text-emerald-400 transition-colors relative z-10">
                                                                {mount.name}
                                                            </h4>
                                                            <p className="text-text-secondary text-sm md:text-base relative z-10">{mount.desc}</p>
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

            {/* CSS Animations */}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) translateX(0px);
                        opacity: 0.1;
                    }
                    25% {
                        transform: translateY(-20px) translateX(10px);
                        opacity: 0.3;
                    }
                    50% {
                        transform: translateY(-40px) translateX(-10px);
                        opacity: 0.5;
                    }
                    75% {
                        transform: translateY(-20px) translateX(5px);
                        opacity: 0.3;
                    }
                }

                @keyframes pulse {
                    0%, 100% {
                        opacity: 0.3;
                        transform: scale(1);
                    }
                    50% {
                        opacity: 0.5;
                        transform: scale(1.05);
                    }
                }
            `}</style>
        </div>
    );
}
