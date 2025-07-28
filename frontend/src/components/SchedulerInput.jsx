import React, { useState } from 'react'
import './SchedulerInput.css'

export default function SchedulerInput() {
  const [mode, setMode] = useState('daily') // 'daily', 'interval', 'manual'
  const [time, setTime] = useState('08:00')
  const [daysInterval, setDaysInterval] = useState(2)

  return (
    <div className="scheduler-input">
      <label>🕒 Schedule:</label>
      <select value={mode} onChange={e => setMode(e.target.value)}>
        <option value="daily">Ogni giorno alle...</option>
        <option value="interval">Ogni X giorni alle...</option>
        <option value="manual">Manuale</option>
      </select>

      {mode !== 'manual' && (
        <div className="time-config">
          {mode === 'interval' && (
            <input
              type="number"
              min={1}
              value={daysInterval}
              onChange={e => setDaysInterval(e.target.value)}
              placeholder="Giorni"
            />
          )}
          <input
            type="time"
            value={time}
            onChange={e => setTime(e.target.value)}
          />
        </div>
      )}
    </div>
  )
}
