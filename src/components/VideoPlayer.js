// src/components/VideoPlayer.js
import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import ScreenshotList from './ScreenshotList';
import {
  saveScreenshot,
  getScreenshots,
  getScreenshotsByFilename,
  backupIndexedDB,
  restoreFromBackup
} from './IndexedDB';
import VideoResolution from './VideoResolution';
import './VideoPlayer.css';

const VideoPlayer = () => {
  const playerRef = useRef(null);
  const [screenshots, setScreenshots] = useState([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [filename, setFilename] = useState('');
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const loadScreenshots = async () => {
      const savedScreenshots = await getScreenshots();
      setScreenshots(Array.isArray(savedScreenshots) ? savedScreenshots : []);
    };
    loadScreenshots();
  }, [refreshKey]);

  const handleRestore = (event) => {
    const file = event.target.files[0];
    if (file) {
      restoreFromBackup(file, setRefreshKey);
      setRefreshKey((prev) => prev + 1); // Trigger a re-render
    }
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    const fileUrl = URL.createObjectURL(file);
    setVideoUrl(fileUrl);
    const selectedFilename = file.name;
    setFilename(selectedFilename);

    const associatedScreenshots = await getScreenshotsByFilename(selectedFilename);
    setScreenshots(associatedScreenshots);
  };

  const captureScreenshot = async () => {
    if (!playerRef.current || !filename) return;

    const videoElement = playerRef.current.getInternalPlayer();
    const time = playerRef.current.getCurrentTime();
    const canvas = document.createElement('canvas');
    const resolution = localStorage.getItem("screenshotResolution") || "Full Screen";

    if (resolution === "Full Screen") {
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;
    } else if (resolution === "Medium") {
      canvas.width = videoElement.videoWidth / 2;
      canvas.height = videoElement.videoHeight / 2;
    } else {
      canvas.width = videoElement.videoWidth / 4;
      canvas.height = videoElement.videoHeight / 4;
    }

    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoElement, 0, 0, canvas.width, canvas.height);

    const imageDataUrl = canvas.toDataURL('image/png');
    const screenshot = { time, image: imageDataUrl, id: Date.now() };
    await saveScreenshot(screenshot, filename);
    setScreenshots((prevScreenshots) => [...prevScreenshots, screenshot]);
  };

  return (
    <div className="video-player dark-theme">
      <input
        type="file"
        accept="video/*"
        onChange={handleFileSelect}
        className="file-input dark-input"
      />
      <ReactPlayer
        ref={playerRef}
        url={videoUrl}
        controls
        width="100%"
        height="100%"
        className="react-player"
      />
      <button onClick={captureScreenshot} className="screenshot-button dark-button">
        Screenshot
      </button>
      <ScreenshotList
        screenshots={screenshots}
        setScreenshots={setScreenshots}
        onJumpToTime={(time) => playerRef.current.seekTo(time)}
      />
      <VideoResolution onDatabaseReset={setRefreshKey} />
      <button onClick={backupIndexedDB} className="backup-button dark-button">
        Backup Data
      </button>
      <input
        type="file"
        accept=".json"
        onChange={handleRestore}
        className="file-input dark-input"
        style={{ marginTop: "10px" }}
      />
    </div>
  );
};

export default VideoPlayer;
