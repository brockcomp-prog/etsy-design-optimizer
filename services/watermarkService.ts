// Watermark service for free tier images

export const addWatermark = async (imageBase64: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Could not get canvas context'));
        return;
      }

      canvas.width = img.width;
      canvas.height = img.height;

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Add semi-transparent overlay for watermark area
      const watermarkHeight = Math.max(60, img.height * 0.08);
      const gradient = ctx.createLinearGradient(0, img.height - watermarkHeight, 0, img.height);
      gradient.addColorStop(0, 'rgba(0, 0, 0, 0)');
      gradient.addColorStop(0.3, 'rgba(0, 0, 0, 0.3)');
      gradient.addColorStop(1, 'rgba(0, 0, 0, 0.5)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, img.height - watermarkHeight, img.width, watermarkHeight);

      // Add diagonal watermarks across the image
      ctx.save();
      ctx.globalAlpha = 0.15;
      ctx.font = `bold ${Math.max(24, img.width * 0.04)}px Arial, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';

      const text = 'ETSY DESIGN OPTIMIZER';
      const diagonalSpacing = Math.max(200, img.width * 0.25);

      ctx.translate(img.width / 2, img.height / 2);
      ctx.rotate(-Math.PI / 6); // -30 degrees

      for (let y = -img.height; y < img.height * 2; y += diagonalSpacing) {
        for (let x = -img.width; x < img.width * 2; x += diagonalSpacing) {
          ctx.fillText(text, x, y);
        }
      }

      ctx.restore();

      // Add bottom watermark text
      ctx.font = `bold ${Math.max(16, img.width * 0.025)}px Arial, sans-serif`;
      ctx.fillStyle = '#FFFFFF';
      ctx.textAlign = 'center';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.5)';
      ctx.shadowBlur = 4;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const bottomText = 'Upgrade to Pro for watermark-free images';
      ctx.fillText(bottomText, img.width / 2, img.height - watermarkHeight / 2 + 5);

      // Add website URL
      ctx.font = `${Math.max(12, img.width * 0.018)}px Arial, sans-serif`;
      ctx.fillText('etsydesignoptimizer.com', img.width / 2, img.height - watermarkHeight / 4);

      // Convert canvas to base64
      const watermarkedImage = canvas.toDataURL('image/png');
      resolve(watermarkedImage);
    };

    img.onerror = () => {
      reject(new Error('Failed to load image for watermarking'));
    };

    img.src = imageBase64;
  });
};

// Check if an image is watermarked (by checking metadata or size comparison)
export const isWatermarked = (imageBase64: string): boolean => {
  // Simple heuristic: watermarked images would have been processed
  // In a real implementation, we could store metadata
  return false;
};
