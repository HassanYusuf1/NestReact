import React, { useState } from 'react';
import { Nav, Navbar, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); 

  const handleLoginLogout = () => {
    if (isLoggedIn) {
      setIsLoggedIn(false);
      navigate('/');
    } else {
      navigate('/login');
    }
  };

  return (
    <Navbar expand="lg" bg="light" className="border-bottom">
      <div className="container-fluid">
        <Navbar.Brand href="/">NEST</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto mb-2 mb-lg-0">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/pictures">Pictures</Nav.Link>
            <Nav.Link href="/notes">Notes</Nav.Link>
            <Nav.Link href="/picture/mypage">MyPagePics</Nav.Link>
            <Nav.Link href="/mypage/notes">MyPageNotes</Nav.Link>
          </Nav>

          {isLoggedIn && (
            <Button variant="danger" onClick={handleLoginLogout}>
              Logout
            </Button>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavMenu;
