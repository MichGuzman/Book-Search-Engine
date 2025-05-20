// client/src/components/LoginForm.tsx
import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';

import { useMutation } from '@apollo/client';
import { LOGIN_USER } from '../utils/mutations';
import AuthService from '../utils/auth';

interface FormData {
  email: string;
  password: string;
}

const LoginForm = () => {
  const [userFormData, setUserFormData] = useState<FormData>({
    email: '',
    password: '',
  });

  const [validated, setValidated] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [login, { loading, error }] = useMutation(LOGIN_USER);

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setUserFormData({ ...userFormData, [name]: value });
    setShowAlert(false); // Oculta alerta al empezar a escribir
  };

  const handleFormSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setValidated(true);

    if (!userFormData.email || !userFormData.password) {
      setShowAlert(true);
      return;
    }

    try {
      const { data } = await login({
        variables: { ...userFormData },
      });

      const token = data?.login?.token;
      if (token) {
        AuthService.login(token);
      } else {
        throw new Error('No token returned from server');
      }
    } catch (err) {
      console.error('❌ Login error:', err);
      setShowAlert(true);
    }

    setUserFormData({ email: '', password: '' });
    setValidated(false);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
      <Alert
        dismissible
        onClose={() => setShowAlert(false)}
        show={showAlert || Boolean(error)}
        variant="danger"
      >
        Something went wrong with your login credentials!
      </Alert>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          type="email"
          placeholder="Your email"
          name="email"
          value={userFormData.email}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Email is required!
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          placeholder="Your password"
          name="password"
          value={userFormData.password}
          onChange={handleInputChange}
          required
        />
        <Form.Control.Feedback type="invalid">
          Password is required!
        </Form.Control.Feedback>
      </Form.Group>

      <Button
        disabled={loading || !(userFormData.email && userFormData.password)}
        type="submit"
        variant="success"
      >
        {loading ? <Spinner animation="border" size="sm" /> : 'Submit'}
      </Button>
    </Form>
  );
};

export default LoginForm;
