import React from 'react'
import './StatusIndicator.css'

export default function StatusIndicator({ status }) {
  const statusMap = {
    scheduled: { label: '⬛ In attesa', className: 'scheduled' },
    running: { label: '🟢 Attivo', className: 'running' },
    paused: { label: '🟡 In pausa', className: 'paused' },
    stopped: { label: '🔴 Fermato', className: 'stopped' },
    success: { label: '✅ Completato', className: 'success' },
    error: { label: '❌ Errore', className: 'error' },
    idle: { label: '⚪ Inattivo', className: 'idle' }
  }

  const info = statusMap[status] || { label: '⚪ Sconosciuto', className: 'unknown' }

  return (
    <span className={`status-indicator ${info.className}`}>
      {info.label}
    </span>
  )
}
