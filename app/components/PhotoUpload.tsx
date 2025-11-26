'use client';

import { useState, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';

interface PhotoUploadProps {
    onPhotoSelected: (file: File, preview: string) => void;
    maxSizeMB?: number;
    minWidth?: number;
    minHeight?: number;
}

interface ValidationError {
    type: 'format' | 'size' | 'dimensions';
    message: string;
}

export default function PhotoUpload({
    onPhotoSelected,
    maxSizeMB = 10,
    minWidth = 500,
    minHeight = 500
}: PhotoUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const [error, setError] = useState<ValidationError | null>(null);
    const [isValidating, setIsValidating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const validateFile = useCallback(async (file: File): Promise<ValidationError | null> => {
        // Check file format
        const validFormats = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
        if (!validFormats.includes(file.type)) {
            return {
                type: 'format',
                message: 'Please upload a JPG, PNG, or WebP image'
            };
        }

        // Check file size
        const maxSizeBytes = maxSizeMB * 1024 * 1024;
        if (file.size > maxSizeBytes) {
            return {
                type: 'size',
                message: `File size must be less than ${maxSizeMB}MB`
            };
        }

        // Check image dimensions
        return new Promise((resolve) => {
            const img = new window.Image();
            img.onload = () => {
                if (img.width < minWidth || img.height < minHeight) {
                    resolve({
                        type: 'dimensions',
                        message: `Image must be at least ${minWidth}x${minHeight} pixels`
                    });
                } else {
                    resolve(null);
                }
            };
            img.onerror = () => {
                resolve({
                    type: 'format',
                    message: 'Unable to load image. Please try another file.'
                });
            };
            img.src = URL.createObjectURL(file);
        });
    }, [maxSizeMB, minWidth, minHeight]);

    const handleFile = useCallback(async (file: File) => {
        setIsValidating(true);
        setError(null);

        const validationError = await validateFile(file);

        if (validationError) {
            setError(validationError);
            setPreview(null);
            setIsValidating(false);
            return;
        }

        // Create preview
        const previewUrl = URL.createObjectURL(file);
        setPreview(previewUrl);
        setIsValidating(false);
        onPhotoSelected(file, previewUrl);
    }, [validateFile, onPhotoSelected]);

    const handleDragEnter = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    }, []);

    const handleDragLeave = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
    }, []);

    const handleDragOver = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
    }, []);

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (files && files.length > 0) {
            handleFile(files[0]);
        }
    }, [handleFile]);

    const handleClick = useCallback(() => {
        fileInputRef.current?.click();
    }, []);

    const handleRemove = useCallback(() => {
        setPreview(null);
        setError(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }, []);

    return (
        <div className="w-full">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleFileInput}
                className="hidden"
            />

            <AnimatePresence mode="wait">
                {!preview ? (
                    <motion.div
                        key="upload-area"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        onDragEnter={handleDragEnter}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={handleDrop}
                        onClick={handleClick}
                        className={`
              relative cursor-pointer rounded-3xl border-2 border-dashed
              transition-all duration-300 overflow-hidden
              ${isDragging
                                ? 'border-accent-copper bg-accent-copper/10 scale-[1.02]'
                                : 'border-text-secondary/30 hover:border-accent-copper/50 hover:bg-accent-copper/5'
                            }
            `}
                    >
                        {/* Background Glow */}
                        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-500">
                            <div className="absolute inset-0 bg-gradient-to-br from-accent-copper/20 to-accent-orange/20 blur-xl" />
                        </div>

                        <div className="relative z-10 py-20 px-8 text-center">
                            {/* Upload Icon */}
                            <motion.div
                                animate={isDragging ? { scale: 1.1, rotate: 5 } : { scale: 1, rotate: 0 }}
                                transition={{ duration: 0.3 }}
                                className="mb-6 flex justify-center"
                            >
                                <div className="relative">
                                    <svg
                                        className="w-20 h-20 text-accent-copper"
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                                        />
                                    </svg>
                                    {/* Animated Ring */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full border-2 border-accent-copper/30"
                                        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0, 0.5] }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    />
                                </div>
                            </motion.div>

                            {/* Text */}
                            <h3 className="font-display text-2xl md:text-3xl mb-3 text-text-primary">
                                {isDragging ? 'Drop your photo here' : 'Upload Your Photo'}
                            </h3>
                            <p className="text-text-secondary text-lg mb-2">
                                Drag and drop or click to browse
                            </p>
                            <p className="text-text-secondary/70 text-sm">
                                JPG, PNG, or WebP • Max {maxSizeMB}MB • Min {minWidth}x{minHeight}px
                            </p>

                            {/* Validation Status */}
                            {isValidating && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 flex items-center justify-center gap-2 text-accent-copper"
                                >
                                    <div className="w-5 h-5 border-2 border-accent-copper border-t-transparent rounded-full animate-spin" />
                                    <span>Validating image...</span>
                                </motion.div>
                            )}

                            {/* Error Message */}
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl"
                                >
                                    <p className="text-red-400 font-medium">{error.message}</p>
                                </motion.div>
                            )}
                        </div>
                    </motion.div>
                ) : (
                    <motion.div
                        key="preview"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.3 }}
                        className="relative rounded-3xl overflow-hidden group"
                    >
                        {/* Preview Image */}
                        <div className="relative aspect-[4/3] bg-bg-secondary">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                className="object-contain"
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />

                            {/* Overlay on Hover */}
                            <div className="absolute inset-0 bg-gradient-to-t from-bg-primary/90 via-bg-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Remove Button */}
                            <motion.button
                                initial={{ opacity: 0, scale: 0.8 }}
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                                onClick={handleRemove}
                                className="absolute top-4 right-4 p-3 bg-bg-primary/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-red-500/20 border border-red-500/30"
                            >
                                <svg
                                    className="w-6 h-6 text-red-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </motion.button>

                            {/* Change Photo Button */}
                            <motion.button
                                initial={{ opacity: 0, y: 20 }}
                                onClick={handleClick}
                                className="absolute bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 bg-accent-copper/90 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-accent-copper font-medium"
                            >
                                Change Photo
                            </motion.button>
                        </div>

                        {/* Success Indicator */}
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="absolute top-4 left-4 px-4 py-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full flex items-center gap-2"
                        >
                            <svg
                                className="w-5 h-5 text-green-400"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                            <span className="text-green-400 font-medium text-sm">Photo Ready</span>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
