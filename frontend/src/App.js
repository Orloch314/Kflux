import React from 'react';
import TriggerButton from './components/TriggerButton';
import WorkflowPicker from './components/WorkflowPicker'; // ⬅️ aggiunto
import FolderPicker from './FolderPicker';

function App() {
  return (
    <div className="App" style={{ padding: '2rem' }}>
      <h1>K-Flux Alpha</h1>

      {/* ⬇️ Selettore visuale per la cartella KNIME */}
      <WorkflowPicker />

      <hr style={{ margin: '2rem 0' }} />

      {/* ⬇️ Bottone per trigger manuale (se esiste già e ti serve) */}
      <TriggerButton />
    </div>
  );
}

export default App;
