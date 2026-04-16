import React from 'react';

const StatCard = ({ icon, color, count, label, subtext }) => (
  <div className="col-12 col-md-6 col-lg-4 mb-4">
    <div className="card border-0 shadow-sm p-3 rounded-4 d-flex flex-row align-items-center">
      <div className={`rounded-circle d-flex align-items-center justify-content-center text-white me-3`}
           style={{ width: '50px', height: '50px', backgroundColor: color }}>
        <i className={`bi bi-${icon} fs-4`}></i>
      </div>
      <div>
        <h4 className="m-0 fw-bold">{count} <span className="fs-6 fw-normal text-muted">{label}</span></h4>
        <p className="m-0 text-muted small">{subtext}</p>
      </div>
    </div>
  </div>
);

const Dashboard = ({ currentUser }) => {
  const stats = [
    { icon: 'envelope-paper', color: '#a29bfe', count: '125', label: 'Formulaires', subtext: 'Demandes reçues cette semaine' },
    { icon: 'p-circle', color: '#00cec9', count: '40', label: 'Messages', subtext: 'Nouveaux messages à lire' },
    { icon: 'people', color: '#fdcb6e', count: '600', label: 'Utilisateurs', subtext: 'Comptes enregistrés' },
    { icon: 'envelope', color: '#d63031', count: '25', label: 'E-mails', subtext: 'Campagnes envoyées' },
    { icon: 'p-square', color: '#6c5ce7', count: '40', label: 'Hôtels', subtext: 'Établissements publiés' },
    { icon: 'person-badge', color: '#0984e3', count: '02', label: 'Entités', subtext: 'Espaces administrés' },
  ];

  return (
    <div className="p-4">
      <div className="mb-4">
        <h3 className="fw-normal">Bienvenue sur RED Product{currentUser?.name ? `, ${currentUser.name}` : ''}</h3>
        <p className="text-muted mb-1">BIENVENUE sur votre dashboard administrateur  de red product</p>
        <p className="text-muted small mb-0">{currentUser?.email || 'Connectez-vous pour retrouver votre profil administrateur.'}</p>
      </div>
      <div className="row">
        {stats.map((s, i) => <StatCard key={i} {...s} />)}
      </div>
    </div>
  );
};

export default Dashboard;