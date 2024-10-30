// src/components/Menu.js
import React from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing

const Menu = () => {
  return (
<Offcanvas show={show} onHide={handleClose} backdrop={!isLocked} variant="dark">
  <Offcanvas.Header closeButton>
    <Offcanvas.Title>Menu</Offcanvas.Title>
  </Offcanvas.Header>
  <Offcanvas.Body>
    {/* Add links or buttons with dark styling */}
    <Nav.Link href="/" className="text-light">Home</Nav.Link>
    <Nav.Link href="/projects" className="text-light">Projects</Nav.Link>
    <Nav.Link href="/settings" className="text-light">Settings</Nav.Link>
  </Offcanvas.Body>
</Offcanvas>
  );
};

export default Menu;




// // src/components/Menu.js
// import React from 'react';
// import SubMenu from './SubMenu';
// import '../App.css';

// const Menu = ({ isOpen, toggleMenu }) => (
//   <div className={`menu ${isOpen ? 'open' : 'closed'}`}>
//     <button onClick={toggleMenu} className="menu-close-btn">
//       ✕
//     </button>
//     <SubMenu title="Home" />
//     <SubMenu title="Projects" />
//     <SubMenu title="Settings" />
//   </div>
// );

// export default Menu;
