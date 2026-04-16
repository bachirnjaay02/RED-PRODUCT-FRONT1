import { render, screen } from '@testing-library/react';
import App from './App';

describe('App routing', () => {
  test('renders the login page on the root route', () => {
    window.history.pushState({}, '', '/');
    render(<App />);

    expect(screen.getByText(/connectez-vous en tant que admin/i)).toBeInTheDocument();
  });

  test('renders the signup page on the register route', () => {
    window.history.pushState({}, '', '/register');
    render(<App />);

    expect(screen.getByText(/inscrivez-vous en tant qu'admin/i)).toBeInTheDocument();
  });

  test('renders the forgot-password page on the dedicated route', () => {
    window.history.pushState({}, '', '/forgot-password');
    render(<App />);

    expect(screen.getByText(/réinitialiser votre mot de passe/i)).toBeInTheDocument();
  });

  test('renders hotel cards on the hotels route', () => {
    window.history.pushState({}, '', '/hotels');
    render(<App />);

    expect(screen.getByText(/hôtel terrou-bi/i)).toBeInTheDocument();
    expect(screen.getByText(/king fahd palace/i)).toBeInTheDocument();
  });v 
});
