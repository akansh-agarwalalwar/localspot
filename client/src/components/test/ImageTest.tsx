import React from 'react';
import PropertyImage from '../common/PropertyImage';
import { extractGoogleDriveFileId, getAllPossibleUrls } from '../../utils/imageUtils';

const ImageTest: React.FC = () => {
  const testUrl = 'https://drive.google.com/uc?export=view&id=1jpsSuHz1iS0HXjZMC_h7YG_ZUGhq9dew';
  const fileId = extractGoogleDriveFileId(testUrl);
  const allUrls = getAllPossibleUrls(testUrl);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Google Drive Image Preview Test</h1>
      
      <div className="mb-6 p-4 bg-gray-100 rounded">
        <p><strong>Original URL:</strong> {testUrl}</p>
        <p><strong>Extracted File ID:</strong> {fileId}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <div className="border rounded-lg p-4">
          <h3 className="font-semibold mb-2">Property Image Component</h3>
          <div className="w-full h-48 border">
            <PropertyImage 
              src={testUrl}
              alt="Test Image"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-semibold mb-4">All URLs being tested:</h3>
        <div className="space-y-2">
          {allUrls.map((url, index) => (
            <div key={index} className="p-2 bg-gray-50 rounded">
              <span className="text-sm font-mono">{index + 1}. {url}</span>
              <button 
                onClick={() => window.open(url, '_blank')}
                className="ml-2 text-xs text-blue-600 hover:underline"
              >
                Test in new tab
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageTest;
