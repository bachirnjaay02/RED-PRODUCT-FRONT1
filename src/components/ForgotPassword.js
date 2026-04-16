import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`${API_BASE_URL}/forgotpassword`, { email });
      setMessage({ type: 'success', text: response.data.message });
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        text: error.response?.data?.message || 'Une erreur est survenue.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-fluid vh-100 d-flex align-items-center justify-content-center bg-light">
      <div className="card shadow-sm border-0 p-4" style={{ maxWidth: '400px', width: '100%', borderRadius: '15px' }}>
        <div className="text-center mb-4">
          <h4 className="fw-bold">MOT DE PASSE OUBLIÉ</h4>
          <p className="text-muted small">Entrez votre e-mail pour recevoir un lien de réinitialisation.</p>
        </div>

        {message.text && (
          <div className={`alert alert-${message.type} small`} role="alert">
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label small fw-bold">E-mail</label>
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
            {loading ? <span className="spinner-border spinner-border-sm"></span> : 'Envoyer le lien'}
          </button>
        </form>

        <div className="text-center mt-4">
          <Link to="/" className="text-primary fw-bold text-decoration-none small">Retour à la page de connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;