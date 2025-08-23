import React, { useState, useEffect } from 'react';
import { getAllPossibleUrls, extractGoogleDriveFileId } from '../../utils/imageUtils';

interface PropertyImageProps {
  src: string;
  alt: string;
  className?: string;
}

const PropertyImage: React.FC<PropertyImageProps> = ({ src, alt, className = '' }) => {
  const [imageSrc, setImageSrc] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [hasError, setHasError] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [currentUrlIndex, setCurrentUrlIndex] = useState<number>(0);

  const maxRetries = 2;

  useEffect(() => {
    if (!src) {
      setHasError(true);
      setIsLoading(false);
      return;
    }

    const fileId = extractGoogleDriveFileId(src);
    console.log('Processing image URL:', src);
    console.log('Extracted File ID:', fileId);

    if (!fileId) {
      console.log('❌ No valid Google Drive file ID found');
      setHasError(true);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setHasError(false);

    // Corrected URL patterns based on the working formats
    const urlsToTry = [
      // Primary Google Drive direct view URLs - most reliable
      `https://drive.google.com/uc?export=view&id=${fileId}`,
      `https://drive.google.com/uc?id=${fileId}`,
      
      // Google User Content domain - often works when drive.google.com is blocked
      `https://lh3.googleusercontent.com/d/${fileId}=w400-h300-c`,
      `https://lh3.googleusercontent.com/d/${fileId}=w500-h400-c`,
      `https://lh3.googleusercontent.com/d/${fileId}`,
      
      // Alternative googleusercontent patterns
      `https://lh4.googleusercontent.com/d/${fileId}=w400-h300`,
      `https://lh5.googleusercontent.com/d/${fileId}=w400-h300`,
      
      // Drive thumbnail API - sometimes works better for smaller images
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`,
      `https://drive.google.com/thumbnail?id=${fileId}&sz=w300-h200`,
      
      // Docs domain alternative
      `https://docs.google.com/uc?export=view&id=${fileId}`,
      `https://docs.google.com/uc?id=${fileId}`,
    ];

    console.log('Corrected URLs to try:', urlsToTry);

    const tryLoadImage = (urlIndex: number = 0) => {
      if (urlIndex >= urlsToTry.length) {
        console.log('❌ All corrected URLs failed to load image');
        setHasError(true);
        setIsLoading(false);
        return;
      }

      const currentUrl = urlsToTry[urlIndex];
      setCurrentUrlIndex(urlIndex);
      console.log(`🔄 Trying corrected URL ${urlIndex + 1}/${urlsToTry.length}:`, currentUrl);
      
      const img = new Image();
      
      const timeoutId = setTimeout(() => {
        console.log(`⏰ Timeout for corrected URL ${urlIndex + 1}`);
        img.onload = null;
        img.onerror = null;
        tryLoadImage(urlIndex + 1);
      }, 12000); // Increased timeout for better loading

      img.onload = () => {
        clearTimeout(timeoutId);
        console.log(`✅ Image loaded successfully with corrected URL ${urlIndex + 1}:`, currentUrl);
        setImageSrc(currentUrl);
        setIsLoading(false);
        setHasError(false);
      };

      img.onerror = (error) => {
        clearTimeout(timeoutId);
        console.log(`❌ Failed to load image with corrected URL ${urlIndex + 1}:`, currentUrl, error);
        setTimeout(() => tryLoadImage(urlIndex + 1), 2000);
      };

      img.src = currentUrl;
    };

    tryLoadImage();
  }, [src, retryCount]);

  const handleRetry = () => {
    if (retryCount < maxRetries) {
      setRetryCount(prev => prev + 1);
      setCurrentUrlIndex(0);
    }
  };

  const handleViewOriginal = () => {
    const fileId = extractGoogleDriveFileId(src);
    if (fileId) {
      window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank');
    } else {
      window.open(src, '_blank');
    }
  };

  if (isLoading) {
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200`}>
        <div className="flex flex-col items-center p-4">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-indigo-600 border-t-transparent mb-3"></div>
          <span className="text-sm text-gray-600 text-center font-medium">Loading image...</span>
          <span className="text-xs text-gray-500 mt-1">Trying source {currentUrlIndex + 1}</span>
        </div>
      </div>
    );
  }

  if (hasError) {
    const fileId = extractGoogleDriveFileId(src);
    return (
      <div className={`${className} flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-dashed border-gray-300`}>
        <div className="flex flex-col items-center p-4 text-center max-w-full">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-3">
            <svg className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <span className="text-sm text-gray-600 font-medium mb-1">Preview not available</span>
          <span className="text-xs text-gray-500 mb-3">Using direct URL format</span>
          
          {fileId && (
            <div className="space-y-2 w-full">
              <button 
                onClick={() => window.open(`https://drive.google.com/uc?export=view&id=${fileId}`, '_blank')}
                className="w-full text-xs bg-blue-500 text-white px-3 py-2 rounded-md hover:bg-blue-600 transition-colors"
              >
                📖 View Direct Link
              </button>
              <button 
                onClick={() => window.open(`https://drive.google.com/file/d/${fileId}/view`, '_blank')}
                className="w-full text-xs bg-green-500 text-white px-3 py-2 rounded-md hover:bg-green-600 transition-colors"
              >
                🔗 Open in Drive
              </button>
              {retryCount < maxRetries && (
                <button 
                  onClick={handleRetry}
                  className="w-full text-xs bg-gray-500 text-white px-3 py-2 rounded-md hover:bg-gray-600 transition-colors"
                >
                  🔄 Retry ({retryCount + 1}/{maxRetries + 1})
                </button>
              )}
            </div>
          )}
          
          {fileId && (
            <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600 font-mono max-w-full overflow-hidden">
              <div className="truncate">Direct: https://drive.google.com/uc?export=view&id={fileId}</div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full overflow-hidden rounded-lg">
      <img
        src={imageSrc}
        alt={alt}
        className={`${className} transition-opacity duration-300`}
        style={{ 
          objectFit: 'cover',
          width: '100%',
          height: '100%',
          display: 'block'
        }}
        onError={(e) => {
          console.log('❌ Final image display error for:', imageSrc);
          setHasError(true);
        }}
        onLoad={() => {
          console.log('✅ Image successfully displayed:', imageSrc);
        }}
      />
    </div>
  );
};

export default PropertyImage;
