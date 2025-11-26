'use client';

import { useEffect, useRef, useState } from 'react';
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
        description: 'Start with any photo - a selfie, portrait, or favorite picture',
        image: '/images/user-portrait.png',
        color: '#d4773c'
    },
    {
        id: 2,
        title: 'AI Chibi Conversion',
        description: 'Our AI transforms your photo into an adorable chibi character',
        image: '/images/chibi-character.png',
        color: '#ff6b35'
    },
    {
        id: 3,
        title: '3D Preview',
        description: 'See your figurine come to life in interactive 3D',
        image: '/images/3d-preview.png',
        color: '#f4a261'
    },
    {
        id: 4,
        title: 'Choose Your Scent',
        description: 'Select from premium fragrances',
        scents: ['New Car', 'Rosemary', 'Linen', 'Black Ice', 'Vanilla', 'Ocean Breeze'],
        color: '#d4773c'
    },
    {
        id: 5,
        title: 'Select Mount Style',
        description: 'Pick how you want to display your figurine',
        mounts: [
            { name: 'Vent Clip', image: '/images/mount-vent.png', desc: 'Clips onto AC vents' },
            { name: 'Hanging', image: '/images/mount-hanging.png', desc: 'Hangs from mirror' },
            { name: 'Dashboard', image: '/images/mount-dashboard.png', desc: 'Sticks to dash' }
        ],
        color: '#ff6b35'
    }
];

export default function HowItWorksInteractive() {
    const sectionRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [currentStage, setCurrentStage] = useState(0);

    useEffect(() => {
        if (!sectionRef.current || !containerRef.current) return;

        const ctx = gsap.context(() => {
            const slides = gsap.utils.toArray('.stage-panel') as HTMLElement[];
            const totalSlides = slides.length;

            // Initial state: all slides absolute, opacity 0 except first
            gsap.set(slides, {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                opacity: 0,
                zIndex: (i) => i
            });
            gsap.set(slides[0], { opacity: 1 });

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: sectionRef.current,
                    start: 'top top',
                    end: `+=${totalSlides * 100}%`, // Scroll distance based on number of slides
                    pin: true,
                    scrub: 1,
                    onUpdate: (self) => {
                        // Update current stage based on progress
                        const progress = self.progress;
                        const index = Math.min(
                            Math.floor(progress * totalSlides),
                            totalSlides - 1
                        );
                        setCurrentStage(index);
                    }
                }
            });

            // Animate transitions
            // We skip the first slide as it's already visible
            for (let i = 1; i < totalSlides; i++) {
                tl.fromTo(slides[i],
                    { opacity: 0, y: 100 },
                    { opacity: 1, y: 0, duration: 1, ease: 'power2.out' } // Fade in and slide up
                )
                    // Optional: Fade out previous slide slightly for depth
                    .to(slides[i - 1], { opacity: 0, scale: 0.95, duration: 1 }, "<");
            }

        }, sectionRef);

        return () => ctx.revert();
    }, []);

    return (
        <section ref={sectionRef} className="relative h-screen bg-bg-primary overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 bg-gradient-to-b from-bg-primary via-bg-secondary to-bg-primary opacity-50 pointer-events-none" />

            {/* Section Header (Fixed at top) */}
            <div className="absolute top-0 left-0 right-0 z-20 py-8 px-6 text-center bg-gradient-to-b from-bg-primary to-transparent">
                <h2 className="font-display text-4xl md:text-6xl mb-2">
                    <span className="text-gradient">HOW IT WORKS</span>
                </h2>
                <p className="text-text-secondary text-lg">
                    Scroll to explore the process
                </p>
            </div>

            {/* Stages Container */}
            <div ref={containerRef} className="relative w-full h-full max-w-7xl mx-auto">
                {stages.map((stage, index) => (
                    <div
                        key={stage.id}
                        className="stage-panel flex items-center justify-center px-6 pt-24 pb-12 w-full h-full"
                    >
                        <div className="w-full max-w-6xl">
                            {/* Stage 1-3: Image-based stages */}
                            {stage.image && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-center">
                                    {/* Content */}
                                    <div className="text-center lg:text-left order-2 lg:order-1">
                                        <div
                                            className="inline-block px-4 py-2 rounded-full mb-6"
                                            style={{ backgroundColor: `${stage.color}20`, border: `2px solid ${stage.color}` }}
                                        >
                                            <span className="text-sm font-semibold" style={{ color: stage.color }}>
                                                STAGE {stage.id}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-4xl md:text-6xl mb-6 text-text-primary">
                                            {stage.title}
                                        </h3>
                                        <p className="text-text-secondary text-xl md:text-2xl leading-relaxed">
                                            {stage.description}
                                        </p>
                                    </div>

                                    {/* Image */}
                                    <div className="flex justify-center order-1 lg:order-2">
                                        <div className="relative w-full max-w-md aspect-square">
                                            <div
                                                className="absolute inset-0 rounded-full blur-3xl opacity-30"
                                                style={{ backgroundColor: stage.color }}
                                            />
                                            <div className="relative w-full h-full rounded-3xl overflow-hidden card p-8 flex items-center justify-center border border-white/10 bg-white/5 backdrop-blur-sm">
                                                <Image
                                                    src={stage.image}
                                                    alt={stage.title}
                                                    width={400}
                                                    height={400}
                                                    className="object-contain drop-shadow-2xl"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stage 4: Scent Selection */}
                            {stage.scents && (
                                <div className="w-full h-full flex flex-col justify-center">
                                    <div className="text-center mb-12">
                                        <div
                                            className="inline-block px-4 py-2 rounded-full mb-6"
                                            style={{ backgroundColor: `${stage.color}20`, border: `2px solid ${stage.color}` }}
                                        >
                                            <span className="text-sm font-semibold" style={{ color: stage.color }}>
                                                STAGE {stage.id}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-4xl md:text-6xl mb-6 text-text-primary">
                                            {stage.title}
                                        </h3>
                                        <p className="text-text-secondary text-xl md:text-2xl">
                                            {stage.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto w-full">
                                        {stage.scents.map((scent, idx) => (
                                            <div
                                                key={idx}
                                                className="card rounded-2xl p-6 text-center hover:scale-105 transition-transform duration-300 cursor-pointer border border-white/10 bg-white/5 backdrop-blur-sm"
                                                style={{ borderColor: `${stage.color}30` }}
                                            >
                                                <div
                                                    className="w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl"
                                                    style={{ backgroundColor: `${stage.color}20` }}
                                                >
                                                    🌸
                                                </div>
                                                <p className="text-text-primary font-semibold text-lg">{scent}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Stage 5: Mount Selection */}
                            {stage.mounts && (
                                <div className="w-full h-full flex flex-col justify-center">
                                    <div className="text-center mb-12">
                                        <div
                                            className="inline-block px-4 py-2 rounded-full mb-6"
                                            style={{ backgroundColor: `${stage.color}20`, border: `2px solid ${stage.color}` }}
                                        >
                                            <span className="text-sm font-semibold" style={{ color: stage.color }}>
                                                STAGE {stage.id}
                                            </span>
                                        </div>
                                        <h3 className="font-display text-4xl md:text-6xl mb-6 text-text-primary">
                                            {stage.title}
                                        </h3>
                                        <p className="text-text-secondary text-xl md:text-2xl">
                                            {stage.description}
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto w-full">
                                        {stage.mounts.map((mount, idx) => (
                                            <div
                                                key={idx}
                                                className="card rounded-3xl p-8 text-center hover:scale-105 transition-all duration-300 cursor-pointer group border border-white/10 bg-white/5 backdrop-blur-sm"
                                                style={{ borderColor: `${stage.color}30` }}
                                            >
                                                <div className="relative w-full aspect-square mb-6 rounded-2xl overflow-hidden bg-bg-primary/50">
                                                    <Image
                                                        src={mount.image}
                                                        alt={mount.name}
                                                        fill
                                                        className="object-contain p-4"
                                                    />
                                                </div>
                                                <h4 className="font-display text-2xl md:text-3xl mb-2 text-text-primary group-hover:text-gradient transition-all">
                                                    {mount.name}
                                                </h4>
                                                <p className="text-text-secondary">{mount.desc}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Progress Indicator */}
            <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col gap-4 z-50 hidden md:flex">
                {stages.map((stage, index) => (
                    <div
                        key={stage.id}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStage === index ? 'bg-accent-copper scale-150' : 'bg-accent-copper/30'
                            }`}
                    />
                ))}
            </div>

            {/* Mobile Progress Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-3 z-50 md:hidden">
                {stages.map((stage, index) => (
                    <div
                        key={stage.id}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${currentStage === index ? 'bg-accent-copper scale-125' : 'bg-accent-copper/30'
                            }`}
                    />
                ))}
            </div>
        </section>
    );
}

