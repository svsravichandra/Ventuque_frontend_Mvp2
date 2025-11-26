'use client';

import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Image from 'next/image';

const highlights = [
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 01_01_46 PM.png',
    title: 'Vibrant Colors',
    description: 'Choose from a wide range of colors and finishes'
  },
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 12_51_45 PM.png',
    title: 'Detailed Craftsmanship',
    description: 'Every detail is carefully 3D printed to perfection'
  },
  {
    image: '/images/ChatGPT Image Nov 17, 2025, 12_51_54 PM.png',
    title: 'Unique Designs',
    description: 'Each figurine is one-of-a-kind, just like you'
  }
];

export default function ProductHighlights() {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: '-100px' });

  return (
    <section ref={containerRef} className="relative py-32 px-6 bg-bg-secondary">
      {/* Background Texture */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-accent-copper to-accent-orange" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <h2 className="font-display text-6xl md:text-8xl mb-6">
            <span className="text-gradient">WHY CHOOSE US</span>
          </h2>
          <p className="text-text-secondary text-xl md:text-2xl max-w-3xl mx-auto font-light">
            Premium quality meets personalized design
          </p>
        </motion.div>

        {/* Highlights Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {highlights.map((highlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group"
            >
              {/* Image Container */}
              <motion.div
                className="relative aspect-[4/5] rounded-3xl overflow-hidden mb-6"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                <Image
                  src={highlight.image}
                  alt={highlight.title}
                  fill
                  className="object-cover object-center"
                  sizes="(max-width: 1024px) 100vw, 33vw"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Glow Effect on Hover */}
                <div className="absolute inset-0 ring-2 ring-accent-copper/0 group-hover:ring-accent-copper/50 rounded-3xl transition-all duration-500" />
              </motion.div>

              {/* Text Content */}
              <div className="text-center">
                <h3 className="font-display text-3xl md:text-4xl mb-3 text-text-primary group-hover:text-gradient transition-all duration-300">
                  {highlight.title}
                </h3>
                <p className="text-text-secondary text-lg leading-relaxed">
                  {highlight.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="text-center mt-20"
        >
          <p className="text-text-secondary text-lg mb-6">
            Ready to create your own unique figurine?
          </p>
          <motion.button
            whileHover={{ scale: 1.05, boxShadow: '0 0 60px rgba(212, 119, 60, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            className="px-12 py-5 bg-gradient-to-r from-accent-copper to-accent-orange rounded-full text-bg-primary font-semibold text-lg"
          >
            Get Started Now
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}
