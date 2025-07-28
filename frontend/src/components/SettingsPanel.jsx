import React, { useState } from 'react'
import './SettingsPanel.css'

export default function SettingsPanel() {
  const [email, setEmail] = useState('')
  const [teamsUrl, setTeamsUrl] = useState('')
  const [historyDays, setHistoryDays] = useState(1)

  return (
    <div className="settings-panel">
      <h3>🔧 Configurazioni notifiche</h3>

      <div className="setting-group">
        <label>Email di notifica:</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="nome@email.com"
        />
      </div>

      <div className="setting-group">
        <label>Teams webhook URL:</label>
        <input
          type="text"
          value={teamsUrl}
          onChange={e => setTeamsUrl(e.target.value)}
          placeholder="https://outlook.office.com/webhook/..."
        />
      </div>

      <div className="setting-group">
        <label>Giorni di storico (default: 1):</label>
        <input
          type="number"
          min={1}
          max={30}
          value={historyDays}
          onChange={e => setHistoryDays(Number(e.target.value))}
        />
      </div>
    </div>
  )
}
