import React from 'react';
import { Nav, Navbar } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import "../css/layout.css";  

const NavBar: React.FC = () => {
  const navigate = useNavigate();

  return (
    /* navigation bar */
    <Navbar expand="lg" bg="light" className="navbar-light bg-light border-bottom">
      <div className="container-fluid">
        <Navbar.Brand onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          NEST
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link
              onClick={() => navigate('/')}
              className="nav-item-custom" 
            >
              Home
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate('/pictures')}
              className="nav-item-custom" 
            >
              Pictures
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate('/notes')}
              className="nav-item-custom" 
            >
              Notes
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate('/picture/mypage')}
              className="nav-item-custom" 
            >
              MyPagePics
            </Nav.Link>
            <Nav.Link
              onClick={() => navigate('/notes/mypage')}
              className="nav-item-custom" 
            >
              MyPageNotes
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavBar;
