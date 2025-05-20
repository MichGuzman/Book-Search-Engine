// client/src/components/Navbar.tsx
import { Link } from 'react-router-dom';
import { Navbar, Nav, Container } from 'react-bootstrap';
import Auth from '../utils/auth';

interface AppNavbarProps {
  onLoginSignupClick: () => void;
}

const AppNavbar = ({ onLoginSignupClick }: AppNavbarProps) => {
  const loggedIn = Auth.loggedIn();

  const handleLogout = () => {
    Auth.logout();
  };

  return (
    <Navbar bg="dark" variant="dark" expand="lg">
      <Container>
        <Navbar.Brand as={Link} to="/">
          Book Search
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="navbar-nav" />
        <Navbar.Collapse id="navbar-nav">
          <Nav className="ms-auto">
            {loggedIn ? (
              <>
                <Nav.Link as={Link} to="/me">Profile</Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link onClick={onLoginSignupClick}>
                  Login / Signup
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default AppNavbar;
