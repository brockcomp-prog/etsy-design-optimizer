
import React, { useState, useCallback } from 'react';
import { UploadPanel } from './components/UploadPanel';
import { ImageGrid } from './components/ImageGrid';
import { CopyPanel } from './components/CopyPanel';
import { PreviewModal } from './components/PreviewModal';
import type { AnalysisResult, CopyResult, GeneratedImage } from './types';
import { analyzeImages, generateCopy, generateMockup, generateMockupPrompts } from './services/geminiService';
import { DownloadIcon } from './components/icons';

// Add this declaration to inform TypeScript about the global JSZip variable from the CDN
declare var JSZip: any;

const MAX_FILES = 5;

export default function App() {
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
      setError('Please upload at least one flyer image.');
      return;
    }
    
    setIsAnalyzing(true);
    setError(null);
    resetResults();
    
    try {
      setLoadingMessage('Analyzing flyer theme...');
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
      setError('Please analyze a flyer before generating assets.');
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
          .then(imageData => {
            setGeneratedImages(prev => prev.map((img, i) =>
              i === index ? { ...img, base64: imageData, status: 'completed' } : img
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

    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during generation.');
      setGeneratedImages([]); 
    } finally {
      setIsGenerating(false);
      setLoadingMessage('');
    }
  }, [analysisResult, uploadedFiles]);


  const handleImageRegenerate = useCallback(async (imageId: string) => {
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

        const imageData = await generateMockup(imagesForMockup, promptData.prompt);
        
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
  }, [generatedImages, mockupPrompts, uploadedFiles]);

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

  return (
    <div className="min-h-screen font-sans" style={{background: 'linear-gradient(135deg, #FFF5F5 0%, #FFFFFF 50%, #F0FFFF 100%)'}}>
      <header className="bg-white/80 backdrop-blur-lg border-b border-gray-100 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-3"><div className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}><svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg></div><h1 className="text-2xl font-bold" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #F5A623 50%, #20B2AA 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text'}}>Etsy Design Optimizer</h1></div>
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
      </header>
      
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {error && (
            <div className="mb-4 px-4 py-3 rounded-xl relative" style={{backgroundColor: 'rgba(255, 107, 107, 0.1)', border: '1px solid #FF6B6B', color: '#E85555'}} role="alert">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
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
    </div>
  );
}