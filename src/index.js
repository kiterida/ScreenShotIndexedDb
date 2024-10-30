import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';
// src/index.js
import 'bootstrap/dist/js/bootstrap.bundle.min.js'; // Add this line
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'; // Ensure this is included



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
