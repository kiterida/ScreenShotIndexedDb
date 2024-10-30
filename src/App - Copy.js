import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css'; // Import your CSS file for styling

const VideoScreenshotApp = () => {
  const playerRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setVideoUrl(url);
      setFileName(file.name);
    }
  };

  const takeScreenshot = () => {
    const videoElement = playerRef.current.getInternalPlayer();
    if (videoElement) {
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
      const context = canvas.getContext('2d');
      context.drawImage(videoElement, 0, 0);

      const imageUrl = canvas.toDataURL('image/png');
      setScreenshots([...screenshots, { time: videoElement.currentTime, imageUrl }]);
    }
  };

  const jumpToTime = (time) => {
    playerRef.current.seekTo(time);
  };

  const downloadImage = (imageUrl) => {
    const a = document.createElement('a');
    a.href = imageUrl;
    a.download = 'screenshot.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const removeScreenshot = (index) => {
    const updatedScreenshots = screenshots.filter((_, i) => i !== index);
    setScreenshots(updatedScreenshots);
  };

  const saveScreenshotsToLocal = () => {
    localStorage.setItem('screenshots', JSON.stringify(screenshots));
  };

  const loadScreenshotsFromLocal = () => {
    const savedScreenshots = localStorage.getItem('screenshots');
    if (savedScreenshots) {
      setScreenshots(JSON.parse(savedScreenshots));
    }
  };

  const moveFrame = (direction) => {
    const videoElement = playerRef.current.getInternalPlayer();
    if (videoElement) {
      const currentTime = videoElement.currentTime;
      const newTime = direction === 'forward' ? currentTime + (1 / 30) : currentTime - (1 / 30);
      playerRef.current.seekTo(Math.max(0, newTime));
    }
  };

  const previewSegments = async () => {
    for (const screenshot of screenshots) {
      jumpToTime(screenshot.time);
      playerRef.current.getInternalPlayer().play();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Play for 2 seconds
      playerRef.current.getInternalPlayer().pause();
    }
    playerRef.current.seekTo(0); // Reset to the beginning after previewing
  };

  useEffect(() => {
    loadScreenshotsFromLocal();
  }, []);

  return (
    <div className="app">
      <input type="file" accept="video/*" onChange={handleVideoSelect} />
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
      />
      <div>
        <h3>Controls</h3>
        <button onClick={() => moveFrame('backward')}>Frame Backward</button>
        <button onClick={() => moveFrame('forward')}>Frame Forward</button>
        <button onClick={takeScreenshot}>Take Screenshot</button>
        <button onClick={previewSegments}>Preview Segments</button>
      </div>
      <div>
        <h3>Screenshots</h3>
        <ul>
          {screenshots.map((screenshot, index) => (
            <li key={index}>
              <img
                src={screenshot.imageUrl}
                alt={`Screenshot at ${screenshot.time}s`}
                onClick={() => jumpToTime(screenshot.time)}
              />
              <button onClick={() => downloadImage(screenshot.imageUrl)}>Download</button>
              <button onClick={() => removeScreenshot(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <button onClick={saveScreenshotsToLocal}>Save Screenshots</button>
    </div>
  );
};

export default VideoScreenshotApp;
