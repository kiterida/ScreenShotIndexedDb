// src/components/ScreenshotGallery.js
import React from 'react';

const ScreenshotGallery = ({ screenshots }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap' }}>
      {screenshots.map((screenshot, index) => (
        <div key={index} style={{ position: 'relative', margin: '10px' }}>
          <img src={screenshot.image} alt={`Screenshot ${index}`} style={{ width: '200px' }} />
          <button 
            onClick={() => alert(`Jumping to timestamp: ${screenshot.timestamp}`)}
            style={{ position: 'absolute', top: '10px', left: '10px' }}
          >
            Jump to
          </button>
        </div>
      ))}
    </div>
  );
};

export default ScreenshotGallery;
