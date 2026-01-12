
import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import LoginPage from './pages/LoginPage';
import UserList from './pages/UserList';
import UserRoles from './pages/UserRoles';
import POSSale from './pages/POSSale';
import AddSale from './pages/AddSale';

const App: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  const handleLogin = (status: boolean) => {
    setIsAuthenticated(status);
    localStorage.setItem('isLoggedIn', String(status));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isLoggedIn');
  };

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-slate-50 overflow-hidden">
        {/* Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0">
          <Header onLogout={handleLogout} />
          
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/users/list" element={<UserList />} />
              <Route path="/users/roles" element={<UserRoles />} />
              <Route path="/sales/pos" element={<POSSale />} />
              <Route path="/sales/add" element={<AddSale />} />
              {/* Fallback for other routes */}
              <Route path="*" element={
                <div className="flex flex-col items-center justify-center h-full text-slate-400">
                  <div className="text-4xl font-bold mb-2">Coming Soon</div>
                  <p>This module is currently under development.</p>
                </div>
              } />
            </Routes>
          </main>
        </div>
      </div>
    </HashRouter>
  );
};

export default App;
