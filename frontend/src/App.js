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
  const [historyData, setHistoryData] = useState([]);
  const [historyDays, setHistoryDays] = useState(1);

  useEffect(() => {
    window.electron.invoke('get-user-name')
      .then(setUserName)
      .catch(() => setUserName(''));
    }, []);

    useEffect(() => {
  window.electron.invoke('get-history-data')
    .then(data => {
      console.log('[FRONTEND] 🧾 Ricevuti', data.length, 'elementi da history.json');
      setHistoryData(data);
    })
    .catch((err) => {
      console.error('[FRONTEND] ❌ Errore nel recupero della history:', err);
      setHistoryData([]);
    });
}, []);

  const renderContent = () => {
    switch (activeView) {
      case 'history':
        return <HistoryPanel history={historyData} historyDays={historyDays} />;
      case 'logs':
        return <LogsPanel />;
      case 'settings':
        return <SettingsPanel historyDays={historyDays} setHistoryDays={setHistoryDays} />;
      default:
        return <Dashboard />;
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
