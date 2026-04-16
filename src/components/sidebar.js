import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = ({ currentUser, onLogout, isOpen, onToggle }) => {
  const getLinkClass = ({ isActive }) =>
    `nav-link py-3 px-2 d-flex align-items-center ${
      isActive ? 'bg-light text-dark rounded-2 fw-bold' : 'text-white opacity-75'
    }`;

  const displayName = currentUser?.name || 'Mode aperçu';
  const displayEmail = currentUser?.email || 'Aucun compte connecté';

  return (
    <>
      {/* Overlay for mobile and desktop when sidebar is open */}
      {isOpen && <div className="position-fixed top-0 start-0 w-100 h-100 bg-dark bg-opacity-50 z-index-1040 d-lg-none" onClick={onToggle}></div>}

      <div className={`bg-dark text-white vh-100 p-3 shadow ${isOpen ? 'd-block sidebar-responsive' : 'd-none'}`} style={{ width: '280px', position: 'fixed', zIndex: 1050 }}>
        <div className="mb-5 mt-2 px-2 d-flex justify-content-between align-items-center">
          <h4 className="fw-bold m-0">RED PRODUCT</h4>
          <button className="btn btn-link text-white" onClick={onToggle}>
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        <p className="text-secondary small px-2 mb-3">Principal</p>

        <nav className="nav flex-column mb-auto">
          <NavLink to="/dashboard" className={getLinkClass} onClick={() => window.innerWidth < 992 && onToggle()}>
            <i className="bi bi-grid-fill me-3"></i> Dashboard
          </NavLink>
          <NavLink to="/hotels" className={getLinkClass} onClick={() => window.innerWidth < 992 && onToggle()}>
            <i className="bi bi-building me-3"></i> Liste des hôtels
          </NavLink>
        </nav>

        <div className="mt-auto border-top border-secondary pt-4 px-2" style={{ position: 'absolute', bottom: '20px', width: '240px' }}>
          <div className="d-flex align-items-center mb-3">
            <div className="bg-secondary rounded-circle me-3 d-flex align-items-center justify-content-center" style={{ width: '45px', height: '45px' }}>
              <i className="bi bi-person-fill"></i>
            </div>
            <div>
              <p className="m-0 fw-bold small">{displayName}</p>
              <p className="m-0 text-success small" style={{ fontSize: '12px' }}>{currentUser ? '● connecté' : '● aperçu'}</p>
            </div>
          </div>

          <p className="text-secondary small mb-3 text-break">{displayEmail}</p>

          <button type="button" className="btn btn-outline-light btn-sm w-100" onClick={onLogout}>
            Se déconnecter
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;