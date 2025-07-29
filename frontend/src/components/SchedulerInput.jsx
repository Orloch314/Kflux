import React, { useState, useEffect } from 'react';
import './SchedulerInput.css';

export default function SchedulerInput({ initialMode = 'manual', initialTime = '08:00', initialDays = 1, onScheduleChange }) {
  const [mode, setMode] = useState(initialMode);
  const [time, setTime] = useState(initialTime);
  const [daysInterval, setDaysInterval] = useState(initialDays);
  const handleScheduleChange = (mode, time, daysInterval) => {
  const cronExpr = mode === 'daily' 
    ? `${time.split(':')[1]} ${time.split(':')[0]} * * *`
    : mode === 'interval' 
      ? `${time.split(':')[1]} ${time.split(':')[0]} */${daysInterval} * *`
      : '';

  onScheduleChange(cronExpr, mode, time, daysInterval);
};

// Assicurati che l'input invii correttamente i dati quando cambia


  useEffect(() => {
    let cronExpr = '';
    if (mode === 'daily') {
      const [h, m] = time.split(':');
      cronExpr = `${m} ${h} * * *`;
    } else if (mode === 'interval') {
      const [h, m] = time.split(':');
      cronExpr = `${m} ${h} */${daysInterval} * *`;
    } else {
      cronExpr = ''; // Manuale
    }

    onScheduleChange(cronExpr, mode, time, daysInterval);
  }, [mode, time, daysInterval]);

  return (
    <div className="scheduler-input">
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
              onChange={e => setDaysInterval(parseInt(e.target.value))}
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
  );
}
