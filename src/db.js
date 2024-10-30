// db.js

const dbName = 'videoApp';
const storeName = 'screenshots';

// Function to open IndexedDB and create an object store
const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: 'id', autoIncrement: true });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result);
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
};

// Function to save screenshots to IndexedDB
export const saveToDB = async (screenshots) => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readwrite');
  const store = transaction.objectStore(storeName);

  // Clear existing data and add new
  store.clear();
  screenshots.forEach((screenshot) => {
    store.add(screenshot);
  });

  return new Promise((resolve) => {
    transaction.oncomplete = () => {
      resolve();
    };
  });
};

// Function to load all screenshots from IndexedDB
export const loadFromDB = async () => {
  const db = await openDB();
  const transaction = db.transaction(storeName, 'readonly');
  const store = transaction.objectStore(storeName);

  return new Promise((resolve) => {
    const request = store.getAll();

    request.onsuccess = () => {
      resolve(request.result);
    };
  });
};
