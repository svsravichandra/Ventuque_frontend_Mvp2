'use client';

import { motion, useInView } from 'framer-motion';
import { useRef, useState, MouseEvent, useEffect } from 'react';
import { gsap } from 'gsap';
import Image from 'next/image';

const highlights = [
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 01_01_46 PM.png',
    title: 'Vibrant Colors',
    description: 'Choose from a wide range of colors and finishes',
    color: '#d4773c',
    gradient: 'from-amber-600 to-orange-500'
  },
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 12_51_45 PM.png',
    title: 'Detailed Craftsmanship',
    description: 'Every detail is carefully 3D printed to perfection',
    color: '#ff6b35',
    gradient: 'from-pink-500 to-rose-400'
  },
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 12_51_54 PM.png',
    title: 'Unique Designs',
    description: 'Each figurine is one-of-a-kind, just like you',
    color: '#f4a261',
    gradient: 'from-orange-500 to-amber-400'
  }
];

export default function ProductHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    // Throttle updates
    if (!containerRef.current.dataset.ticking) {
      window.requestAnimationFrame(() => {
        setMousePos({ x, y });
        if (containerRef.current) {
          containerRef.current.dataset.ticking = '';
        }
      });
      containerRef.current.dataset.ticking = 'true';
    }
  };

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.to('.glow-orb-highlights', {
        scale: 1.2,
        opacity: 0.4,
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
    <section ref={containerRef} className="relative py-32 px-6 bg-bg-secondary overflow-hidden" onMouseMove={handleMouseMove}>
      {/* Liquid Morphing Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="glow-orb-highlights absolute top-[-10%] right-[-5%] w-[50%] h-[50%] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(212, 119, 60, 0.3), transparent 70%)',
            transform: `translate(${-mousePos.x * 25}px, ${mousePos.y * 25}px)`,
            borderRadius: `${50 + mousePos.x * 20}% ${50 - mousePos.x * 20}% ${50 + mousePos.y * 20}% ${50 - mousePos.y * 20}%`,
            filter: 'blur(120px)',
            animation: 'morph-highlights 20s ease-in-out infinite'
          }}
        />
        <div
          className="glow-orb-highlights absolute bottom-[-10%] left-[-5%] w-[50%] h-[50%] opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(255, 107, 53, 0.3), transparent 70%)',
            transform: `translate(${mousePos.x * 25}px, ${-mousePos.y * 25}px)`,
            borderRadius: `${60 - mousePos.y * 20}% ${40 + mousePos.y * 20}% ${50 - mousePos.x * 20}% ${50 + mousePos.x * 20}%`,
            filter: 'blur(120px)',
            animation: 'morph-highlights 25s ease-in-out infinite reverse'
          }}
        />

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-accent-copper/5 to-accent-orange/5 opacity-50" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, ease: 'power4.out' }}
          className="text-center mb-24"
        >
          <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full mb-6 bg-gradient-to-r from-white/5 to-white/10 border border-accent-copper/20 backdrop-blur-xl">
            <span className="text-accent-copper text-sm tracking-[0.2em] uppercase font-bold">✦ Premium Quality</span>
          </div>

          <h2 className="font-display text-6xl md:text-8xl lg:text-9xl mb-8" style={{ perspective: '1000px' }}>
            <span
              style={{
                background: 'linear-gradient(135deg, #fff, #d4773c, #ff6b35, #fff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundSize: '200% auto',
                animation: 'shimmer-highlights 3s linear infinite',
                display: 'inline-block',
                transform: 'rotateX(5deg)'
              }}
            >
              WHY CHOOSE US
            </span>
          </h2>
          <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto font-light leading-relaxed">
            Premium quality meets personalized design
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12" style={{ perspective: '1500px' }}>
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 80, rotateX: -20 }}
              animate={isInView ? { opacity: 1, y: 0, rotateX: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2, ease: 'back.out(1.5)' }}
              className="magnetic-card group"
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Image Container with 3D effects */}
              <div className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-8">
                {/* Multi-layer glow orbs */}
                <div
                  className="absolute inset-[-30%] rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-700 blur-[100px]"
                  style={{ backgroundColor: highlight.color }}
                />
                <div
                  className="absolute inset-[10%] rounded-full opacity-0 group-hover:opacity-30 transition-opacity duration-700 blur-[60px] animate-spin-slow"
                  style={{
                    background: `conic-gradient(from 0deg, ${highlight.color}00, ${highlight.color}ff, ${highlight.color}00)`
                  }}
                />

                {/* Main card */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 backdrop-blur-xl shadow-[0_20px_80px_rgba(0,0,0,0.3)] group-hover:shadow-[0_30px_120px_rgba(0,0,0,0.4)] transition-all duration-700"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))',
                    borderColor: `${highlight.color}33`,
                    transform: 'translateZ(0)'
                  }}
                >
                  <Image
                    src={highlight.image}
                    alt={highlight.title}
                    fill
                    className="object-cover object-center transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 1024px) 100vw, 33vw"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-bg-primary via-bg-primary/50 to-transparent opacity-40 group-hover:opacity-70 transition-opacity duration-700" />

                  {/* Shine effect */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000"
                    style={{
                      background: `linear-gradient(110deg, transparent 30%, ${highlight.color}44 50%, transparent 70%)`,
                      animation: 'shine-highlights 3s ease-in-out infinite'
                    }}
                  />

                  {/* Rotating border */}
                  <div className="absolute inset-0 rounded-3xl opacity-0 group-hover:opacity-60 transition-opacity duration-500 animate-spin-slow"
                    style={{
                      background: `conic-gradient(from 0deg, ${highlight.color}00, ${highlight.color}88, ${highlight.color}00)`,
                      mask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                      maskComposite: 'exclude',
                      padding: '2px'
                    }}
                  />

                  {/* SVG corner accents */}
                  <svg className="absolute top-3 right-3 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-500" viewBox="0 0 40 40">
                    <path d="M 2 2 L 2 16 M 2 2 L 16 2" stroke={highlight.color} strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                  <svg className="absolute bottom-3 left-3 w-10 h-10 opacity-0 group-hover:opacity-100 transition-all duration-500 rotate-180" viewBox="0 0 40 40">
                    <path d="M 2 2 L 2 16 M 2 2 L 16 2" stroke={highlight.color} strokeWidth="2" fill="none" strokeLinecap="round" />
                  </svg>
                </div>
              </div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="font-display text-3xl md:text-4xl mb-4 transition-all duration-500"
                  style={{
                    background: isInView && index <= 2 ? `linear-gradient(135deg, #fff, ${highlight.color})` : '#fff',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    textShadow: `0 0 30px ${highlight.color}44`
                  }}
                >
                  {highlight.title}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed transition-all duration-500 group-hover:text-white/80">
                  {highlight.description}
                </p>

                {/* Decorative underline */}
                <div className="mt-6 flex justify-center gap-2">
                  {[...Array(3)].map((_, i) => (
                    <div
                      key={i}
                      className="w-12 h-1 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-500"
                      style={{
                        background: `linear-gradient(90deg, transparent, ${highlight.color}, transparent)`,
                        animationDelay: `${i * 0.1}s`
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-center mt-24"
        >
          <p className="text-text-secondary text-xl mb-8 font-light">
            Ready to create your own unique figurine?
          </p>
          <motion.button
            whileHover={{ scale: 1.08, boxShadow: '0 0 80px rgba(212, 119, 60, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            className="group relative px-14 py-6 bg-gradient-to-r from-accent-copper via-accent-orange to-accent-copper rounded-full text-bg-primary font-bold text-lg overflow-hidden shadow-[0_10px_40px_rgba(212,119,60,0.4)] transition-all duration-500"
            style={{ backgroundSize: '200% auto' }}
          >
            <span className="relative z-10 flex items-center gap-2">
              Get Started Now
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-110">✨</span>
            </span>
            {/* Shine effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100" style={{
              background: 'linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.4) 50%, transparent 70%)',
              animation: 'shine-highlights 3s ease-in-out infinite'
            }} />
          </motion.button>
        </motion.div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes morph-highlights {
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

        @keyframes shimmer-highlights {
          0% {
            background-position: -200% center;
          }
          100% {
            background-position: 200% center;
          }
        }

        @keyframes shine-highlights {
          0% {
            transform: translateX(-100%) rotate(20deg);
          }
          100% {
            transform: translateX(200%) rotate(20deg);
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

        .magnetic-card {
          will-change: transform;
          transition: transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        }
      `}</style>
    </section>
  );
}
