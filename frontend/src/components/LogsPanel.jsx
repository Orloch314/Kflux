import React, { useState, useEffect } from 'react';
import './LogsPanel.css';
import { downloadLogsCSV } from '../utils/csvExporter';

export default function LogsPanel() {
  // Definisci lo stato per i log
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    // Rimosso console.log per evitare di stampare nel terminal
    window.electron.invoke('get-logs-data').then(logs => {
      // Filtra solo i log di tipo "error" o "warning" (case insensitive)
      const filteredLogs = logs.filter(log => {
        const logType = log.type.toLowerCase();
        return logType === 'error' || logType === 'warning';
      });

      setLogs(filteredLogs);  // Aggiorna lo stato con i log filtrati
    }).catch(err => {
      // Mantenuto l'errore per la gestione del fallimento, se necessario
      console.error('Errore nel recupero dei logs:', err);
    });
  }, []);  // Il secondo parametro [] assicura che l'effetto venga eseguito una sola volta

  const handleClear = () => setLogs([]);  // Funzione per pulire i log

  return (
    <div className="logs-panel">
      <h3>📄 Logs recenti</h3>
      <div className="log-list">
        {logs.length > 0 ? (
          logs.map((log, i) => (
            <div key={i} className={`log-item ${log.type}`}>
              <span>{log.timestamp}</span>
              <strong>{log.workflow}</strong>
              <p>{log.message}</p>
            </div>
          ))
        ) : (
          <p>Nessun log trovato.</p>
        )}
      </div>

      <button onClick={handleClear}>🧹 Clear Logs</button>
      <button onClick={() => downloadLogsCSV(logs)}>📥 Download CSV</button>
    </div>
  );
}
