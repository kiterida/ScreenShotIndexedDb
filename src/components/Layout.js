import React, { useState, useRef } from 'react';
import { Offcanvas, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import './Layout.css';

const Layout = ({ children }) => {
  const [show, setShow] = useState(false);
  const [locked, setLocked] = useState(false);
  const [menuWidth, setMenuWidth] = useState(180); // Default width
  const startXRef = useRef(0);
  const startWidthRef = useRef(180);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const toggleLock = () => {
    setLocked(!locked);
    if (!locked) setShow(false);
  };

  const handleDragStart = (e) => {
    startXRef.current = e.clientX;
    startWidthRef.current = menuWidth;
    document.addEventListener('mousemove', handleDragging);
    document.addEventListener('mouseup', handleDragEnd);
  };

  const handleDragging = (e) => {
    const newWidth = Math.max(200, startWidthRef.current + e.clientX - startXRef.current);
    setMenuWidth(newWidth);
  };

  const handleDragEnd = () => {
    document.removeEventListener('mousemove', handleDragging);
    document.removeEventListener('mouseup', handleDragEnd);
  };

  return (
    <div className={`app-layout ${locked ? 'locked' : ''}`}>
      {!locked && (
        <Button
          variant="primary"
          onClick={handleShow}
          style={{ position: 'fixed', top: '10px', left: '10px', zIndex: '1000' }}
        >
          ☰ Menu
        </Button>
      )}

      <Offcanvas
        show={show || locked}
        onHide={!locked ? handleClose : undefined}
        placement="start"
        backdrop={!locked}
        className="offcanvas-locked"
        style={{
          '--bs-offcanvas-width': `${menuWidth}px`, // Set default width here
          width: locked ? `${menuWidth}px` : undefined,
        }}
      >
        <Offcanvas.Header closeButton={!locked}>
          <Offcanvas.Title>Menu</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          <ul className="nav flex-column">
            <li className="nav-item">
              <Link to="/" className="nav-link" onClick={!locked ? handleClose : undefined}>Home</Link>
            </li>
            <li className="nav-item">
              <Link to="/projects" className="nav-link" onClick={!locked ? handleClose : undefined}>Projects</Link>
            </li>
            <li className="nav-item">
              <Link to="/settings" className="nav-link" onClick={!locked ? handleClose : undefined}>Settings</Link>
            </li>
          </ul>
          <Button variant="outline-secondary" onClick={toggleLock} className="lock-button">
            {locked ? 'Unlock Menu' : 'Lock Menu'}
          </Button>
          {locked && <div className="resizer" onMouseDown={handleDragStart}></div>}
        </Offcanvas.Body>
      </Offcanvas>

      <div className="content" style={{ marginLeft: locked ? menuWidth : 0 }}>
        {children}
      </div>
    </div>
  );
};

export default Layout;
