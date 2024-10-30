// src/components/VideoResolution.js
import { useState, useEffect } from 'react';
import { resetDatabase } from './IndexedDB';

const VideoResolution = ({ onDatabaseReset}) => {

  const [resolution, setResolution] = useState("Full Screen");

  // Load saved resolution from localStorage on component mount
  useEffect(() => {
    const savedResolution = localStorage.getItem("screenshotResolution");
    if (savedResolution) {
      setResolution(savedResolution);
    }
  }, []);

  // Save resolution to localStorage when it changes
  const handleResolutionChange = (e) => {
    const newResolution = e.target.value;
    setResolution(newResolution);
    localStorage.setItem("screenshotResolution", newResolution);
  };

  const handleResetDatabase = async () => {
    await resetDatabase(onDatabaseReset); // Await the reset before triggering UI update
    onDatabaseReset(); // Call to update the app UI
  };


  return (
    <div>
      <h4>Screenshot Resolution</h4>
      <label>
        Resolution:
        <select value={resolution} onChange={handleResolutionChange}>
          <option value="Full Screen">Full Screen</option>
          <option value="Medium">Medium</option>
          <option value="Small">Small</option>
        </select>
      </label>
      <button onClick={handleResetDatabase}>Reset Database</button>
    </div>
  );
};

export default VideoResolution;
