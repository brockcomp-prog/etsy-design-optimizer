
import React from 'react';
import type { GeneratedImage } from '../types';
import { DownloadIcon, RegenerateIcon } from './icons';

interface ImageGridProps {
  images: GeneratedImage[];
  onImageSelect: (image: GeneratedImage) => void;
  onImageRegenerate: (imageId: string) => void;
}

const SkeletonCard: React.FC<{name: string}> = ({ name }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden aspect-[4/3] flex flex-col items-center justify-center animate-pulse p-4 text-center">
        <div className="w-12 h-12 bg-gray-300 rounded-lg mb-3"></div>
        <div className="h-3 bg-gray-300 rounded w-24 mb-1"></div>
        <div className="h-2 bg-gray-300 rounded w-16"></div>
        <p className="text-xs text-gray-400 mt-2 truncate">{name}</p>
    </div>
);

const ErrorCard: React.FC<{name: string, imageId: string, onRegenerate: (id: string) => void}> = ({ name, imageId, onRegenerate }) => (
    <div className="group relative bg-red-50 border border-red-200 rounded-lg shadow-md overflow-hidden aspect-[4/3] flex flex-col items-center justify-center p-4 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-10 h-10 text-red-400 mb-2">
            <circle cx="12" cy="12" r="10"></circle>
            <line x1="12" y1="8" x2="12" y2="12"></line>
            <line x1="12" y1="16" x2="12.01" y2="16"></line>
        </svg>
        <p className="text-sm font-semibold text-red-700">Generation Failed</p>
        <p className="text-xs text-red-500 mt-1 truncate" title={name}>{name}</p>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition-all duration-300 flex items-center justify-center">
             <button
                onClick={(e) => {
                    e.stopPropagation();
                    onRegenerate(imageId);
                }}
                className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-gray-100"
                aria-label={`Regenerate ${name}`}
            >
                <RegenerateIcon className="mr-1.5" />
                Regenerate
            </button>
        </div>
    </div>
);


const ImageCard: React.FC<{ image: GeneratedImage; onImageSelect: (image: GeneratedImage) => void; onImageRegenerate: (imageId: string) => void; }> = ({ image, onImageSelect, onImageRegenerate }) => {
  if (image.status === 'pending') return <SkeletonCard name={image.name} />;
  if (image.status === 'failed' || !image.base64) return <ErrorCard name={image.name} imageId={image.id} onRegenerate={onImageRegenerate} />;

  const handleDownload = () => {
    if(!image.base64) return;
    const link = document.createElement('a');
    link.href = image.base64;
    const fileExtension = image.base64.startsWith('data:image/png') ? 'png' : 'jpg';
    link.download = `${image.name.replace(/\s+/g, '_')}.${fileExtension}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className="group relative bg-white rounded-lg shadow-md overflow-hidden cursor-pointer"
      onClick={() => onImageSelect(image)}
      role="button"
      aria-label={`View ${image.name}`}
    >
      <img src={image.base64} alt={image.name} className="w-full h-auto object-cover aspect-[4/3]" />
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center gap-2">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onImageRegenerate(image.id);
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-gray-100"
          aria-label={`Regenerate ${image.name}`}
        >
          <RegenerateIcon className="mr-1.5" />
          Regenerate
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation(); // Prevent modal from opening
            handleDownload();
          }}
          className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center bg-white text-gray-800 px-3 py-1.5 rounded-md text-sm font-medium shadow-lg hover:bg-gray-100"
          aria-label={`Download ${image.name}`}
        >
          <DownloadIcon className="mr-1.5" />
          Download
        </button>
      </div>
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
        <p className="text-white text-xs font-semibold truncate">{image.name}</p>
      </div>
    </div>
  );
};

export const ImageGrid: React.FC<ImageGridProps> = ({ images, onImageSelect, onImageRegenerate }) => {
  if (images.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md h-full flex flex-col justify-center items-center text-center">
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-16 h-16 text-gray-300 mb-4">
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
            <circle cx="9" cy="9" r="2"></circle>
            <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"></path>
        </svg>
        <h3 className="text-lg font-semibold text-gray-800">Generated Images</h3>
        <p className="text-gray-500 mt-1">Your generated thumbnails and infographics will appear here.</p>
      </div>
    );
  }
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold text-gray-800">Generated Images</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-4">
        {images.map(image => (
          <ImageCard key={image.id} image={image} onImageSelect={onImageSelect} onImageRegenerate={onImageRegenerate} />
        ))}
      </div>
    </div>
  );
};
