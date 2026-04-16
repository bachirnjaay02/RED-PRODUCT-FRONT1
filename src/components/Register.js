import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [step, setStep] = useState('register');
  const [registeredEmail, setRegisteredEmail] = useState('');
  const [code, setCode] = useState('');

  const [formData, setFormData] = useState({
    name: '', email: '', password: '', confirmPassword: '', agreeTerms: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Vérification mots de passe
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: 'danger', text: 'Les mots de passe ne correspondent pas.' });
    }

    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setRegisteredEmail(response.data.email || formData.email);
      setStep('verify');
      setMessage({ type: 'success', text: response.data.message });

    } catch (error) {
      const data = error.response?.data;
      setMessage({ type: 'danger', text: data?.message || 'Une erreur est survenue.' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // ✅ Corrigé : API_BASE_URL au lieu de BREVO_API_URL
      await axios.post(`${API_BASE_URL}/verify-code`, {
        email: registeredEmail,
        code: code
      });

      setMessage({ type: 'success', text: 'Compte activé ! Redirection...' });
      setTimeout(() => navigate('/'), 2000);

    } catch (error) {
      setMessage({ type: 'danger', text: error.response?.data?.message || 'Code invalide.' });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Étape 2 — Saisie du code
  if (step === 'verify') {
    return (
      <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
          <div className="text-center mb-4">
            <div style={{ fontSize: '48px' }}>📧</div>
            <h4 className="fw-bold">Vérifiez votre email</h4>
            <p className="text-muted small">
              Un code à 6 chiffres a été envoyé à<br/>
              <strong>{registeredEmail}</strong>
            </p>
          </div>

          {message.text && (
            <div className={`alert alert-${message.type} small`} role="alert">
              {message.text}
            </div>
          )}

          <form onSubmit={handleVerify}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Code de validation</label>
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

            <button
              type="submit"
              className="btn btn-dark w-100 py-2 fw-bold"
              disabled={loading || code.length !== 6}
            >
              {loading
                ? <span className="spinner-border spinner-border-sm me-2"></span>
                : 'Valider mon compte'}
            </button>
          </form>

          <div className="text-center mt-3">
            <button
              className="btn btn-link text-muted small text-decoration-none"
              onClick={() => setStep('register')}
            >
              ← Retour à l'inscription
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Étape 1 — Formulaire d'inscription
  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '450px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold">RED PRODUCT</h4>
          <p className="text-muted">Inscrivez-vous pour commencer</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} small`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">Nom complet</label>
            <input type="text" name="name" className="form-control bg-light"
              placeholder="Ex: Bassirou Ndiaye" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">E-mail</label>
            <input type="email" name="email" className="form-control bg-light"
              placeholder="votre@email.com" onChange={handleChange} required />
          </div>

          <div className="mb-3">
            <label className="form-label small fw-bold">Mot de passe</label>
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                className="form-control bg-light border-end-0"
                placeholder="Créer un mot de passe"
                onChange={handleChange}
                required
              />
              <button className="btn btn-light border border-start-0 text-muted"
                type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          {/* ✅ Confirmer mot de passe — corrigé */}
          <div className="mb-3">
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
              <button className="btn btn-light border border-start-0 text-muted"
                type="button" onClick={() => setShowPassword(!showPassword)}>
                <i className={`bi ${showPassword ? 'bi-eye-slash' : 'bi-eye'}`}></i>
              </button>
            </div>
          </div>

          <div className="mb-3 form-check">
            <input type="checkbox" name="agreeTerms" className="form-check-input"
              id="terms" onChange={handleChange} required />
            <label className="form-check-label small" htmlFor="terms">
              Accepter les termes et conditions
            </label>
          </div>

          <button type="submit" className="btn btn-dark w-100 py-2 fw-bold" disabled={loading}>
            {loading ? <span className="spinner-border spinner-border-sm me-2"></span> : "S'inscrire"}
          </button>
        </form>

        <div className="text-center mt-4">
          <p className="small mb-0">
            Déjà un compte ?{' '}
            <Link to="/" className="text-primary fw-bold text-decoration-none">Connectez-vous</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;