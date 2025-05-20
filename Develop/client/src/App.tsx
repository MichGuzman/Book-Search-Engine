// client/src/App.tsx
import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Modal, Tab, Nav } from 'react-bootstrap';

import Navbar from './components/Navbar';
import SearchBooks from './pages/SearchBooks';
import SavedBooks from './pages/SavedBooks';
import Profile from './pages/Profile';
import SignupForm from './components/SignupForm';
import LoginForm from './components/LoginForm';

function App() {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      {/* Navbar con botón que abre el modal */}
      <Navbar onLoginSignupClick={() => setShowModal(true)} />

      {/* Rutas principales */}
      <Routes>
        <Route path="/" element={<SearchBooks />} />
        <Route path="/saved" element={<SavedBooks />} />
        <Route path="/me" element={<Profile />} />
      </Routes>

      {/* Modal para Login y Signup */}
      <Modal
        size="lg"
        show={showModal}
        onHide={() => setShowModal(false)}
        aria-labelledby="signup-modal"
        centered
      >
        <Tab.Container defaultActiveKey="login">
          <Modal.Header closeButton>
            <Modal.Title id="signup-modal">
              <Nav variant="pills">
                <Nav.Item>
                  <Nav.Link eventKey="login">Login</Nav.Link>
                </Nav.Item>
                <Nav.Item>
                  <Nav.Link eventKey="signup">Sign Up</Nav.Link>
                </Nav.Item>
              </Nav>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Tab.Content>
              <Tab.Pane eventKey="login">
                <LoginForm />
              </Tab.Pane>
              <Tab.Pane eventKey="signup">
                <SignupForm />
              </Tab.Pane>
            </Tab.Content>
          </Modal.Body>
        </Tab.Container>
      </Modal>
    </>
  );
}

export default App;
