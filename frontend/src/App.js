import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import DashboardHeader from './components/DashboardHeader';
import Dashboard from './views/Dashboard';
import HistoryPanel from './components/HistoryPanel';
import LogsPanel from './components/LogsPanel';
import SettingsPanel from './components/SettingsPanel';
import './styles/main.css';

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [userName, setUserName] = useState('');

  useEffect(() => {
    // Recupera il nome utente di sistema tramite Electron
    window.electron.invoke('get-user-name')
      .then(setUserName)
      .catch(() => setUserName(''));
  }, []);

  const renderContent = () => {
    switch (activeView) {
      case 'history': return <HistoryPanel />;
      case 'logs': return <LogsPanel />;
      case 'settings': return <SettingsPanel />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="app-container">
      <Sidebar onSelect={setActiveView} active={activeView} />
      <div className="main-area">
        <DashboardHeader userName={userName} />
        <div className="main-content">
          {renderContent()}
        </div>
      </div>
    </div>
  );
}
