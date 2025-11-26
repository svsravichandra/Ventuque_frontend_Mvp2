'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Model3DPreview from './Model3DPreview';

export interface CustomizationOptions {
    style: string;
    finish: string;
    mountType: string;
    personalizationText?: string;
}

interface CustomizationWizardProps {
    photoPreview: string | null;
    onComplete: (options: CustomizationOptions) => void;
}

const styles = [
    {
        id: 'chibi',
        name: 'Chibi Style',
        description: 'Cute, anime-inspired with oversized head',
        price: 0,
        image: '/images/style-chibi.png'
    },
    {
        id: 'classic',
        name: 'Classic Style',
        description: 'Realistic proportions and details',
        price: 5,
        image: '/images/style-classic.png'
    },
    {
        id: 'minimal',
        name: 'Minimal Style',
        description: 'Simple, clean geometric design',
        price: 0,
        image: '/images/style-minimal.png'
    }
];

const finishes = [
    {
        id: 'matte',
        name: 'Matte Finish',
        description: 'Smooth, non-reflective surface',
        price: 0
    },
    {
        id: 'glossy',
        name: 'Glossy Finish',
        description: 'Shiny, reflective coating',
        price: 3
    },
    {
        id: 'metallic',
        name: 'Metallic Finish',
        description: 'Premium metallic sheen',
        price: 8
    }
];

const mountTypes = [
    {
        id: 'clip',
        name: 'Vent Clip',
        description: 'Standard car vent mount',
        price: 0
    },
    {
        id: 'magnetic',
        name: 'Magnetic Mount',
        description: 'Strong magnetic base',
        price: 5
    },
    {
        id: 'adhesive',
        name: 'Adhesive Mount',
        description: 'Permanent adhesive backing',
        price: 2
    }
];

const steps = [
    { id: 1, title: 'Choose Style', subtitle: 'Select your figurine style' },
    { id: 2, title: 'Select Finish', subtitle: 'Pick your preferred finish' },
    { id: 3, title: 'Mount Type', subtitle: 'Choose how to mount it' },
    { id: 4, title: 'Personalize', subtitle: 'Add optional text (optional)' }
];

export default function CustomizationWizard({
    photoPreview,
    onComplete
}: CustomizationWizardProps) {
    const [currentStep, setCurrentStep] = useState(1);
    const [selections, setSelections] = useState<CustomizationOptions>({
        style: '',
        finish: '',
        mountType: '',
        personalizationText: ''
    });

    const handleStyleSelect = (styleId: string) => {
        setSelections({ ...selections, style: styleId });
    };

    const handleFinishSelect = (finishId: string) => {
        setSelections({ ...selections, finish: finishId });
    };

    const handleMountSelect = (mountId: string) => {
        setSelections({ ...selections, mountType: mountId });
    };

    const handleTextChange = (text: string) => {
        setSelections({ ...selections, personalizationText: text });
    };

    const handleNext = () => {
        if (currentStep < steps.length) {
            setCurrentStep(currentStep + 1);
        } else {
            onComplete(selections);
        }
    };

    const handleBack = () => {
        if (currentStep > 1) {
            setCurrentStep(currentStep - 1);
        }
    };

    const canProceed = () => {
        switch (currentStep) {
            case 1:
                return selections.style !== '';
            case 2:
                return selections.finish !== '';
            case 3:
                return selections.mountType !== '';
            case 4:
                return true; // Text is optional
            default:
                return false;
        }
    };

    const calculateTotal = () => {
        const basePrice = 49.99;
        const stylePrice = styles.find(s => s.id === selections.style)?.price || 0;
        const finishPrice = finishes.find(f => f.id === selections.finish)?.price || 0;
        const mountPrice = mountTypes.find(m => m.id === selections.mountType)?.price || 0;
        return basePrice + stylePrice + finishPrice + mountPrice;
    };

    return (
        <div className="w-full max-w-7xl mx-auto px-6 py-12">
            {/* Progress Bar */}
            <div className="mb-12">
                <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center flex-1">
                            <div className="flex flex-col items-center flex-1">
                                <motion.div
                                    initial={false}
                                    animate={{
                                        scale: currentStep === step.id ? 1.1 : 1,
                                        backgroundColor: currentStep >= step.id ? '#D4773C' : '#2A2A2A'
                                    }}
                                    className={`
                    w-12 h-12 rounded-full flex items-center justify-center
                    font-bold text-lg mb-2 border-2
                    ${currentStep >= step.id ? 'border-accent-copper' : 'border-text-secondary/30'}
                  `}
                                >
                                    {currentStep > step.id ? (
                                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    ) : (
                                        step.id
                                    )}
                                </motion.div>
                                <div className="text-center">
                                    <p className={`font-medium text-sm ${currentStep >= step.id ? 'text-text-primary' : 'text-text-secondary'}`}>
                                        {step.title}
                                    </p>
                                    <p className="text-xs text-text-secondary/70">{step.subtitle}</p>
                                </div>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="flex-1 h-0.5 bg-text-secondary/20 mx-4 mt-[-40px]">
                                    <motion.div
                                        initial={false}
                                        animate={{
                                            width: currentStep > step.id ? '100%' : '0%'
                                        }}
                                        transition={{ duration: 0.3 }}
                                        className="h-full bg-accent-copper"
                                    />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content Area */}
                <div className="lg:col-span-2">
                    <AnimatePresence mode="wait">
                        {/* Step 1: Style Selection */}
                        {currentStep === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-display text-4xl mb-6 text-gradient">Choose Your Style</h2>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {styles.map((style) => (
                                        <motion.div
                                            key={style.id}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            onClick={() => handleStyleSelect(style.id)}
                                            className={`
                        relative cursor-pointer rounded-2xl overflow-hidden border-2 transition-all
                        ${selections.style === style.id
                                                    ? 'border-accent-copper shadow-[0_0_30px_rgba(212,119,60,0.3)]'
                                                    : 'border-text-secondary/30 hover:border-accent-copper/50'
                                                }
                      `}
                                        >
                                            <div className="aspect-[3/4] bg-bg-secondary relative">
                                                {/* Placeholder for style image */}
                                                <div className="absolute inset-0 flex items-center justify-center text-text-secondary">
                                                    <svg className="w-20 h-20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                    </svg>
                                                </div>
                                            </div>
                                            <div className="p-4 bg-bg-primary">
                                                <h3 className="font-display text-xl mb-1">{style.name}</h3>
                                                <p className="text-text-secondary text-sm mb-2">{style.description}</p>
                                                <p className="text-accent-copper font-semibold">
                                                    {style.price === 0 ? 'Included' : `+$${style.price}`}
                                                </p>
                                            </div>
                                            {selections.style === style.id && (
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    className="absolute top-4 right-4 w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center"
                                                >
                                                    <svg className="w-5 h-5 text-bg-primary" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                    </svg>
                                                </motion.div>
                                            )}
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 2: Finish Selection */}
                        {currentStep === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-display text-4xl mb-6 text-gradient">Select Finish</h2>
                                <div className="space-y-4">
                                    {finishes.map((finish) => (
                                        <motion.div
                                            key={finish.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleFinishSelect(finish.id)}
                                            className={`
                        p-6 rounded-2xl border-2 cursor-pointer transition-all
                        ${selections.finish === finish.id
                                                    ? 'border-accent-copper bg-accent-copper/10'
                                                    : 'border-text-secondary/30 hover:border-accent-copper/50 bg-bg-secondary'
                                                }
                      `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-display text-2xl mb-2">{finish.name}</h3>
                                                    <p className="text-text-secondary">{finish.description}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-accent-copper font-semibold text-xl">
                                                        {finish.price === 0 ? 'Included' : `+$${finish.price}`}
                                                    </p>
                                                    {selections.finish === finish.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5 text-bg-primary" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 3: Mount Type Selection */}
                        {currentStep === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-display text-4xl mb-6 text-gradient">Choose Mount Type</h2>
                                <div className="space-y-4">
                                    {mountTypes.map((mount) => (
                                        <motion.div
                                            key={mount.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            onClick={() => handleMountSelect(mount.id)}
                                            className={`
                        p-6 rounded-2xl border-2 cursor-pointer transition-all
                        ${selections.mountType === mount.id
                                                    ? 'border-accent-copper bg-accent-copper/10'
                                                    : 'border-text-secondary/30 hover:border-accent-copper/50 bg-bg-secondary'
                                                }
                      `}
                                        >
                                            <div className="flex items-center justify-between">
                                                <div className="flex-1">
                                                    <h3 className="font-display text-2xl mb-2">{mount.name}</h3>
                                                    <p className="text-text-secondary">{mount.description}</p>
                                                </div>
                                                <div className="flex items-center gap-4">
                                                    <p className="text-accent-copper font-semibold text-xl">
                                                        {mount.price === 0 ? 'Included' : `+$${mount.price}`}
                                                    </p>
                                                    {selections.mountType === mount.id && (
                                                        <motion.div
                                                            initial={{ scale: 0 }}
                                                            animate={{ scale: 1 }}
                                                            className="w-8 h-8 bg-accent-copper rounded-full flex items-center justify-center"
                                                        >
                                                            <svg className="w-5 h-5 text-bg-primary" fill="currentColor" viewBox="0 0 20 20">
                                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                            </svg>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Step 4: Personalization */}
                        {currentStep === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                transition={{ duration: 0.3 }}
                            >
                                <h2 className="font-display text-4xl mb-6 text-gradient">Add Personal Touch</h2>
                                <div className="bg-bg-secondary rounded-2xl p-8">
                                    <label className="block mb-4">
                                        <span className="text-text-primary font-medium text-lg mb-2 block">
                                            Personalization Text (Optional)
                                        </span>
                                        <span className="text-text-secondary text-sm block mb-4">
                                            Add a name or short message (max 20 characters)
                                        </span>
                                        <input
                                            type="text"
                                            maxLength={20}
                                            value={selections.personalizationText}
                                            onChange={(e) => handleTextChange(e.target.value)}
                                            placeholder="e.g., Sarah's Car"
                                            className="w-full px-6 py-4 bg-bg-primary border-2 border-text-secondary/30 rounded-xl text-text-primary placeholder-text-secondary/50 focus:border-accent-copper focus:outline-none transition-colors text-lg"
                                        />
                                    </label>
                                    <p className="text-text-secondary/70 text-sm">
                                        {selections.personalizationText?.length || 0} / 20 characters
                                    </p>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-between mt-8">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={handleBack}
                            disabled={currentStep === 1}
                            className={`
                px-8 py-4 rounded-full font-semibold text-lg transition-all
                ${currentStep === 1
                                    ? 'bg-bg-secondary text-text-secondary/50 cursor-not-allowed'
                                    : 'bg-bg-secondary text-text-primary hover:bg-text-secondary/20'
                                }
              `}
                        >
                            Back
                        </motion.button>

                        <motion.button
                            whileHover={canProceed() ? { scale: 1.05, boxShadow: '0 0 60px rgba(212, 119, 60, 0.5)' } : {}}
                            whileTap={canProceed() ? { scale: 0.95 } : {}}
                            onClick={handleNext}
                            disabled={!canProceed()}
                            className={`
                px-12 py-4 rounded-full font-semibold text-lg transition-all
                ${canProceed()
                                    ? 'bg-gradient-to-r from-accent-copper to-accent-orange text-bg-primary'
                                    : 'bg-bg-secondary text-text-secondary/50 cursor-not-allowed'
                                }
              `}
                        >
                            {currentStep === steps.length ? 'Complete' : 'Next Step'}
                        </motion.button>
                    </div>
                </div>

                {/* Preview Panel */}
                <div className="lg:col-span-1">
                    <div className="sticky top-6">
                        {/* 3D Preview */}
                        <div className="mb-6">
                            <Model3DPreview
                                photoPreview={photoPreview}
                                style={selections.style || 'chibi'}
                                finish={selections.finish || 'matte'}
                                mountType={selections.mountType || 'clip'}
                            />
                        </div>

                        {/* Price Summary */}
                        <div className="bg-bg-secondary rounded-3xl p-6 border border-text-secondary/20">
                            <h3 className="font-display text-2xl mb-4">Summary</h3>

                            {/* Summary */}
                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-text-secondary">Base Price:</span>
                                    <span className="text-text-primary font-medium">$49.99</span>
                                </div>
                                {selections.style && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Style:</span>
                                        <span className="text-text-primary font-medium">
                                            {styles.find(s => s.id === selections.style)?.name}
                                            {(styles.find(s => s.id === selections.style)?.price || 0) > 0 &&
                                                ` (+$${styles.find(s => s.id === selections.style)?.price})`
                                            }
                                        </span>
                                    </div>
                                )}
                                {selections.finish && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Finish:</span>
                                        <span className="text-text-primary font-medium">
                                            {finishes.find(f => f.id === selections.finish)?.name}
                                            {(finishes.find(f => f.id === selections.finish)?.price || 0) > 0 &&
                                                ` (+$${finishes.find(f => f.id === selections.finish)?.price})`
                                            }
                                        </span>
                                    </div>
                                )}
                                {selections.mountType && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Mount:</span>
                                        <span className="text-text-primary font-medium">
                                            {mountTypes.find(m => m.id === selections.mountType)?.name}
                                            {(mountTypes.find(m => m.id === selections.mountType)?.price || 0) > 0 &&
                                                ` (+$${mountTypes.find(m => m.id === selections.mountType)?.price})`
                                            }
                                        </span>
                                    </div>
                                )}
                                {selections.personalizationText && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-text-secondary">Text:</span>
                                        <span className="text-text-primary font-medium">"{selections.personalizationText}"</span>
                                    </div>
                                )}
                            </div>

                            {/* Total */}
                            <div className="pt-4 border-t border-text-secondary/20">
                                <div className="flex justify-between items-center">
                                    <span className="font-display text-xl">Total:</span>
                                    <span className="font-display text-3xl text-gradient">
                                        ${calculateTotal().toFixed(2)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
