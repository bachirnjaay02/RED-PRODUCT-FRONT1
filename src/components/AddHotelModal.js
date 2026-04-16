import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const AddHotelModal = ({ isOpen, onClose, onRefresh }) => {
  const [hotelData, setHotelData] = useState({
    name: '',
    address: '',
    email: '',
    phone: '',
    price: '',
    currency: 'F XOF',
    image: '', // contiendra l'URL de l'image
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setHotelData({ ...hotelData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // On envoie un objet JSON simple au lieu de FormData
      await axios.post(`${API_BASE_URL}/hotels`, hotelData);

      alert('Hôtel ajouté avec succès !');
      onRefresh(); 
      onClose();   
    } catch (error) {
      console.error("Erreur:", error.response?.data);
      alert(error.response?.data?.message || "Erreur lors de l'ajout de l'hôtel.");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop fade show" style={{ zIndex: 1040 }} onClick={onClose}></div>
      <div className="modal fade show d-block" tabIndex="-1" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-lg modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg p-3">
            <div className="modal-header border-0">
              <h5 className="modal-title fw-bold text-uppercase">Créer un nouveau hôtel</h5>
            </div>
            
            <div className="modal-body">
              <form onSubmit={handleSubmit}>
                <div className="row g-3">
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Nom de l'hôtel</label>
                    <input type="text" name="name" className="form-control bg-light" placeholder="Ex: Terrou-Bi" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Adresse</label>
                    <input type="text" name="address" className="form-control bg-light" placeholder="Ex: Dakar, Plateau" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">E-mail</label>
                    <input type="email" name="email" className="form-control bg-light" placeholder="hotel@gmail.com" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Numéro de téléphone</label>
                    <input type="text" name="phone" className="form-control bg-light" placeholder="+221..." onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Prix par nuit</label>
                    <input type="number" name="price" className="form-control bg-light" placeholder="0" onChange={handleChange} required />
                  </div>
                  <div className="col-12 col-md-6">
                    <label className="form-label text-muted small fw-bold">Devise</label>
                    <select name="currency" className="form-select bg-light" onChange={handleChange}>
                      <option value="F XOF">fr Cfa</option>
                      <option value="Euro">Euro</option>
                      <option value="Dollar">Dollar</option>
                    </select>
                  </div>
                  
                  {/* CHAMP MODIFIÉ : On demande maintenant une URL */}
                  <div className="col-12 mt-4">
                    <label className="form-label fw-bold">Lien de la photo (URL)</label>
                    <div className="p-2 bg-light border rounded">
                      <input 
                        type="text" 
                        name="image"
                        className="form-control" 
                        placeholder="Collez le lien ici (ex: https://images.unsplash.com/...)" 
                        onChange={handleChange} 
                        required 
                      />
                      <small className="text-muted">Faites un clic droit sur une image d'Internet et séléctionnez "Copier l'adresse de l'image".</small>
                    </div>
                  </div>
                </div>

                <div className="d-flex justify-content-end gap-2 mt-4">
                  <button type="button" className="btn btn-outline-secondary px-4" onClick={onClose}>Annuler</button>
                  <button type="submit" className="btn btn-dark px-4" disabled={loading}>
                    {loading ? 'Enregistrement...' : 'Enregistrer'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddHotelModal;