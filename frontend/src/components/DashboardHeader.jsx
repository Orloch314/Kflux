import React, { useEffect, useState } from 'react';

export default function DashboardHeader() {
  const [userName, setUserName] = useState('utente');

  useEffect(() => {
    // Richiede l'utente via Electron
    const fetchUser = async () => {
      try {
        const name = await window.electron.invoke('get-user-name');
        setUserName(name);
      } catch (err) {
        console.error('Errore nel recupero utente:', err);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="dashboard-header">
      <h1 className="dashboard-title">K-Flux Dashboard</h1>
      <div className="dashboard-user">
        👋 Ciao, <strong>{userName}</strong>
      </div>
    </header>
  );
}
