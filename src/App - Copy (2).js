import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './App.css'; // Import your CSS file for styling

const VideoScreenshotApp = () => {
  const playerRef = useRef(null);
  const [videos, setVideos] = useState([]); // Store video objects
  const [videoUrl, setVideoUrl] = useState('');
  const [fileName, setFileName] = useState('');
  const [currentScreenshots, setCurrentScreenshots] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(null); // Manage which screenshot is hovered

  const handleVideoSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const videoObj = { name: file.name, url, screenshots: [] };
      setVideoUrl(url);
      setFileName(file.name);
      setCurrentScreenshots([]); // Clear current screenshots
      setVideos((prev) => [...prev, videoObj]);
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
      const newScreenshot = { time: videoElement.currentTime, imageUrl };
      
      // Add to current video screenshots
      setCurrentScreenshots((prev) => {
        const updatedScreenshots = [...prev, newScreenshot];
        const videoIndex = videos.findIndex((v) => v.name === fileName);
        if (videoIndex !== -1) {
          const updatedVideos = [...videos];
          updatedVideos[videoIndex].screenshots = updatedScreenshots;
          setVideos(updatedVideos);
        }
        return updatedScreenshots;
      });
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
    const updatedScreenshots = currentScreenshots.filter((_, i) => i !== index);
    const videoIndex = videos.findIndex((v) => v.name === fileName);
    if (videoIndex !== -1) {
      const updatedVideos = [...videos];
      updatedVideos[videoIndex].screenshots = updatedScreenshots;
      setVideos(updatedVideos);
    }
    setCurrentScreenshots(updatedScreenshots);
  };

  

  const saveVideosToLocal = () => {
    try {
      const existingVideos = JSON.parse(localStorage.getItem('videos')) || [];
      const newVideos = [...existingVideos, ...videos];
  
      // Check the total size of videos before saving
      const newVideosString = JSON.stringify(newVideos);
      
      // Limit the size of the stored videos
      const maxSize = 5 * 1024 * 1024; // 5MB
      if (newVideosString.length > maxSize) {
        console.warn("Storage limit reached. Consider removing some videos.");
        // You could implement a mechanism to remove old videos here if necessary
        return;
      }
  
      localStorage.setItem('videos', newVideosString);
    } catch (error) {
      console.error("Failed to save videos to local storage:", error);
      alert("Could not save videos. Local storage might be full. Please clear some data.");
    }
  };
  

  const loadVideosFromLocal = () => {
    const savedVideos = localStorage.getItem('videos');
    if (savedVideos) {
      setVideos(JSON.parse(savedVideos));
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
    for (const screenshot of currentScreenshots) {
      jumpToTime(screenshot.time);
      playerRef.current.getInternalPlayer().play();
      await new Promise(resolve => setTimeout(resolve, 2000)); // Play for 2 seconds
      playerRef.current.getInternalPlayer().pause();
    }
    playerRef.current.seekTo(0); // Reset to the beginning after previewing
  };

  const loadVideo = (video) => {
    setVideoUrl(video.url);
    setFileName(video.name);
    setCurrentScreenshots(video.screenshots);
  };

  useEffect(() => {
    loadVideosFromLocal();
  }, []);

  useEffect(() => {
    saveVideosToLocal();
  }, [videos]);

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
        <h3>Videos and Screenshots</h3>
        {videos.map((video, index) => (
          <div key={index} onClick={() => loadVideo(video)} style={{ cursor: 'pointer' }}>
            <h4>{video.name}</h4>
            <ul>
              {video.screenshots.map((screenshot, sIndex) => (
                <li key={sIndex}
                    onMouseEnter={() => setHoveredIndex(sIndex)}
                    onMouseLeave={() => setHoveredIndex(null)}
                >
                  <img
                    src={screenshot.imageUrl}
                    alt={`Screenshot at ${screenshot.time}s`}
                    onClick={() => jumpToTime(screenshot.time)}
                  />
                  {hoveredIndex === sIndex && (
                    <div>
                      <button onClick={() => downloadImage(screenshot.imageUrl)}>Download</button>
                      <button onClick={() => removeScreenshot(sIndex)}>Remove</button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <button onClick={saveVideosToLocal}>Save Videos</button>
    </div>
  );
};

export default VideoScreenshotApp;
