import React, { useState, useEffect } from 'react';
import './SettingsPanel.css';

export default function SettingsPanel({ historyDays, setHistoryDays }) {
  const [email, setEmail] = useState('');
  const [teamsUrl, setTeamsUrl] = useState('');
  const [daysInput, setDaysInput] = useState(historyDays);
  const [historyData, setHistoryData] = useState([]); 
  const [loading, setLoading] = useState(false); 

  // Nuovi stati
  const [knimePath, setKnimePath] = useState('');
  const [smtpHost, setSmtpHost] = useState('');
  const [smtpPort, setSmtpPort] = useState('');
  const [smtpUser, setSmtpUser] = useState('');
  const [smtpPass, setSmtpPass] = useState('');

  useEffect(() => {
    setDaysInput(historyDays);
  }, [historyDays]);

  const fetchHistoryData = async (days) => {
    setLoading(true);
    try {
      const data = await window.electronAPI.getHistoryData(days);
      if (data && Array.isArray(data)) {
        const dataWithNumbers = data.map((item, index) => ({
          ...item,
          number: index + 1,
        }));
        setHistoryData(dataWithNumbers);
      }
    } catch (error) {
      console.error("Errore durante il recupero dei dati:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDaysChange = (e) => {
    const val = Number(e.target.value);
    setDaysInput(val);

    if (val >= 1 && val <= 30) {
      setHistoryDays(val);
      fetchHistoryData(val);
    }
  };

  // Funzione per aprire dialog e scegliere path KNIME
  const handleSelectKnimePath = async () => {
    try {
      const selectedPath = await window.electronAPI.openFileDialog();
      if (selectedPath) {
        setKnimePath(selectedPath);
      }
    } catch (err) {
      console.error("Errore selezione path:", err);
    }
  };

  // Salvataggio configurazione
  const handleSave = async () => {
    if (!window.confirm("⚠️ Stai sovrascrivendo le configurazioni esistenti, procedere?")) {
      return;
    }
    const config = {
      KNIME_PATH: knimePath,
      SMTP_HOST: smtpHost,
      SMTP_PORT: smtpPort,
      SMTP_USER: smtpUser,
      SMTP_PASS: smtpPass,
      NOTIFY_EMAIL: email,
      TEAMS_WEBHOOK: teamsUrl,
    };
    try {
      await window.electronAPI.saveSettings(config);
      alert("✅ Configurazioni salvate con successo");
    } catch (err) {
      console.error("Errore salvataggio configurazioni:", err);
      alert("❌ Errore durante il salvataggio");
    }
  };

  return (
    <div className="settings-panel">
      <h3>🔧 Configurazioni notifiche</h3>

      {/* Email destinatario */}
      <div className="setting-group">
        <label>Email di notifica:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="nome@email.com"
        />
      </div>

      {/* Teams */}
      <div className="setting-group">
        <label>Teams webhook URL:</label>
        <input
          type="text"
          value={teamsUrl}
          onChange={(e) => setTeamsUrl(e.target.value)}
          placeholder="https://outlook.office.com/webhook/..."
        />
      </div>

      {/* KNIME Path */}
      <div className="setting-group">
        <label>KNIME Path:</label>
        <div className="path-selector">
          <input
            type="text"
            value={knimePath}
            readOnly
            placeholder="Seleziona il path KNIME"
          />
          <button onClick={handleSelectKnimePath}>Sfoglia...</button>
        </div>
      </div>

      {/* SMTP Settings */}
      <fieldset className="smtp-section">
        <legend>📧 Impostazioni SMTP</legend>

        <div className="setting-group">
          <label>Host:</label>
          <input
            type="text"
            value={smtpHost}
            onChange={(e) => setSmtpHost(e.target.value)}
            placeholder="smtp.server.com"
          />
        </div>

        <div className="setting-group">
          <label>Porta:</label>
          <input
            type="number"
            value={smtpPort}
            onChange={(e) => setSmtpPort(e.target.value)}
            placeholder="587"
          />
        </div>

        <div className="setting-group">
          <label>User:</label>
          <input
            type="text"
            value={smtpUser}
            onChange={(e) => setSmtpUser(e.target.value)}
            placeholder="user@dominio.com"
          />
        </div>

        <div className="setting-group">
          <label>Password:</label>
          <input
            type="password"
            value={smtpPass}
            onChange={(e) => setSmtpPass(e.target.value)}
            placeholder="********"
          />
        </div>
      </fieldset>

      {/* Giorni di storico */}
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

      {loading && <div className="loading-message">Caricamento...</div>}

      {/* Bottone salva */}
      <div className="actions">
        <button onClick={handleSave}>OK</button>
      </div>
    </div>
  );
}
