
import React, { useRef } from 'react';
import type { AnalysisResult } from '../types';
import { UploadCloudIcon, GenerateIcon, CloseIcon } from './icons';
import { Spinner } from './Spinner';

interface UploadPanelProps {
  onFilesAdd: (files: File[]) => void;
  onFileRemove: (index: number) => void;
  previewUrls: string[];
  onAnalyze: () => void;
  onGenerate: () => void;
  onAnalysisChange: (field: keyof AnalysisResult, value: string | string[]) => void;
  analysisResult: AnalysisResult | null;
  isAnalyzing: boolean;
  isGenerating: boolean;
  loadingMessage: string;
}

const MAX_FILES = 5;

const PRODUCT_TYPE_OPTIONS = [
    'Digital Template',
    'Printable Art',
    'Physical Product',
    'Event Service',
    'Clothing & Apparel',
    'Home & Living',
    'Jewelry & Accessories',
];

export const UploadPanel: React.FC<UploadPanelProps> = ({ 
    onFilesAdd, 
    onFileRemove, 
    previewUrls, 
    onAnalyze, 
    onGenerate, 
    onAnalysisChange, 
    analysisResult, 
    isAnalyzing, 
    isGenerating, 
    loadingMessage 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
        onFilesAdd(files);
    }
    if(event.target) {
        event.target.value = "";
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    const files = Array.from(event.dataTransfer.files || []);
    if (files.length > 0) {
        onFilesAdd(files);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
  };
  
  const canAnalyze = previewUrls.length > 0 && !isAnalyzing && !isGenerating;
  const canGenerate = !!analysisResult && !isAnalyzing && !isGenerating;
  const isLoading = isAnalyzing || isGenerating;

  return (
    <div className="bg-white/90 backdrop-blur-sm p-6 rounded-2xl shadow-lg space-y-6 sticky top-24 border border-gray-100">
      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">1. Upload designs</h2>
        <div
          className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-coral transition-all duration-300 hover:bg-coral/5" style={{borderColor: '#e5e7eb'}} onMouseOver={(e)=>e.currentTarget.style.borderColor='#FF6B6B'} onMouseOut={(e)=>e.currentTarget.style.borderColor='#e5e7eb'}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          role="button"
          aria-label="Upload files"
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
            accept="image/png, image/jpeg"
            multiple
          />
          <UploadCloudIcon className="mx-auto" />
          <p className="mt-2 text-sm text-gray-600">
            <span className="font-semibold text-coral">Click to upload</span> or drag and drop
          </p>
          <p className="text-xs text-gray-500">PNG or JPG (up to {MAX_FILES})</p>
        </div>
      </div>

      {previewUrls.length > 0 && (
        <div>
          <h3 className="text-md font-semibold text-gray-700 mb-2">Previews ({previewUrls.length}/{MAX_FILES})</h3>
          <div className="grid grid-cols-3 gap-2">
            {previewUrls.map((url, index) => (
              <div key={index} className="relative group aspect-square">
                <img src={url} alt={`design preview ${index + 1}`} className="rounded-md w-full h-full object-cover" />
                <button
                    onClick={() => onFileRemove(index)}
                    className="absolute top-1 right-1 bg-black bg-opacity-50 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100"
                    aria-label={`Remove image ${index + 1}`}
                >
                    <CloseIcon className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h2 className="text-lg font-semibold text-gray-800 mb-3">{!analysisResult ? '2. Analyze design' : '3. Generate Assets'}</h2>
        <button
          onClick={!analysisResult ? onAnalyze : onGenerate}
          disabled={!analysisResult ? !canAnalyze : !canGenerate}
          className="w-full h-11 inline-flex items-center justify-center px-4 py-2.5 border border-transparent text-sm font-semibold rounded-xl shadow-lg text-white transition-all duration-300 hover:scale-[1.02] hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100" style={{background: 'linear-gradient(135deg, #FF6B6B 0%, #FFB347 100%)'}}
        >
          {isLoading ? <Spinner /> : <GenerateIcon className="mr-2"/>}
          {isAnalyzing ? 'Analyzing...' : (isGenerating ? 'Generating...' : (!analysisResult ? 'Analyze design' : 'Generate Assets'))}
        </button>
        {isLoading && loadingMessage && (
            <p className="text-xs text-gray-600 text-center mt-2 animate-pulse">{loadingMessage}</p>
        )}
      </div>

      {analysisResult && (
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Analysis Results</h2>
          <div className="space-y-4 text-sm">
            <div>
              <label htmlFor="analysis-theme" className="font-semibold text-gray-600">Theme:</label>
              <input
                id="analysis-theme"
                type="text"
                value={analysisResult.theme}
                onChange={(e) => onAnalysisChange('theme', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-coral focus:border-coral disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>
             <div>
              <label htmlFor="analysis-product-type" className="font-semibold text-gray-600">Product Type:</label>
               <select
                id="analysis-product-type"
                value={analysisResult.productType}
                onChange={(e) => onAnalysisChange('productType', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-coral focus:border-coral disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
                aria-label="Select Product Type"
              >
                {!PRODUCT_TYPE_OPTIONS.includes(analysisResult.productType) && (
                    <option key={analysisResult.productType} value={analysisResult.productType}>
                        {analysisResult.productType} (Detected)
                    </option>
                )}
                {PRODUCT_TYPE_OPTIONS.map(opt => (
                    <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="analysis-event-type" className="font-semibold text-gray-600">Event Type:</label>
               <input
                id="analysis-event-type"
                type="text"
                value={analysisResult.eventType}
                onChange={(e) => onAnalysisChange('eventType', e.target.value)}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-coral focus:border-coral disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
              />
            </div>
            <div>
              <label htmlFor="analysis-key-text" className="font-semibold text-gray-600">Key Text (comma-separated):</label>
               <textarea
                id="analysis-key-text"
                value={analysisResult.keyText.join(', ')}
                onChange={(e) => onAnalysisChange('keyText', e.target.value.split(',').map(s => s.trim()).filter(Boolean))}
                className="w-full mt-1 p-2 border border-gray-300 rounded-md bg-white focus:ring-coral focus:border-coral disabled:bg-gray-100 disabled:cursor-not-allowed"
                disabled={isLoading}
                rows={3}
              />
            </div>
            <div>
              <h4 className="font-semibold text-gray-600">Dominant Colors:</h4>
              <div className="flex flex-wrap gap-2 mt-1">
                {analysisResult.dominantColors.map((color) => (
                  <div key={color} className="w-8 h-8 rounded-full border border-gray-200" style={{ backgroundColor: color }} title={color} />
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};