import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { resendVerificationEmail } from '../services/auth';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resendSuccess, setResendSuccess] = useState(false);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleResendVerification = async () => {
    try {
      await resendVerificationEmail();
      setResendSuccess(true);
    } catch (err) {
      setError('Impossible de renvoyer l\'email. Réessayez.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResendSuccess(false);

    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email: formData.email,
        password: formData.password
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');

    } catch (error) {
      const message = error.response?.data?.message || 'Identifiants incorrects';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold">RED PRODUCT</h4>
          <p className="text-muted">Connectez-vous à votre compte</p>
        </div>

        {/* ✅ Message d'erreur + bouton renvoi email dans le return */}
        {error && (
          <div className="alert alert-danger small py-2" role="alert">
            {error}
            {error?.includes('activé') && (
              <div className="mt-2">
                <button
                  className="btn btn-sm btn-outline-danger"
                  onClick={handleResendVerification}
                >
                  Renvoyer l'email de vérification
                </button>
              </div>
            )}
          </div>
        )}

        {/* ✅ Message de succès renvoi email */}
        {resendSuccess && (
          <div className="alert alert-success small py-2" role="alert">
            Email de vérification renvoyé ! Vérifiez votre boîte mail.
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">E-mail</label>
            <input
              type="email"
              name="email"
              className="form-control bg-light"
              placeholder="votre@email.com"
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control bg-light border-end-0"
                placeholder="Votre mot de passe"
                onChange={handleChange}
                required
              />
              <button
                className="btn btn-light border border-start-0 text-muted"
                type="button"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="d-flex justify-content-between align-items-center mb-4">
            <div className="form-check">
              <input
                type="checkbox"
                name="rememberMe"
                className="form-check-input"
                id="remember"
                onChange={handleChange}
              />
              <label className="form-check-label small" htmlFor="remember">
                Garder ma session ouverte
              </label>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-dark w-100 py-2 fw-bold"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : 'Se connecter'}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small mb-1">
            <Link to="/forgot-password" className="text-warning fw-bold text-decoration-none">
              Mot de passe oublié ?
            </Link>
          </p>
          <p className="small">
            Vous n'avez pas de compte ?{' '}
            <Link to="/register" className="text-primary fw-bold text-decoration-none">
              Inscrivez-vous
            </Link>
          </p>
        </div>
            {/* SE CONNECTER SANS COMPTE */}
        <div className="text-center mt-3">
          <p className="small mb-0">
            <Link to="/dashboard" className="text-secondary fw-bold text-decoration-none">
              Accéder au mode aperçu
            </Link>
          </p>
        </div>

       </div>
    </div>
  );
};

export default Login;