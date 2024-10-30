// src/components/ScreenshotList.js
import React from 'react';
import { Card, Button } from 'react-bootstrap';
import './ScreenshotList.css';

const ScreenshotList = ({ screenshots, setScreenshots, onJumpToTime }) => {

  const handleDelete = (id) => {
    setScreenshots((prevScreenshots) =>
      prevScreenshots.filter((screenshot) => screenshot.id !== id)
    );
  };

  return (
    <div className="screenshot-list">
      {screenshots.length === 0 ? (
        <p className="no-screenshots">No Screenshots! Capture a screenshot to get started.</p>
      ) : (
        screenshots.map((screenshot) => (
          <Card key={screenshot.id} className="screenshot-card text-white bg-dark mb-3">
            <Card.Img variant="top" src={screenshot.image} alt="Screenshot" />
            <Card.Body>
              <Card.Title>Time: {screenshot.time.toFixed(2)}s</Card.Title>
              <Button
                variant="primary"
                onClick={() => onJumpToTime(screenshot.time)}
                className="mb-2"
              >
                Jump to Time
              </Button>
              <Button
                variant="danger"
                onClick={() => handleDelete(screenshot.id)}
              >
                Delete
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ScreenshotList;




// // src/components/ScreenshotList.js
// import React from 'react';
// import { deleteScreenshot, getScreenshots } from './IndexedDB';

// const ScreenshotList = ({ screenshots, setScreenshots, onJumpToTime }) => {
//   // Function to handle screenshot deletion
//   const handleDelete = async (id) => {
//     await deleteScreenshot(id); // Await deletion to complete
//     const updatedScreenshots = await getScreenshots(); // Fetch updated list from IndexedDB
//     setScreenshots(updatedScreenshots); // Update the state to refresh the list
//   };

//   return (
//     <div className="screenshot-list">
//       {screenshots.length > 0 ? (
//         screenshots.map((screenshot) => (
//           <div key={screenshot.id} className="screenshot-item">
//             <img
//               src={screenshot.image}
//               alt={`Screenshot at ${screenshot.timestamp}`}
//               onClick={() => onJumpToTime(screenshot.timestamp)}
//               className="screenshot-thumbnail"
//             />
//             <p>Timestamp: {screenshot.time.toFixed(2)}s</p>
//             <button
//               className="delete-button"
//               onClick={() => handleDelete(screenshot.id)}
//             >
//               Delete
//             </button>
//           </div>
//         ))
//       ) : (
//         <p>No screenshots available.</p>
//       )}
//     </div>
//   );
// };

// export default ScreenshotList;








