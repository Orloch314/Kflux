import React from 'react';
import './App.css';
import WorkflowPicker from '../../src/components/WorkflowPicker';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <h1>K-Flux UI 💡</h1>
        <p>Seleziona una cartella KNIME per eseguire il flusso ETL</p>
      </header>

      <main style={{ padding: '2rem' }}>
        <WorkflowPicker />
      </main>
    </div>
  );
}

export default App;
