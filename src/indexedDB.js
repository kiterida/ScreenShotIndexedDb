const DB_NAME = 'VideoAppDB';
const DB_VERSION = 2;
const STORE_NAME = 'videos';

// Open the IndexedDB
const openDB = async () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Save video to IndexedDB
export const saveVideo = async (video) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.put(video);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve("Video saved successfully.");
      };
      request.onerror = (error) => {
        reject("Failed to save video: " + error.target.error);
      };
    });
  } catch (error) {
    console.error("Failed to open database: ", error);
  }
};

// Get all videos from IndexedDB
export const getVideos = async () => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);

    const videos = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        resolve(request.result);
      };
      request.onerror = (error) => {
        reject("Failed to retrieve videos: " + error.target.error);
      };
    });
    
    return videos;
  } catch (error) {
    console.error("Failed to open database: ", error);
  }
};

// Delete video from IndexedDB
export const deleteVideo = async (id) => {
  try {
    const db = await openDB();
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);

    const request = store.delete(id);
    
    return new Promise((resolve, reject) => {
      request.onsuccess = () => {
        resolve("Video deleted successfully.");
      };
      request.onerror = (error) => {
        reject("Failed to delete video: " + error.target.error);
      };
    });
  } catch (error) {
    console.error("Failed to open database: ", error);
  }
};
