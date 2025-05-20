// client/src/components/SignupForm.tsx
import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useMutation } from '@apollo/client';
import { ADD_USER } from '../utils/mutations';
import AuthService from '../utils/auth';

interface FormData {
  username: string;
  email: string;
  password: string;
}

const SignupForm: React.FC = () => {
  const [userFormData, setUserFormData] = useState<FormData>({
    username: '',
    email: '',
    password: '',
  });
  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [addUser, { loading }] = useMutation(ADD_USER);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
  };

  const handleFormSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidated(true);

    if (!userFormData.username || !userFormData.email || !userFormData.password) {
      setShowAlert(true);
      return;
    }

    try {
      const { data } = await addUser({
        variables: {
          username: userFormData.username,
          email: userFormData.email,
          password: userFormData.password,
        },
      });

      const token = data?.addUser?.token;
      if (token) {
        AuthService.login(token);
      } else {
        throw new Error('No token returned from server');
      }
    } catch (err) {
      console.error('❌ Signup error:', err);
      setShowAlert(true);
    }

    setUserFormData({ username: '', email: '', password: '' });
    setValidated(false);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Alert
        dismissible
        onClose={() => setShowAlert(false)}
        show={showAlert}
        variant="danger"
      >
        Something went wrong with your signup!
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label>Username</Form.Label>
        <Form.Control
          type="text"
          placeholder="Your username"
          name="username"
          onChange={handleInputChange}
          value={userFormData.username}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a username.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label>Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email"
          name="email"
          onChange={handleInputChange}
          value={userFormData.email}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a valid email.
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-4">
        <Form.Label>Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          onChange={handleInputChange}
          value={userFormData.password}
          required
        />
        <Form.Control.Feedback type="invalid">
          Please enter a password.
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        type="submit"
        variant="success"
        disabled={
          loading ||
          !userFormData.username ||
          !userFormData.email ||
          !userFormData.password
        }
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
      </Button>
    </Form>
  );
};

export default SignupForm;
