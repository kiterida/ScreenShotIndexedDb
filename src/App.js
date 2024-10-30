// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Change here
import Layout from './components/Layout';
import Home from './Home'; // Your Home component
import Projects from './Projects'; // Your Projects component
import Settings from './Settings'; // Your Settings component


const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/settings" element={<Settings />} /> {/* Ensure this is correct */}
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;



// // src/App.js
// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Layout from './components/Layout';
// import Home from './Home';
// import VideoResolution from './components/VideoResolution'; // Import VideoResolution component
// import 'bootstrap/dist/css/bootstrap.min.css';

// const App = () => {
//   return (
//     <Router>
//       <Layout>
//         <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/settings" element={<SettingsPage />} />
//         </Routes>
//       </Layout>
//     </Router>
//   );
// };
// const SettingsPage = () => {
//   const handleDatabaseReset = async () => {
//     // Functionality to handle resetting the database if needed
//   };

//   return (
//     <div>
//       <h1>Settings</h1>
//       <VideoResolution onDatabaseReset={handleDatabaseReset} /> {/* Pass props if needed */}
//     </div>
//   );
// };

// export default App;














// // src/App.js
// import React from 'react';
// import Layout from './components/Layout';
// import Home from './Home';
// import './App.css';

// const App = () => (
//   <Layout>
//     <Home />
//   </Layout>
// );

// export default App;
