import React, { useState } from 'react';
import { Nav, Navbar, NavDropdown, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavMenu: React.FC = () => {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false); // For å simulere innloggingsstatus

  // Funksjon for å håndtere innlogging/utlogging
  const handleLoginLogout = () => {
    if (isLoggedIn) {
      // Log ut
      setIsLoggedIn(false);
      navigate('/');
    } else {
      // Naviger til login-side
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
            <Nav.Link href="/pictures">Pictures</Nav.Link>
            <Nav.Link href="/notes">Notes</Nav.Link>
            <Nav.Link href="/mypage/pictures">MyPagePics</Nav.Link>
            <Nav.Link href="/mypage/notes">MyPageNotes</Nav.Link>
          </Nav>

          {isLoggedIn ? (
            <Button variant="danger" onClick={handleLoginLogout}>
              Logout
            </Button>
          ) : (
            <>
              <Nav.Link href="/login" className="text-dark">Log in</Nav.Link>
              <Nav.Link href="/register" className="text-dark">Create User</Nav.Link>
            </>
          )}
        </Navbar.Collapse>
      </div>
    </Navbar>
  );
};

export default NavMenu;
