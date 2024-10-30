// src/Settings.js
import React from 'react';
import VideoResolution from './components/VideoResolution'; // Import your VideoResolution component if needed

const Settings = () => {
  return (
    <div className="settings">
      <h1>Settings</h1>
      <VideoResolution /> {/* Render your VideoResolution component here */}
    </div>
  );
};

export default Settings;
