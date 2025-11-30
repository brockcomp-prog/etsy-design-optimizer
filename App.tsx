
import React, { useState, useCallback, useEffect } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { ImageGrid } from './components/ImageGrid';
import { CopyPanel } from './components/CopyPanel';
import { PreviewModal } from './components/PreviewModal';
import { LandingPage } from './components/LandingPage';
import { PricingModal } from './components/PricingModal';
import { SuccessPage } from './components/SuccessPage';
import type { AnalysisResult, CopyResult, GeneratedImage } from './types';
import { analyzeImages, generateCopy, generateMockup, generateMockupPrompts } from './services/geminiService';
import { getUserState, canGenerate, incrementUsage, getRemainingGenerations, isPremium } from './services/usageService';
import { addWatermark } from './services/watermarkService';
import { DownloadIcon, CrownIcon } from './components/icons';

// Add this declaration to inform TypeScript about the global JSZip variable from the CDN
declare var JSZip: any;

const MAX_FILES = 5;

export default function App() {
  const [showApp, setShowApp] = useState<boolean>(false);
  const [showSuccessPage, setShowSuccessPage] = useState<boolean>(false);
  const [showPricingModal, setShowPricingModal] = useState<boolean>(false);
  const [pricingReason, setPricingReason] = useState<'limit_reached' | 'remove_watermark' | 'upgrade'>('upgrade');
  const [remainingGenerations, setRemainingGenerations] = useState<number>(getRemainingGenerations());

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [uploadedFilePreviews, setUploadedFilePreviews] = useState<string[]>([]);
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [copyResult, setCopyResult] = useState<CopyResult | null>(null);
  const [generatedImages, setGeneratedImages] = useState<GeneratedImage[]>([]);
  const [mockupPrompts, setMockupPrompts] = useState<{ name: string; prompt: string }[]>([]);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState<GeneratedImage | null>(null);

  const userIsPremium = isPremium();

  // Check for success page URL params on mount
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const planParam = urlParams.get('plan');
    if (planParam === 'pro' || planParam === 'lifetime') {
      setShowSuccessPage(true);
    }
  }, []);

  // Update remaining generations when user state changes
  useEffect(() => {
    setRemainingGenerations(getRemainingGenerations());
  }, [showPricingModal, showSuccessPage]);

  const handleGetStarted = () => {
    setShowApp(true);
  };

  const handleOpenPricing = (reason: 'limit_reached' | 'remove_watermark' | 'upgrade' = 'upgrade') => {
    setPricingReason(reason);
    setShowPricingModal(true);
  };

  const resetResults = () => {
    setAnalysisResult(null);
    setCopyResult(null);
    setGeneratedImages([]);
    setMockupPrompts([]);
  };

  const handleFilesAdd = (files: File[]) => {
    setError(null);
    const newFiles = [...uploadedFiles];
    const newPreviews = [...uploadedFilePreviews];

    for (const file of files) {
      if (newFiles.length >= MAX_FILES) {
        setError(`You can upload a maximum of ${MAX_FILES} images.`);
        break;
      }
      if (file.type === 'image/png' || file.type === 'image/jpeg') {
        newFiles.push(file);
        newPreviews.push(URL.createObjectURL(file));
      } else {
        setError('Please upload valid PNG or JPG files.');
      }
    }

    setUploadedFiles(newFiles);
    setUploadedFilePreviews(newPreviews);
    resetResults();
  };

  const handleFileRemove = (indexToRemove: number) => {
    setUploadedFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadedFilePreviews(prev => {
        const newPreviews = prev.filter((_, index) => index !== indexToRemove);
        URL.revokeObjectURL(prev[indexToRemove]);
        return newPreviews;
    });
    resetResults();
  };

  const handleAnalysisResultChange = (field: keyof AnalysisResult, value: string | string[]) => {
    setAnalysisResult(prev => {
        if (!prev) return null;
        // When any analysis result changes, copy and mockups are no longer valid.
        setCopyResult(null);
        setGeneratedImages([]);
        setMockupPrompts([]);
        return { ...prev, [field]: value };
    });
  };

  const fileToB64 = (file: File): Promise<{ data: string, mimeType: string }> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            const base64 = (reader.result as string).split(',')[1];
            resolve({ data: base64, mimeType: file.type });
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
  };

  const handleAnalyze = useCallback(async () => {
    if (uploadedFiles.length === 0) {
      setError('Please upload at least one design image.');
      return;
    }

    setIsAnalyzing(true);
    setError(null);
    resetResults();

    try {
      setLoadingMessage('Analyzing design theme...');
      const base64Images = await Promise.all(uploadedFiles.map(fileToB64));
      const analysis = await analyzeImages(base64Images);
      setAnalysisResult(analysis);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during analysis.');
    } finally {
      setIsAnalyzing(false);
      setLoadingMessage('');
    }
  }, [uploadedFiles]);

  const handleGenerateAssets = useCallback(async () => {
    if (!analysisResult) {
      setError('Please analyze a design before generating assets.');
      return;
    }

    // Check usage limits for free users
    if (!canGenerate()) {
      handleOpenPricing('limit_reached');
      return;
    }

    setIsGenerating(true);
    setError(null);

    // Clear previous assets but keep analysis
    setCopyResult(null);
    setGeneratedImages([]);
    setMockupPrompts([]);

    try {
      const base64Images = await Promise.all(uploadedFiles.map(fileToB64));

      // Generate Copy (fire-and-forget, updates UI when done)
      setLoadingMessage('Generating listing copy...');
      const copyPromise = generateCopy(analysisResult).then(copy => {
        setCopyResult(copy);
        return true;
      }).catch(err => {
        console.error("Failed to generate copy", err);
        setError("Failed to generate listing copy.");
        return false;
      });

      // Generate Mockup Prompts
      setLoadingMessage('Brainstorming mockup ideas...');
      const dynamicPrompts = await generateMockupPrompts(analysisResult);
      setMockupPrompts(dynamicPrompts);

      // Set up placeholders and generate images
      setLoadingMessage(`Generating ${dynamicPrompts.length} custom mockups...`);
      const imagePlaceholders: GeneratedImage[] = dynamicPrompts.map((p, i) => ({
        id: `${p.name.replace(/\s+/g, '-')}-${i}-${Date.now()}`,
        name: p.name,
        base64: null,
        status: 'pending',
      }));
      setGeneratedImages(imagePlaceholders);

      const imagePromises = dynamicPrompts.map((promptData, index) => {
        let imagesForMockup: { data: string; mimeType: string; }[];

        if (index === 0) {
            imagesForMockup = base64Images;
        } else {
            imagesForMockup = [base64Images[(index - 1) % base64Images.length]];
        }

        return generateMockup(imagesForMockup, promptData.prompt)
          .then(async (imageData) => {
            // Apply watermark for free users
            let finalImageData = imageData;
            if (!userIsPremium) {
              try {
                finalImageData = await addWatermark(imageData);
              } catch (wmErr) {
                console.error('Failed to add watermark:', wmErr);
                // Continue with unwatermarked image if watermarking fails
              }
            }

            setGeneratedImages(prev => prev.map((img, i) =>
              i === index ? { ...img, base64: finalImageData, status: 'completed' } : img
            ));
            return true;
          })
          .catch(err => {
            console.error(`Failed to generate ${promptData.name}`, err);
            setGeneratedImages(prev => prev.map((img, i) =>
              i === index ? { ...img, status: 'failed' } : img
            ));
            return false;
          });
      });

      await Promise.allSettled([copyPromise, ...imagePromises]);

      // Increment usage for free users after successful generation
      if (!userIsPremium) {
        incrementUsage();
        setRemainingGenerations(getRemainingGenerations());
      }

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
      setGeneratedImages([]);
    } finally {
      setIsGenerating(false);
      setLoadingMessage('');
    }
  }, [analysisResult, uploadedFiles, userIsPremium]);


  const handleImageRegenerate = useCallback(async (imageId: string) => {
    // Check usage limits for free users on regeneration
    if (!userIsPremium && !canGenerate()) {
      handleOpenPricing('limit_reached');
      return;
    }

    const imageIndex = generatedImages.findIndex(img => img.id === imageId);
    if (imageIndex === -1 || !mockupPrompts[imageIndex]) {
        console.error("Could not find image or prompt to regenerate.");
        return;
    }

    setGeneratedImages(prev => prev.map(img =>
        img.id === imageId ? { ...img, status: 'pending', base64: null } : img
    ));

    try {
        const base64Images = await Promise.all(uploadedFiles.map(fileToB64));
        const promptData = mockupPrompts[imageIndex];

        let imagesForMockup: { data: string; mimeType: string; }[];
        if (imageIndex === 0) {
            imagesForMockup = base64Images;
        } else {
            imagesForMockup = [base64Images[(imageIndex - 1) % base64Images.length]];
        }

        let imageData = await generateMockup(imagesForMockup, promptData.prompt);

        // Apply watermark for free users
        if (!userIsPremium) {
          try {
            imageData = await addWatermark(imageData);
          } catch (wmErr) {
            console.error('Failed to add watermark:', wmErr);
          }
        }

        setGeneratedImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, base64: imageData, status: 'completed' } : img
        ));

    } catch (err) {
        console.error(`Failed to regenerate ${mockupPrompts[imageIndex]?.name}`, err);
        setGeneratedImages(prev => prev.map(img =>
            img.id === imageId ? { ...img, status: 'failed' } : img
        ));
        setError(`Failed to regenerate image: ${mockupPrompts[imageIndex]?.name}`);
    }
  }, [generatedImages, mockupPrompts, uploadedFiles, userIsPremium]);

  const handleDownloadAll = useCallback(async () => {
      const completedImages = generatedImages.filter(img => img.status === 'completed');
      if (completedImages.length === 0 && !copyResult) {
        alert("No assets have been generated to download.");
        return;
      }

      const zip = new JSZip();
      const imageFolder = zip.folder("generated_mockups");

      for (const image of completedImages) {
          if(!image.base64) continue;
          const fileExtension = image.base64.startsWith('data:image/png') ? 'png' : 'jpg';
          const fileName = `${image.name.replace(/\s+/g, '_')}.${fileExtension}`;
          const base64Data = image.base64.split(',')[1];
          imageFolder!.file(fileName, base64Data, { base64: true });
      }

      if (copyResult) {
          const copyFolder = zip.folder("listing_copy");
          copyFolder!.file("title.txt", copyResult.title);
          copyFolder!.file("description.txt", copyResult.description);
          copyFolder!.file("tags.csv", copyResult.tags.join(','));
          copyFolder!.file("materials.csv", copyResult.materials.join(','));
      }

      if(analysisResult){
        zip.file("metadata.json", JSON.stringify(analysisResult, null, 2));
      }

      const content = await zip.generateAsync({ type: "blob" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(content);
      link.download = "Etsy_Design_Optimizer_Assets.zip";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  }, [generatedImages, copyResult, analysisResult]);

  const handleImageSelect = (image: GeneratedImage) => {
    if(image.status === 'completed') {
        setSelectedImagePreview(image);
    }
  };

  const handleClosePreview = () => {
      setSelectedImagePreview(null);
  };

  const hasResults = generatedImages.length > 0 || copyResult;

  // Show success page after Stripe payment
  if (showSuccessPage) {
    return (
      <SuccessPage
        onContinue={() => {
          setShowSuccessPage(false);
          setShowApp(true);
        }}
      />
    );
  }

  // Show landing page if user hasn't clicked "Get Started"
  if (!showApp) {
    return (
      <>
        <LandingPage onGetStarted={handleGetStarted} onOpenPricing={() => handleOpenPricing('upgrade')} />
        <PricingModal
          isOpen={showPricingModal}
          onClose={() => setShowPricingModal(false)}
          reason={pricingReason}
        />
      </>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}>
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #F5A623 50%, #20B2AA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>
              Etsy Design Optimizer
            </h1>
            {userIsPremium && (
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold text-white" style={{background: 'linear-gradient(135deg, #FFB347 0%, #FF6B6B 100%)'}}>
                <CrownIcon className="w-3 h-3" />
                PRO
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            {!userIsPremium && (
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-600">
                  {remainingGenerations === 0 ? (
                    <span className="text-red-500 font-medium">No generations left today</span>
                  ) : (
                    <>{remainingGenerations} free generation{remainingGenerations !== 1 ? 's' : ''} left</>
                  )}
                </span>
                <button
                  onClick={() => handleOpenPricing('upgrade')}
                  className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-xl text-white transition-all hover:scale-105"
                  style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
                >
                  <CrownIcon className="w-4 h-4 mr-1.5" />
                  Upgrade
                </button>
              </div>
            )}
            {hasResults && (
              <button
                  onClick={handleDownloadAll}
                  disabled={isGenerating && generatedImages.some(i => i.status === 'pending')}
                  className="inline-flex items-center px-5 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white transition-all duration-300 hover:scale-105 hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{background: 'linear-gradient(135deg, #20B2AA 0%, #00D9A5 100%)'}}
              >
                  <DownloadIcon className="mr-2" />
                  Download All as ZIP
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
            <div className="mb-4 px-4 py-3 rounded-xl relative" style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid #FF6B6B', color: '#E85555'}} role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
            </div>
        )}

        {/* Watermark notice for free users with results */}
        {!userIsPremium && hasResults && (
          <div className="mb-4 px-4 py-3 rounded-xl flex items-center justify-between" style={{backgroundColor: 'rgba(255, 179, 71, 0.1)', border: '1px solid #FFB347'}}>
            <div className="flex items-center gap-2">
              <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="text-sm text-gray-700">
                Your images include a watermark. <strong>Upgrade to Pro</strong> for watermark-free downloads.
              </span>
            </div>
            <button
              onClick={() => handleOpenPricing('remove_watermark')}
              className="text-sm font-semibold px-3 py-1 rounded-lg transition-colors"
              style={{color: '#FF6B6B'}}
            >
              Remove Watermarks
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-3">
            <UploadPanel
              onFilesAdd={handleFilesAdd}
              onFileRemove={handleFileRemove}
              previewUrls={uploadedFilePreviews}
              onAnalyze={handleAnalyze}
              onGenerate={handleGenerateAssets}
              onAnalysisChange={handleAnalysisResultChange}
              analysisResult={analysisResult}
              isAnalyzing={isAnalyzing}
              isGenerating={isGenerating}
              loadingMessage={loadingMessage}
            />
          </div>
          <div className="lg:col-span-9 grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8">
              <ImageGrid images={generatedImages} onImageSelect={handleImageSelect} onImageRegenerate={handleImageRegenerate} />
            </div>
            <div className="xl:col-span-4">
              <CopyPanel copyResult={copyResult} isGenerating={isGenerating && !copyResult} />
            </div>
          </div>
        </div>
      </main>

      {selectedImagePreview && (
        <PreviewModal image={selectedImagePreview} onClose={handleClosePreview} />
      )}

      <PricingModal
        isOpen={showPricingModal}
        onClose={() => setShowPricingModal(false)}
        reason={pricingReason}
      />
    </div>
  );
}
