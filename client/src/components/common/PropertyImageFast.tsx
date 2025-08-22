import React, { useState, useEffect } from 'react';
import { extractGoogleDriveFileId } from '../../utils/imageUtils';

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PropertyImageFast: React.FC<PropertyImageProps> = ({ src, alt, className = '' }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const fileId = extractGoogleDriveFileId(src);
    
    if (!fileId) {
      // If not a Google Drive URL, use as-is
      setImageSrc(src);
      setIsLoading(false);
      return;
    }

    // Use the fastest loading URL formats (reduced from 12 to 3 for speed)
    const fastUrls = [
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://lh3.googleusercontent.com/d/${fileId}=w400-h300-c`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
    ];

    // Try the fastest loading URL first
    const tryLoadImage = (urlIndex: number = 0) => {
      if (urlIndex >= fastUrls.length) {
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const currentUrl = fastUrls[urlIndex];
      
      const img = new Image();
      
      // Much shorter timeout for faster fallback
      const timeoutId = setTimeout(() => {
        img.onload = null;
        img.onerror = null;
        tryLoadImage(urlIndex + 1);
      }, 3000); // Very short timeout

      img.onload = () => {
        clearTimeout(timeoutId);
        setImageSrc(currentUrl);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = () => {
        clearTimeout(timeoutId);
        tryLoadImage(urlIndex + 1);
      };

      img.src = currentUrl;
    };

    setIsLoading(true);
    setHasError(false);
    tryLoadImage();
  }, [src]);

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-5 w-5 border-2 border-indigo-600 border-t-transparent mb-1"></div>
          <span className="text-xs text-gray-500">Loading...</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    const fileId = extractGoogleDriveFileId(src);
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100`}>
        <div className="flex flex-col items-center text-center p-2">
          <svg className="h-8 w-8 text-gray-400 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 002 2z" />
          </svg>
          <span className="text-xs text-gray-500">No Image</span>
          {fileId && (
            <button 
              onClick={() => window.open(`https://drive.google.com/uc?export=view&id=${fileId}`, '_blank')}
              className="text-xs text-blue-600 hover:text-blue-800 mt-1"
            >
              View Direct
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <img
      src={imageSrc}
      alt={alt}
      className={`${className} transition-opacity duration-300`}
      style={{ 
        objectFit: 'cover',
        width: '100%',
        height: '100%'
      }}
      loading="lazy" // Add lazy loading for better performance
      onError={() => setHasError(true)}
    />
  );
};

export default PropertyImageFast;
