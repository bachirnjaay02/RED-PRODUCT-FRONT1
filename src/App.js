import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import Login from './components/Login';
import Register from './components/Register';
import ResetPassword from './components/resetpassword'; 
import ForgotPassword from './components/ForgotPassword';
import HotelCard from './components/hotelcard';
import AddHotelModal from './components/AddHotelModal';
import Dashboard from './components/Dashboard';
import Layout from './components/Layout';
import { clearUser, getStoredUser, logoutUser, saveUser } from './services/auth';
import ChatBot from './components/chatbot'; 

const API_BASE_URL = (process.env.REACT_APP_API_URL || 'https://red-product-db-production.up.railway.app/api').replace(/\/$/, '');

const HotelList = ({ hotels, onAddHotel, currentUser, onLogout }) => (
  <>
    <header className="bg-white p-3 border-bottom d-flex justify-content-between align-items-center sticky-top">
      <h5 className="m-0 fw-bold">Liste des hôtels</h5>
      <div className="d-flex align-items-center flex-wrap">
        <div className="input-group me-3" style={{ minWidth: '150px', maxWidth: '250px', width: '100%' }}>
          <span className="input-group-text bg-white border-end-0 text-muted">
            <i className="bi bi-search"></i>
          </span>
          <input type="text" className="form-control border-start-0 bg-white" placeholder="Recherche" />
        </div>
        <i className="bi bi-bell me-3 fs-5 position-relative d-none d-sm-inline">
          <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-warning text-dark small" style={{ fontSize: '10px' }}>
            3
          </span>
        </i>
        <div className="text-end me-3 d-none d-md-block">
          <p className="m-0 fw-semibold small">{currentUser?.name || 'Visiteur'}</p>
          <p className="m-0 text-muted small">{currentUser?.email || 'mode aperçu'}</p>
        </div>
        <button
          type="button"
          className="btn btn-link text-dark p-0"
          onClick={onLogout}
          title="Se déconnecter"
        >
          <i className="bi bi-box-arrow-right fs-5"></i>
        </button>
      </div>
    </header>

    <main className="p-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <h4 className="fw-normal mb-3 mb-md-0">
          Hôtels <span className="text-muted fw-light">{hotels.length}</span>
        </h4>
        <button
          className="btn btn-outline-dark px-4 rounded-3 d-flex align-items-center"
          onClick={onAddHotel}
        >
          <i className="bi bi-plus fs-4 me-1"></i>
          <span className="d-none d-sm-inline">Créer un nouvel hôtel</span>
          <span className="d-sm-none">Créer</span>
        </button>
      </div>

      <div className="row">
        {hotels.map((hotel) => (
          <HotelCard key={hotel.id} hotel={hotel} />
        ))}
      </div>
    </main>
  </>
);

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(getStoredUser());
  const [hotels, setHotels] = useState([]);

  const handleAuthSuccess = (user) => {
    saveUser(user);
    setCurrentUser(user);
  };

  const handleLogout = async () => {
    await logoutUser();
    clearUser();
    setCurrentUser(null);
    setShowModal(false);
    window.location.href = '/';
  };

  const fetchHotels = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/hotels`);
      setHotels(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des hôtels:', error);
      setHotels([
        { id: 1, image: 'https://cf.bstatic.com/xdata/images/hotel/max1024x768/33075123.jpg?k=75b085b477fd6ed0004a8c4470d10b6717072de93527080a1c53330f327b5984&o=', location: 'Boulevard Martin Luther King Dakar, 11500', name: 'Hôtel Terrou-Bi', price: '25.000' },
        { id: 2, image: 'king fahd palace.png', location: 'Rte des Almadies, Dakar', name: 'King Fahd Palace', price: '20.000' },
        { id: 3, image: 'radisson blue.jpg', location: 'Rte de la Corniche 0, Dakar 16868', name: 'Radisson Blu Hotel', price: '22.000' },
        { id: 4, image: 'pullman.jpg', location: 'Place de l\'Indépendance, Dakar', name: 'Pullman Dakar Teranga', price: '30.000' },
        { id: 5, image: 'lac rose.jpg', location: 'Lac Rose, Dakar', name: 'Hôtel Lac Rose', price: '25.000' },
        { id: 6, image: 'saly mbour.jpg', location: 'Mbour, Sénégal', name: 'Hôtel Saly', price: '20.000' },
        { id: 7, image: 'palm beach.jpg', location: 'BP64, Saly 23000', name: 'Palm Beach Resort & Spa', price: '22.000' },
        { id: 8, image: 'pullman hôtel.jpg', location: 'Place de l\'Indépendance, Dakar', name: 'Pullman Dakar Teranga', price: '30.000' },
      ]);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const refreshHotels = () => {
    fetchHotels();
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<Login onLoginSuccess={handleAuthSuccess} />} />
        <Route path="/register" element={<Register onRegisterSuccess={handleAuthSuccess} />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword onResetPassword={handleAuthSuccess} />} />

        <Route element={<Layout currentUser={currentUser} onLogout={handleLogout} />}>
          <Route path="/dashboard" element={<Dashboard currentUser={currentUser} />} />
          <Route
            path="/hotels"
            element={
              <HotelList
                hotels={hotels}
                onAddHotel={() => setShowModal(true)}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      <AddHotelModal isOpen={showModal} onClose={() => setShowModal(false)} onRefresh={refreshHotels} />

   {/* pour k le chatbot soit visible sur toutes les pages */}
      <ChatBot />

    </Router>
  );
};

export default App;