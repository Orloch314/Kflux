import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusIndicator from '../components/StatusIndicator';
import TriggerButton from '../components/TriggerButton';
import SchedulerInput from '../components/SchedulerInput';
import '../styles/Dashboard.css';

export default function Dashboard() {
  const [workflows, setWorkflows] = useState([]);
  const [statusMessage, setStatusMessage] = useState('');

  useEffect(() => {
    const fetchWorkflowsAndHistory = async () => {
      try {
        const [wfRes, histRes] = await Promise.all([
          axios.get('http://localhost:5000/api/workflows'),
          axios.get('http://localhost:5000/api/history'),
        ]);

        const workflows = wfRes.data;
        const history = histRes.data;

        const enhanced = workflows.map(wf => {
          const last = history
            .filter(h => h.id === wf.id)
            .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

          return {
            ...wf,
            status: 'idle',
            scheduleMode: wf.scheduleMode || 'manual',
            scheduleTime: wf.scheduleTime || '08:00',
            lastDuration: last ? `${last.duration}s` : '--',
          };
        });

        setWorkflows(enhanced);
      } catch (err) {
        console.error('❌ Errore caricamento dati:', err.message);
      }
    };

    fetchWorkflowsAndHistory();
  }, []);

  const handleAddWorkflow = async () => {
    if (!window.electron?.invoke) return alert('Electron non disponibile');

    let folderPath = await window.electron.invoke('select-folder');
    if (!folderPath) return;

    if (folderPath.endsWith('.knwf')) {
      setStatusMessage('⚠️ Hai selezionato un file .knwf. Uso la cartella padre.');
      folderPath = folderPath.replace(/[\\/][^\\/]+\.knwf$/, '');
    }

    const folderName = folderPath.split(/[\\/]/).pop();

    const newWorkflow = {
      id: `wf-${Date.now()}`,
      name: folderName,
      path: folderPath,
      scheduleMode: 'manual',
      scheduleTime: '08:00',
      active: false,
    };

    try {
      await axios.post('http://localhost:5000/api/workflows', newWorkflow);
      setWorkflows((prev) => [...prev, { ...newWorkflow, status: 'idle', lastDuration: '--' }]);
      setStatusMessage(`✅ Aggiunto ${newWorkflow.name}`);
    } catch (err) {
      console.error('Errore salvataggio workflow:', err.message);
      setStatusMessage('❌ Errore salvataggio workflow');
    }
  };

  const handleChangeFolder = async (id) => {
    if (!window.electron?.invoke) return alert('Electron non disponibile');
    const folderPath = await window.electron.invoke('select-folder');
    if (!folderPath) return;

    const folderName = folderPath.split(/[\\/]/).pop();
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, path: folderPath, name: folderName } : wf
      )
    );
  };

  const updateStatus = (id, status) => {
    setWorkflows((prev) =>
      prev.map((wf) =>
        wf.id === id ? { ...wf, status } : wf
      )
    );
  };

  const runWorkflow = async (id) => {
    const wf = workflows.find((w) => w.id === id);
    if (!wf) return;

    try {
      updateStatus(id, 'running');
      const res = await axios.post(`http://localhost:5000/api/etl/${id}`);
      setStatusMessage(`✅ ${wf.name}: ${res.data.message}`);
      updateStatus(id, 'idle');
    } catch (err) {
      console.error('Errore:', err.response?.data || err.message);
      updateStatus(id, 'error');
      setStatusMessage(`❌ ${wf.name}: ${err.response?.data?.error || 'Errore'}`);
    }
  };

  const pauseWorkflow = (id) => {
    updateStatus(id, 'paused');
    setStatusMessage(`⏸️ Workflow ${id} messo in pausa.`);
  };

  const stopWorkflow = (id) => {
    updateStatus(id, 'stopped');
    setStatusMessage(`⛔ Workflow ${id} interrotto.`);
  };

  const generalStop = () => {
    const updated = workflows.map((wf) => ({ ...wf, status: 'stopped' }));
    setWorkflows(updated);
    setStatusMessage('🔴 Tutti i workflow interrotti.');
  };

  return (
    <div className="dashboard">
      <div className="workflow-header">
        <h2 className="section-header">⚙️ Workflow KNIME</h2>
        <button className="button-primary" onClick={handleAddWorkflow}>
          ➕ Aggiungi Workflow
        </button>
      </div>

      {workflows.length === 0 ? (
        <p>🔍 Seleziona una cartella per ogni processo che vuoi aggiungere.</p>
      ) : (
        <table className="workflow-table">
          <thead>
            <tr>
              <th>Workflow</th>
              <th>Schedule</th>
              <th>Last Duration</th>
              <th>Status</th>
              <th>Actions</th>
              <th>📁</th>
            </tr>
          </thead>
          <tbody>
            {workflows.map((wf) => (
              <tr key={wf.id} className="workflow-row">
                <td>📁 {wf.name}</td>
                <td>
                  <SchedulerInput
                    initialMode={wf.scheduleMode}
                    initialTime={wf.scheduleTime}
                    initialDays={wf.daysInterval || 1}
                    onScheduleChange={(cronExpr, mode, time, daysInterval) => {
                      const updatedWf = {
                        ...wf,
                        schedule: cronExpr,
                        scheduleMode: mode,
                        scheduleTime: time,
                        daysInterval,
                        active: mode !== 'manual',
                      };

                      axios.put(`http://localhost:5000/api/workflows/${wf.id}`, updatedWf)
                        .then(() => {
                          setStatusMessage(`✅ Orario aggiornato per ${wf.name}`);
                          setWorkflows(prev =>
                            prev.map(w =>
                              w.id === wf.id
                                ? { ...w, scheduleMode: mode, scheduleTime: time }
                                : w
                            )
                          );
                        })
                        .catch(err => {
                          console.error('Errore aggiornamento scheduler:', err.message);
                          setStatusMessage(`❌ Errore aggiornamento orario per ${wf.name}`);
                        });
                    }}
                  />
                </td>
                <td>{wf.lastDuration}</td>
                <td><StatusIndicator status={wf.status} /></td>
                <td className="workflow-actions">
                  <TriggerButton label="Run" onClick={() => runWorkflow(wf.id)} />
                  <TriggerButton
                    label={wf.status === 'paused' ? 'Resume' : 'Pause'}
                    onClick={() => pauseWorkflow(wf.id)}
                  />
                  <TriggerButton label="Stop" onClick={() => stopWorkflow(wf.id)} />
                </td>
                <td>
                  <button
                    className="small-button"
                    onClick={() => handleChangeFolder(wf.id)}
                    title="Cambia cartella"
                  >
                    📁
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {workflows.length > 0 && (
        <button className="button-primary general-stop" onClick={generalStop}>
          ⛔ General Stop
        </button>
      )}

      {statusMessage && (
        <p className="status-message">{statusMessage}</p>
      )}
    </div>
  );
}
