import React, { useState, useEffect } from 'react'
import './HistoryPanel.css'
import { downloadHistoryCSV } from '../utils/csvExporter'

export default function HistoryPanel({ history, historyDays }) {
  const [filteredHistory, setFilteredHistory] = useState([])

  useEffect(() => {
    const cutoff = new Date()
    cutoff.setDate(cutoff.getDate() - historyDays)

    const recentHistory = history.filter(entry =>
      new Date(entry.timestamp) >= cutoff && entry.status === 'success'
    )
    setFilteredHistory(recentHistory)
  }, [history, historyDays])

  return (
    <div className="history-panel">
      <h3>📘 Flow completati</h3>
      <ul>
        {filteredHistory.map((entry, i) => (
          <li key={i} className="history-item">
            <div className="history-header">
              <strong>{entry.workflow}</strong> ⏱ {entry.duration} sec
            </div>
            <div className="history-meta">
              Inizio: {entry.startedAt} — Fine: {entry.finishedAt}<br />
              Trigger: {entry.trigger} — Stato: {entry.status}
            </div>
            {entry.notes && <p className="history-notes">🧾 {entry.notes}</p>}
          </li>
        ))}
      </ul>
      <button onClick={() => downloadHistoryCSV(filteredHistory)}>📥 Download CSV</button>
    </div>
  )
}
