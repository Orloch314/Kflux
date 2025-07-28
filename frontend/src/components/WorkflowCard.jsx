import React, { useState } from 'react'
import StatusIndicator from './StatusIndicator'
import SchedulerInput from './SchedulerInput'
import './WorkflowCard.css'

export default function WorkflowCard({ workflow }) {
  const {
    id,
    name,
    path,
    schedule,
    active
  } = workflow

  const [currentStatus, setCurrentStatus] = useState('scheduled')

  const handleRun = async () => {
    setCurrentStatus('running')

    try {
      const res = await fetch(`/api/etl/${id}`, { method: 'POST' })
      const data = await res.json()

      if (res.ok) {
        console.log(`✅ Flusso '${name}' eseguito:`, data.details?.duration)
        setCurrentStatus('success')
      } else {
        console.error(`❌ Errore flusso '${name}':`, data.error)
        setCurrentStatus('error')
      }
    } catch (err) {
      console.error(`❌ Errore connessione:`, err.message)
      setCurrentStatus('error')
    }
  }

  const handlePause = () => setCurrentStatus('paused') // placeholder
  const handleStop = () => setCurrentStatus('stopped') // placeholder

  return (

    
    <div className={`workflow-card ${active ? 'active' : 'inactive'}`}>
      <div className="card-header">
        <h3>{name}</h3>
        <StatusIndicator status={currentStatus} />
      </div>

      <p className="schedule-info">🕒 Schedule: {schedule || '⏱ Manuale'}</p>
      <p className="path-info">📁 Path: <code>{path}</code></p>

      {/* opzionale: input schedule */}
      <SchedulerInput />

      {active ? (
        <div className="button-group">
          <button onClick={handleRun} className="run-btn">▶️ Run</button>
          <button onClick={handlePause} className="pause-btn">⏸️ Pause</button>
          <button onClick={handleStop} className="stop-btn">⏹️ Stop</button>
        </div>
      ) : (
        <p className="disabled-msg">⛔ Flusso disattivato</p>

        
      )}
    </div>
  )
}
