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
        description: 'Start with any photo - a selfie, portrait, or favorite picture. Our AI analyzes the facial features to create a perfect likeness.',
        image: '/images/user-portrait.png',
        color: '#d4773c',
        icon: '📸'
    },
    {
        id: 2,
        title: 'AI Chibi Conversion',
        description: 'Our advanced AI transforms your photo into an adorable chibi character, capturing your unique style and personality.',
        image: '/images/chibi-character.png',
        color: '#ff6b35',
        icon: '✨'
    },
    {
        id: 3,
        title: '3D Preview',
        description: 'See your figurine come to life in interactive 3D. Rotate, zoom, and inspect every detail before we print.',
        image: '/images/3d-preview.png',
        color: '#f4a261',
        icon: '🧊'
    },
    {
        id: 4,
        title: 'Choose Your Scent',
        description: 'Select from our collection of premium, long-lasting fragrances to keep your car smelling fresh.',
        scents: ['New Car', 'Rosemary', 'Linen', 'Black Ice', 'Vanilla', 'Ocean Breeze'],
        color: '#d4773c',
        icon: '🌸'
    },
    {
        id: 5,
        title: 'Select Mount Style',
        description: 'Pick the perfect way to display your masterpiece. We offer versatile mounting options for any vehicle.',
        mounts: [
            { name: 'Vent Clip', image: '/images/mount-vent.png', desc: 'Securely clips onto any AC vent' },
            { name: 'Hanging', image: '/images/mount-hanging.png', desc: 'Classic mirror hanging style' },
            { name: 'Dashboard', image: '/images/mount-dashboard.png', desc: 'Premium adhesive dash mount' }
        ],
        color: '#ff6b35',
        icon: '🚗'
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

            // Transitions between slides
            for (let i = 1; i < totalSlides; i++) {
                const slideTl = gsap.timeline();

                slideTl
                    .fromTo(slides[i],
                        { opacity: 0, visibility: 'hidden', scale: 1.1, filter: 'blur(10px)' },
                        { opacity: 1, visibility: 'visible', scale: 1, filter: 'blur(0px)', duration: 1, ease: 'power2.out' }
                    )
                    .to(slides[i - 1],
                        { opacity: 0, scale: 0.9, filter: 'blur(10px)', duration: 1 },
                        "<"
                    );

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
                {/* Dynamic Background */}
                <div className="absolute inset-0 pointer-events-none">
                    <div
                        className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-20 transition-colors duration-1000"
                        style={{ backgroundColor: stages[currentStage].color }}
                    />
                    <div
                        className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] opacity-20 transition-colors duration-1000"
                        style={{ backgroundColor: stages[currentStage].color }}
                    />
                    <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.03] mix-blend-overlay" />
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

                                        {/* Image Card */}
                                        <div className="flex justify-center order-1 lg:order-2 perspective-1000">
                                            <div className="floating-element relative w-full max-w-lg aspect-square">
                                                <div
                                                    className="absolute inset-0 rounded-full blur-3xl opacity-20 transition-colors duration-500"
                                                    style={{ backgroundColor: stage.color }}
                                                />
                                                <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-white/10 bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl shadow-2xl p-8 flex items-center justify-center group">
                                                    <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                                                    <Image
                                                        src={stage.image}
                                                        alt={stage.title}
                                                        width={500}
                                                        height={500}
                                                        className="object-contain drop-shadow-2xl transition-transform duration-500 group-hover:scale-110"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Stage 4: Scent Selection */}
                                {stage.scents && (
                                    <div className="w-full h-full flex flex-col justify-center items-center">
                                        <div className="text-center mb-16 max-w-3xl">
                                            <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/5 border border-white/10 backdrop-blur-md">
                                                <span className="text-xl">{stage.icon}</span>
                                                <span className="text-sm font-bold tracking-wider" style={{ color: stage.color }}>
                                                    STAGE 0{stage.id}
                                                </span>
                                            </div>
                                            <h3 className="animate-in font-display text-5xl md:text-7xl mb-6 text-white">
                                                {stage.title}
                                            </h3>
                                            <p className="animate-in text-text-secondary text-xl md:text-2xl">
                                                {stage.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 w-full max-w-5xl px-4">
                                            {stage.scents.map((scent, idx) => (
                                                <div
                                                    key={idx}
                                                    className="animate-in group relative overflow-hidden rounded-2xl p-8 text-center cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:-translate-y-2"
                                                >
                                                    <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div
                                                        className="w-20 h-20 rounded-full mx-auto mb-6 flex items-center justify-center text-4xl bg-white/5 group-hover:scale-110 transition-transform duration-300"
                                                        style={{ color: stage.color }}
                                                    >
                                                        🌸
                                                    </div>
                                                    <p className="text-white font-semibold text-xl tracking-wide">{scent}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Stage 5: Mount Selection */}
                                {stage.mounts && (
                                    <div className="w-full h-full flex flex-col justify-center items-center">
                                        <div className="text-center mb-16 max-w-3xl">
                                            <div className="animate-in inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 bg-white/5 border border-white/10 backdrop-blur-md">
                                                <span className="text-xl">{stage.icon}</span>
                                                <span className="text-sm font-bold tracking-wider" style={{ color: stage.color }}>
                                                    STAGE 0{stage.id}
                                                </span>
                                            </div>
                                            <h3 className="animate-in font-display text-5xl md:text-7xl mb-6 text-white">
                                                {stage.title}
                                            </h3>
                                            <p className="animate-in text-text-secondary text-xl md:text-2xl">
                                                {stage.description}
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-6xl px-4">
                                            {stage.mounts.map((mount, idx) => (
                                                <div
                                                    key={idx}
                                                    className="animate-in group relative rounded-3xl p-6 text-center cursor-pointer border border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-500 hover:-translate-y-2"
                                                >
                                                    <div className="relative w-full aspect-square mb-8 rounded-2xl overflow-hidden bg-black/20 p-6">
                                                        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-50" />
                                                        <Image
                                                            src={mount.image}
                                                            alt={mount.name}
                                                            fill
                                                            className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                                                        />
                                                    </div>
                                                    <h4 className="font-display text-3xl mb-3 text-white group-hover:text-accent-copper transition-colors">
                                                        {mount.name}
                                                    </h4>
                                                    <p className="text-text-secondary text-lg">{mount.desc}</p>
                                                </div>
                                            ))}
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
        </div>
    );
}
