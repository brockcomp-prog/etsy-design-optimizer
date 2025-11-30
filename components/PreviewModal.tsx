
import React, { useEffect } from 'react';
import type { GeneratedImage } from '../types';
import { CloseIcon } from './icons';

interface PreviewModalProps {
  image: GeneratedImage;
  onClose: () => void;
}

export const PreviewModal: React.FC<PreviewModalProps> = ({ image, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);

    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="image-preview-title"
    >
      <div
        className="relative bg-white/95 backdrop-blur-xl p-3 rounded-2xl shadow-2xl max-w-4xl max-h-[90vh] w-full border border-gray-100"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking on the image/container
      >
        <div className="flex justify-between items-center pb-2 px-2">
            <h2 id="image-preview-title" className="text-lg font-semibold text-gray-800 truncate">{image.name}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-900 transition-colors"
              aria-label="Close image preview"
            >
              <CloseIcon />
            </button>
        </div>
        <div className="overflow-auto max-h-[calc(90vh-60px)]">
            <img
              src={image.base64}
              alt={image.name}
              className="w-full h-auto object-contain"
            />
        </div>
      </div>
    </div>
  );
};
