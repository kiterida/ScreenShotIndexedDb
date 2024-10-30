// src/components/IndexedDB.js

const DB_NAME = "VideoAppDB";
const DB_VERSION = 3; // Ensure the version number is incremented for schema changes

// Initialize IndexedDB and create object store if it doesn't exist
const initializeDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    
    request.onupgradeneeded = (e) => {
      const db = e.target.result;
      if (!db.objectStoreNames.contains("screenshots")) {
        const screenshotStore = db.createObjectStore("screenshots", {
          keyPath: "id",
          autoIncrement: true,
        });
        screenshotStore.createIndex("filename", "filename", { unique: false });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = (e) => reject(e.target.error);
  });
};

// Save a screenshot to IndexedDB
export const saveScreenshot = async (screenshot, filename) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction("screenshots", "readwrite");
    const store = transaction.objectStore("screenshots");

    const screenshotWithFilename = {
      ...screenshot,
      filename, // Add filename to the screenshot object
    };

    await new Promise((resolve, reject) => {
      const request = store.add(screenshotWithFilename);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e.target.error);
    });

    console.log("Screenshot saved successfully.");
  } catch (error) {
    console.error("Failed to save screenshot:", error);
  }
};

// Retrieve screenshots by filename
export const getScreenshotsByFilename = async (filename) => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction("screenshots", "readonly");
    const store = transaction.objectStore("screenshots");
    const index = store.index("filename");

    return new Promise((resolve, reject) => {
      const request = index.getAll(filename);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e.target.error);
    });
  } catch (error) {
    console.error("Failed to fetch screenshots by filename:", error);
  }
};

// Backup IndexedDB data to a JSON file
export const backupIndexedDB = async () => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction("screenshots", "readonly");
    const store = transaction.objectStore("screenshots");

    const allData = await new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject("Error fetching data from IndexedDB.");
    });

    if (allData.length === 0) {
      console.warn("No data found in IndexedDB to backup.");
      return;
    }

    const jsonData = JSON.stringify(allData);
    const blob = new Blob([jsonData], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "indexeddb_backup.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the URL object
  } catch (error) {
    console.error("Failed to backup IndexedDB data:", error);
  }
};

// Clears all data in the screenshots object store
export const clearScreenshotsStore = async (transaction) => {
  const store = transaction.objectStore("screenshots");
  return new Promise((resolve, reject) => {
    const clearRequest = store.clear();
    
    clearRequest.onsuccess = () => {
      console.log("Cleared existing data from screenshots store.");
      resolve();
    };

    clearRequest.onerror = (error) => {
      console.error("Error clearing screenshots store:", error);
      reject(error);
    };
  });
};


export const restoreFromBackup = async (file, onDBUpdated) => {
  try {
    

    // Use FileReader to handle text conversion
    const text = await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.onerror = () => reject("Failed to read file.");
      reader.readAsText(file);
    });

    // Proceed with JSON parsing and database operations
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON:", parseError);
      return;
    }

    if (!Array.isArray(data)) {
      console.error("Invalid backup format. Expected an array of objects.");
      return;
    }

    const db = await initializeDB();
    const transaction = db.transaction("screenshots", "readwrite");

    // Clear existing data before restoring
    await clearScreenshotsStore(transaction);

    // Add each screenshot back to IndexedDB
    const store = transaction.objectStore("screenshots");
    const addRequests = data.map(item => store.add(item));

    await Promise.all(addRequests);
    console.log("Restore complete. Data has been reloaded into IndexedDB.");
      //    onDBUpdated();
      if (onDBUpdated) onDBUpdated(); // Call to refresh the data

  } catch (error) {
    console.error("Failed to restore data from backup:", error);
  }
};








// Clears all data in the screenshots object store
export const resetDatabase = async (onDBUpdated) => {
  try {
    const db = await initializeDB(); // Ensure the database is open before clearing
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("screenshots", "readwrite");
      const objectStore = transaction.objectStore("screenshots");
      const clearRequest = objectStore.clear();

      clearRequest.onsuccess = () => {
        console.log("IndexedDB data cleared.");
    //    onDBUpdated();
    if (onDBUpdated) onDBUpdated(); // Call to refresh the data
       
        resolve();
      
      };

      clearRequest.onerror = (error) => {
        console.error("Error clearing IndexedDB:", error);
        reject(error);
      };
    });
  } catch (error) {
    console.error("Failed to reset database:", error);
  }
};

// Delete a screenshot by ID
export const deleteScreenshot = async (id) => {
  try {
    const db = await initializeDB(); // Ensure the database is open before attempting to delete
    await new Promise((resolve, reject) => {
      const transaction = db.transaction("screenshots", "readwrite");
      const objectStore = transaction.objectStore("screenshots");
      const deleteRequest = objectStore.delete(id);

      deleteRequest.onsuccess = () => {
        console.log(`Screenshot with ID ${id} deleted.`);
        resolve();
      };

      deleteRequest.onerror = (error) => {
        console.error("Error deleting screenshot:", error);
        reject(error);
      };
    });
  } catch (error) {
    console.error("Failed to delete screenshot:", error);
  }
};

// Fetch all screenshots from IndexedDB
export const getScreenshots = async () => {
  try {
    const db = await initializeDB();
    const transaction = db.transaction("screenshots", "readonly");
    const store = transaction.objectStore("screenshots");
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      request.onsuccess = () => {
        console.log("Fetched screenshots from IndexedDB:", request.result); // Debugging line
        resolve(request.result);
      };
      request.onerror = (e) => {
        console.error("Failed to fetch screenshots:", e);
        reject(e.target.error);
      };
    });
  } catch (error) {
    console.error("Failed to get screenshots:", error);
  }
};
