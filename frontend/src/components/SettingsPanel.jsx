import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';

export default function SettingsPanel({ historyDays, setHistoryDays }) {
  const [email, setEmail] = useState('');
  const [teamsUrl, setTeamsUrl] = useState('');
  const [daysInput, setDaysInput] = useState(historyDays);
  const [historyData, setHistoryData] = useState([]); // Stato per la cronologia filtrata
  const [loading, setLoading] = useState(false); // Stato per il caricamento

  // Effetto per sincronizzare i giorni
  useEffect(() => {
    setDaysInput(historyDays); // Sincronizza i giorni di storico all'avvio
  }, [historyDays]);

  // Funzione per inviare i giorni al backend e ottenere i dati filtrati
  const fetchHistoryData = async (days) => {
    setLoading(true); // Attiva lo stato di caricamento

    try {
      const data = await window.electronAPI.getHistoryData(days);
      
      // Verifica che i dati esistano
      if (data && Array.isArray(data)) {
        const dataWithNumbers = data.map((item, index) => ({
          ...item,
          number: index + 1, // Aggiungi il numero di sequenza
        }));
        setHistoryData(dataWithNumbers); // Salva i dati ricevuti con i numeri
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    } finally {
      setLoading(false); // Disattiva lo stato di caricamento
    }
  };

  // Gestore del cambio di giorni
  const handleDaysChange = (e) => {
    const val = Number(e.target.value);
    setDaysInput(val);

    if (val >= 1 && val <= 30) {
      setHistoryDays(val); // Aggiorna il valore globale dei giorni
      fetchHistoryData(val); // Invia i giorni al backend per ottenere i dati filtrati
    }
  };

  return (
    <div className="settings-panel">
      <h3>🔧 Configurazioni notifiche</h3>

      <div className="setting-group">
        <label>Email di notifica:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@email.com"
        />
      </div>

      <div className="setting-group">
        <label>Teams webhook URL:</label>
        <input
          type="text"
          value={teamsUrl}
          onChange={(e) => setTeamsUrl(e.target.value)}
          placeholder="https://outlook.office.com/webhook/..."
        />
      </div>

      <div className="setting-group">
        <label>Giorni di storico da visualizzare:</label>
        <input
          type="number"
          min={1}
          max={30}
          value={daysInput}
          onChange={handleDaysChange}
        />
        <small>(Mostrerà i flussi completati negli ultimi {daysInput} giorni)</small>
      </div>

      {/* Se i dati sono in caricamento, mostriamo un indicatore di caricamento */}
      {loading && <div className="loading-message">Caricamento...</div>}

       {/* Mostra la lista dei flussi con il numero */}
       
    </div>
   );
}
