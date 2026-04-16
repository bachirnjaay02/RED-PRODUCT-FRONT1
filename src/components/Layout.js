import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './sidebar';

const Layout = ({ currentUser, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

  return (
    <div className="d-flex bg-light min-vh-100">
      <Sidebar currentUser={currentUser} onLogout={onLogout} isOpen={sidebarOpen} onToggle={toggleSidebar} />
      <div className="flex-grow-1" style={{ marginLeft: sidebarOpen ? '280px' : '0' }}>
        {/* Header with hamburger button */}
        <div className="bg-white border-bottom p-2 d-flex align-items-center">
          <button className="btn btn-link text-dark me-3" onClick={toggleSidebar}>
            <i className="bi bi-list fs-4"></i>
          </button>
          <h5 className="m-0 fw-bold">RED PRODUCT</h5>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;