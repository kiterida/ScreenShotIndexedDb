// src/components/DataDisplay.js
import React, { useEffect, useState } from 'react';
import { loadFromDB } from '../db';

const DataDisplay = () => {
  // Ensure `data` starts as an empty array
  const [data, setData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const loadedData = await loadFromDB();
      setData(loadedData || []); // Fallback to empty array if loadedData is undefined
    };

    fetchData();
  }, []);

  return (
    <div className="data-display">
      <h2>Saved Data from IndexedDB</h2>
      {data.length > 0 ? (
        <ul>
          {data.map((screenshot, index) => (
            <li key={index}>
              <img src={screenshot.src} alt={`Screenshot at ${screenshot.time}s`} width="100" />
              <span>Time: {screenshot.time}s</span>
            </li>
          ))}
        </ul>
      ) : (
        <p>No data found in IndexedDB.</p>
      )}
    </div>
  );
};

export default DataDisplay;
