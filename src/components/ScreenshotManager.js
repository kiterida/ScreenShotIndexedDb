import React from 'react';

const ScreenshotManager = ({ screenshots, setScreenshots }) => {
  const handleDeleteScreenshot = (index) => {
    const updatedScreenshots = screenshots.filter((_, i) => i !== index);
    setScreenshots(updatedScreenshots);
    // Call saveToDB to update IndexedDB
  };

  const handlePreviewSegments = () => {
    // Implement preview logic
  };

  return (
    <div className="screenshot-manager">
      <h2>Screenshots</h2>
      <div className="screenshot-list">
        {screenshots.map((screenshot, index) => (
          <div key={index} className="screenshot-item">
            <img src={screenshot.src} alt={`Screenshot ${index}`} />
            <button onClick={() => handleDeleteScreenshot(index)}>Delete</button>
          </div>
        ))}
      </div>
      <button onClick={handlePreviewSegments}>Preview Segments</button>
    </div>
  );
};

export default ScreenshotManager;
