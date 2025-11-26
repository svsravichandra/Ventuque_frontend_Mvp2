'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import PhotoUpload from '../components/PhotoUpload';
import CustomizationWizard, { CustomizationOptions } from '../components/CustomizationWizard';
import { customizationService, cartService } from '../../services/api';

export default function CustomizePage() {
    const router = useRouter();
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [photoId, setPhotoId] = useState<string | null>(null);
    const [showWizard, setShowWizard] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handlePhotoSelected = async (file: File, preview: string) => {
        setPhotoFile(file);
        setPhotoPreview(preview);

        // For MVP, create a mock photo ID
        // TODO: Upload to S3 and get real photo ID
        const mockPhotoId = `photo-${Date.now()}`;
        setPhotoId(mockPhotoId);
        setShowWizard(true);
    };

    const handleCustomizationComplete = async (options: CustomizationOptions) => {
        if (!photoId) {
            setError('Photo ID is missing');
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // 1. Create customization
            const customization = await customizationService.createCustomization({
                photoId,
                style: options.style,
                finish: options.finish,
                mountType: options.mountType,
                personalizationText: options.personalizationText
            });

            console.log('Customization created:', customization);

            // 2. Add to cart
            await cartService.addToCart(customization.id, 1);

            // 3. Redirect to cart
            router.push('/cart');
        } catch (err) {
            console.error('Error saving customization:', err);
            setError(err instanceof Error ? err.message : 'Failed to save customization');
            setLoading(false);
        }
    };

    return (
        <main className="min-h-screen bg-bg-primary">
            <div className="container mx-auto px-6 py-12">
                {!showWizard ? (
                    <div className="max-w-4xl mx-auto">
                        <div className="text-center mb-12">
                            <h1 className="font-display text-6xl md:text-8xl mb-6">
                                <span className="text-gradient">CREATE YOUR</span>
                                <br />
                                <span className="text-text-primary">FIGURINE</span>
                            </h1>
                            <p className="text-text-secondary text-xl md:text-2xl">
                                Upload your photo to get started
                            </p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                                <p className="text-red-400">{error}</p>
                            </div>
                        )}

                        <PhotoUpload
                            onPhotoSelected={handlePhotoSelected}
                            maxSizeMB={10}
                            minWidth={500}
                            minHeight={500}
                        />
                    </div>
                ) : (
                    <>
                        {loading && (
                            <div className="fixed inset-0 bg-bg-primary/80 backdrop-blur-sm z-50 flex items-center justify-center">
                                <div className="text-center">
                                    <div className="w-16 h-16 border-4 border-accent-copper border-t-transparent rounded-full animate-spin mx-auto mb-4" />
                                    <p className="text-text-primary text-xl">Saving your customization...</p>
                                </div>
                            </div>
                        )}
                        <CustomizationWizard
                            photoPreview={photoPreview}
                            onComplete={handleCustomizationComplete}
                        />
                    </>
                )}
            </div>
        </main>
    );
}
