import React from 'react';

const PDFViewer = ({ driveLink }) => {
  // Extract the file ID from the Google Drive link
  const extractFileId = (url) => {
    // Handle different formats of Google Drive links
    if (!url) return null;
    
    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    const fileIdMatch = url.match(/\/file\/d\/([^/]+)/);
    if (fileIdMatch) return fileIdMatch[1];
    
    // Format: https://drive.google.com/open?id=FILE_ID
    const idMatch = url.match(/[?&]id=([^&]+)/);
    if (idMatch) return idMatch[1];
    
    // Format: https://docs.google.com/document/d/FILE_ID/edit
    const docsMatch = url.match(/\/document\/d\/([^/]+)/);
    if (docsMatch) return docsMatch[1];
    
    return null;
  };

  const fileId = extractFileId(driveLink);
  
  if (!fileId) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
        <strong className="font-bold">Error:</strong>
        <span className="block sm:inline"> Invalid Google Drive link. Please provide a valid link.</span>
      </div>
    );
  }

  const embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  return (
    <div className="w-full h-full">
      <iframe
        src={embedUrl}
        className="w-full rounded-lg shadow-lg"
        style={{ height: '600px' }}
        frameBorder="0"
        allowFullScreen
        title="PDF Viewer"
      />
    </div>
  );
};

export default PDFViewer; 