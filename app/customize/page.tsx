'use client';

import { useState } from 'react';
import PhotoUpload from './components/PhotoUpload';
import CustomizationWizard, { CustomizationOptions } from './components/CustomizationWizard';

export default function CustomizePage() {
    const [photoFile, setPhotoFile] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [showWizard, setShowWizard] = useState(false);

    const handlePhotoSelected = (file: File, preview: string) => {
        setPhotoFile(file);
        setPhotoPreview(preview);
        setShowWizard(true);
    };

    const handleCustomizationComplete = async (options: CustomizationOptions) => {
        console.log('Customization complete:', options);
        console.log('Photo file:', photoFile);

        // TODO: Upload photo to S3 and save customization
        // This will integrate with the backend API
        alert('Customization saved! (Integration with backend pending)');
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

                        <PhotoUpload
                            onPhotoSelected={handlePhotoSelected}
                            maxSizeMB={10}
                            minWidth={500}
                            minHeight={500}
                        />
                    </div>
                ) : (
                    <CustomizationWizard
                        photoPreview={photoPreview}
                        onComplete={handleCustomizationComplete}
                    />
                )}
            </div>
        </main>
    );
}
