import React, { useState } from 'react';
import SuperAdminLogin from './pages/SuperAdminLogin';
import SuperAdminDashboard from './pages/SuperAdminDashboard';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(
    localStorage.getItem('isSuperAdminAuthenticated') === 'true'
  );

  const handleLoginSuccess = () => {
    localStorage.setItem('isSuperAdminAuthenticated', 'true');
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('isSuperAdminAuthenticated');
    setIsAuthenticated(false);
  };

  return (
    <div>
      {isAuthenticated ? (
        <SuperAdminDashboard onLogout={handleLogout} />
      ) : (
        <SuperAdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </div>
  );
}

export default App;
