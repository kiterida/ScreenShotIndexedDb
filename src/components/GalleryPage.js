import React from 'react';

const GalleryPage = ({ setSelectedVideo }) => {
  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  return (
    <div className="gallery-page">
      <h2>Gallery</h2>
      {/* Render saved videos */}
      <div onClick={() => handleVideoSelect('video1.mp4')}>Video 1</div>
      <div onClick={() => handleVideoSelect('video2.mp4')}>Video 2</div>
      {/* You can replace this with a map through saved videos */}
    </div>
  );
};

export default GalleryPage;
