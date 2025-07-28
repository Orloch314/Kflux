import React, { useState, useEffect } from 'react'
import './LogsPanel.css'
import { downloadLogsCSV } from '../utils/csvExporter'

export default function LogsPanel({ logs }) {
  const [filteredLogs, setFilteredLogs] = useState([])

  useEffect(() => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)

    const recentErrorsAndWarnings = logs.filter(log =>
      (log.type === 'error' || log.type === 'warning') &&
      new Date(log.timestamp) >= sevenDaysAgo
    )
    setFilteredLogs(recentErrorsAndWarnings)
  }, [logs])

  const handleClear = () => setFilteredLogs([])

  return (
    <div className="logs-panel">
      <h3>📄 Logs recenti (7 giorni)</h3>
      <div className="log-list">
        {filteredLogs.map((log, i) => (
          <div key={i} className={`log-item ${log.type}`}>
            <span>{log.timestamp}</span>
            <strong>{log.workflow}</strong>
            <p>{log.message}</p>
          </div>
        ))}
      </div>

      <button onClick={handleClear}>🧹 Clear Logs</button>
      <button onClick={() => downloadLogsCSV(filteredLogs)}>📥 Download CSV</button>
    </div>
  )
}
