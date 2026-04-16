import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const ResetPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState('request'); // 'request' | 'verify'
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [passwords, setPasswords] = useState({ password: '', confirmPassword: '' });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  // ✅ Étape 1 — Demander le code par email
  const handleRequestCode = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/forgot-password`, { email });
      setMessage({ type: 'success', text: response.data.message });
      setStep('verify');
    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Email introuvable.'
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Étape 2 — Soumettre le code + nouveau mot de passe
  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (passwords.password !== passwords.confirmPassword) {
      return setMessage({ type: 'danger', text: 'Les mots de passe ne correspondent pas.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await axios.post(`${API_BASE_URL}/reset-password`, {
        email,
        code,
        password: passwords.password,
      });

      setMessage({ type: 'success', text: 'Mot de passe modifié ! Redirection...' });
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      setMessage({
        type: 'danger',
        text: error.response?.data?.message || 'Code invalide ou expiré.'
      });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Étape 1 — Saisie de l'email
  if (step === 'request') {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: '48px' }}>🔐</div>
            <h4 className="fw-bold text-uppercase">Mot de passe oublié</h4>
            <p className="text-muted small">Entrez votre email pour recevoir un code de réinitialisation.</p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} small`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleRequestCode}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Adresse email</label>
              <input
                type="email"
                className="form-control bg-light"
                placeholder="votre@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-dark w-100 py-2 fw-bold" disabled={loading}>
              {loading
                ? <span className="spinner-border spinner-border-sm me-2"></span>
                : 'Envoyer le code'}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/" className="text-decoration-none small text-muted">
              ← Retour à la connexion
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Étape 2 — Saisie du code + nouveau mot de passe
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <div style={{ fontSize: '48px' }}>📧</div>
          <h4 className="fw-bold text-uppercase">Nouveau mot de passe</h4>
          <p className="text-muted small">
            Code envoyé à <strong>{email}</strong>
          </p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} small`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleResetPassword}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Code à 6 chiffres</label>
            <input
              type="text"
              className="form-control bg-light text-center fw-bold fs-4"
              placeholder="000000"
              maxLength={6}
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
              style={{ letterSpacing: '8px' }}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Nouveau mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control bg-light border-end-0"
                placeholder="Minimum 6 caractères"
                onChange={handleChange}
                required
              />
              <button className="btn btn-light border border-start-0"
                type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="mb-4">
            <label className="form-label small fw-bold">Confirmer le mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                className="form-control bg-light border-end-0"
                placeholder="Répétez le mot de passe"
                onChange={handleChange}
                required
              />
              <button className="btn btn-light border border-start-0"
                type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2 fw-bold"
            disabled={loading || code.length !== 6}>
            {loading
              ? <span className="spinner-border spinner-border-sm me-2"></span>
              : 'Réinitialiser'}
          </button>
        </form>

        <div className="text-center mt-3">
          <button className="btn btn-link text-muted small text-decoration-none"
            onClick={() => setStep('request')}>
            ← Changer d'email
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;