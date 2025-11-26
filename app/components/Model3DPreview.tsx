'use client';

import { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';

interface Model3DPreviewProps {
    photoPreview: string | null;
    style: string;
    finish: string;
    mountType: string;
}

export default function Model3DPreview({ photoPreview, style, finish, mountType }: Model3DPreviewProps) {
    const [rotation, setRotation] = useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const containerRef = useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent) => {
        setIsDragging(true);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (!isDragging) return;

        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        setRotation(prev => ({
            x: prev.x + deltaY * 0.5,
            y: prev.y + deltaX * 0.5
        }));

        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const handleMouseUp = () => {
        setIsDragging(false);
    };

    // Auto-rotate when not dragging
    useEffect(() => {
        if (isDragging) return;

        const interval = setInterval(() => {
            setRotation(prev => ({
                ...prev,
                y: prev.y + 0.5
            }));
        }, 50);

        return () => clearInterval(interval);
    }, [isDragging]);

    // Get finish effect
    const getFinishStyle = () => {
        switch (finish) {
            case 'glossy':
                return 'bg-gradient-to-br from-gray-300 via-gray-400 to-gray-500 shadow-2xl';
            case 'metallic':
                return 'bg-gradient-to-br from-amber-300 via-amber-500 to-amber-700 shadow-2xl';
            default: // matte
                return 'bg-gradient-to-br from-gray-400 via-gray-500 to-gray-600';
        }
    };

    return (
        <div className="relative w-full h-full min-h-[400px] bg-bg-primary rounded-2xl overflow-hidden border border-text-secondary/20">
            {/* Info Banner */}
            <div className="absolute top-4 left-4 right-4 z-10 bg-bg-secondary/90 backdrop-blur-sm rounded-xl p-4 border border-text-secondary/20">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-text-secondary text-sm">3D Preview</p>
                        <p className="text-text-primary font-semibold">
                            {style.charAt(0).toUpperCase() + style.slice(1)} • {finish.charAt(0).toUpperCase() + finish.slice(1)}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-text-secondary text-xs">Drag to rotate</p>
                        <p className="text-accent-copper text-xs">🔄 Auto-rotating</p>
                    </div>
                </div>
            </div>

            {/* 3D Scene */}
            <div
                ref={containerRef}
                className="w-full h-full flex items-center justify-center perspective-1000 cursor-grab active:cursor-grabbing"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                <div
                    className="relative preserve-3d"
                    style={{
                        transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                        transformStyle: 'preserve-3d',
                        transition: isDragging ? 'none' : 'transform 0.1s ease-out'
                    }}
                >
                    {/* Main Figurine Body */}
                    <div className={`relative w-48 h-64 ${getFinishStyle()} rounded-3xl`}>
                        {/* Photo Face */}
                        {photoPreview && (
                            <div className="absolute top-8 left-1/2 -translate-x-1/2 w-32 h-32 rounded-full overflow-hidden border-4 border-bg-primary shadow-xl">
                                <img
                                    src={photoPreview}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        )}

                        {/* Body Details */}
                        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-24 h-24 bg-bg-primary/20 rounded-2xl" />

                        {/* Mount Indicator */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-center">
                            <div className="w-16 h-3 bg-accent-copper rounded-full mb-1" />
                            <p className="text-xs text-text-primary/70 font-semibold">
                                {mountType === 'clip' ? '📎 Clip' : mountType === 'magnetic' ? '🧲 Magnetic' : '📌 Adhesive'}
                            </p>
                        </div>

                        {/* 3D Depth Layers */}
                        <div
                            className={`absolute inset-0 ${getFinishStyle()} rounded-3xl opacity-50`}
                            style={{
                                transform: 'translateZ(-20px)',
                                transformStyle: 'preserve-3d'
                            }}
                        />
                        <div
                            className={`absolute inset-0 ${getFinishStyle()} rounded-3xl opacity-25`}
                            style={{
                                transform: 'translateZ(-40px)',
                                transformStyle: 'preserve-3d'
                            }}
                        />
                    </div>

                    {/* Shadow */}
                    <div
                        className="absolute -bottom-4 left-1/2 -translate-x-1/2 w-56 h-8 bg-black/30 rounded-full blur-xl"
                        style={{
                            transform: 'rotateX(90deg) translateZ(-100px)',
                            transformStyle: 'preserve-3d'
                        }}
                    />
                </div>
            </div>

            {/* Controls */}
            <div className="absolute bottom-4 left-4 right-4 flex justify-center gap-4">
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setRotation({ x: 0, y: 0 })}
                    className="px-4 py-2 bg-bg-secondary/90 backdrop-blur-sm rounded-lg border border-text-secondary/20 text-text-primary text-sm font-medium hover:border-accent-copper/50 transition-colors"
                >
                    Reset View
                </motion.button>
            </div>

            {/* Placeholder Notice */}
            <div className="absolute bottom-16 left-4 right-4 text-center">
                <p className="text-text-secondary/50 text-xs">
                    ⚠️ Placeholder 3D preview • Full Three.js integration coming soon
                </p>
            </div>
        </div>
    );
}
