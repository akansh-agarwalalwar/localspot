export const extractGoogleDriveFileId = (url: string): string | null => {
    if (!url) return null;
    
    // Try multiple patterns to extract file ID
    const patterns = [
        /\/d\/([a-zA-Z0-9-_]+)/,  // /file/d/FILE_ID/view
        /id=([a-zA-Z0-9-_]+)/,    // uc?export=view&id=FILE_ID
        /\/([a-zA-Z0-9-_]{25,})/   // Direct file ID pattern (Google Drive IDs are typically 28+ chars)
    ];
    
    for (const pattern of patterns) {
        const match = url.match(pattern);
        if (match && match[1] && match[1].length >= 25) { // Valid Google Drive file IDs are long
            return match[1];
        }
    }
    
    return null;
};

export const convertGoogleDriveUrl = (url: string): string => {
    if (!url) return '';
    
    const fileId = extractGoogleDriveFileId(url);
    if (fileId) {
        // Use the correct direct image URL format
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
};

export const getImagePreviewUrl = (url: string): string => {
    const fileId = extractGoogleDriveFileId(url);
    if (fileId) {
        // Primary: Use the corrected direct view URL
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
};

export const getAllPossibleUrls = (url: string): string[] => {
    const fileId = extractGoogleDriveFileId(url);
    if (!fileId) return [url];
    
    return [
        // Corrected primary URLs - most reliable formats
        `https://drive.google.com/uc?export=view&id=${fileId}`,
        `https://drive.google.com/uc?id=${fileId}`,
        
        // Google User Content - alternative domain that often works
        `https://lh3.googleusercontent.com/d/${fileId}=w400-h300-c`,
        `https://lh3.googleusercontent.com/d/${fileId}=w500-h400-c`,
        `https://lh3.googleusercontent.com/d/${fileId}`,
        
        // Alternative Google domains
        `https://lh4.googleusercontent.com/d/${fileId}=w400-h300`,
        `https://lh5.googleusercontent.com/d/${fileId}=w400-h300`,
        
        // Thumbnail API
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`,
        `https://drive.google.com/thumbnail?id=${fileId}&sz=w500`,
        
        // Docs domain alternative
        `https://docs.google.com/uc?export=view&id=${fileId}`,
        `https://docs.google.com/uc?id=${fileId}`,
        
        // Original URL as final fallback
        url
    ].filter((url, index, self) => self.indexOf(url) === index); // Remove duplicates
};

export const validateImageUrl = (url: string): boolean => {
    if (!url) return false;
    
    // Check if it's a valid HTTP/HTTPS URL
    if (!/^https?:\/\/.+/.test(url)) return false;
    
    // Check if it's a Google Drive link or direct image URL
    return url.includes('drive.google.com') || 
           url.includes('googleapis.com') ||
           url.includes('googleusercontent.com') ||
           /\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export const testImageLoad = (url: string): Promise<boolean> => {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(true);
        img.onerror = () => resolve(false);
        img.src = url;
        
        // Timeout after 10 seconds
        setTimeout(() => resolve(false), 10000);
    });
};

// Helper function to create a proxy URL if needed (for development)
export const getProxyImageUrl = (originalUrl: string): string => {
    const fileId = extractGoogleDriveFileId(originalUrl);
    if (fileId) {
        // In production, you might want to use your own proxy server
        // For now, we'll try the most reliable Google Drive thumbnail URL
        return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400-h300`;
    }
    return originalUrl;
};

// Helper function to get the most reliable direct URL
export const getBestDirectUrl = (originalUrl: string): string => {
    const fileId = extractGoogleDriveFileId(originalUrl);
    if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    return originalUrl;
};

// Helper to convert any Google Drive URL to the correct format
export const normalizeGoogleDriveUrl = (url: string): string => {
    if (!url) return '';
    
    // If it's already in the correct format, return as is
    if (url.includes('drive.google.com/uc?export=view&id=') || url.includes('drive.google.com/uc?id=')) {
        return url;
    }
    
    // Extract file ID and convert to correct format
    const fileId = extractGoogleDriveFileId(url);
    if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`;
    }
    
    return url;
};
