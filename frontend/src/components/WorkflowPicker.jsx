import React, { useState } from 'react';
import axios from 'axios';

function WorkflowPicker() {
  const [selectedPath, setSelectedPath] = useState('');
  const [status, setStatus] = useState('');

  const selectFolder = async () => {
    const folderPath = await window.electron.invoke('select-folder');
    if (folderPath) setSelectedPath(folderPath);
  };

  const handlePathSubmission = async () => {
    if (!selectedPath) return;

    try {
      const res = await axios.post('http://localhost:5000/run-etl', {
        workflowPath: selectedPath
      });

      setStatus(`✅ ${res.data.message}`);
    } catch (err) {
      setStatus(`❌ ${err.response?.data?.error || 'Unexpected error'}`);
    }
  };

  return (
    <div>
      <h3>📂 Choose KNIME Workflow Folder</h3>
      <button onClick={selectFolder}>
        Select Folder
      </button>

      {selectedPath && (
        <p style={{ marginTop: '1rem' }}>
          Selected path: <strong>{selectedPath}</strong>
        </p>
      )}

      <button
        onClick={handlePathSubmission}
        disabled={!selectedPath}
        style={{ marginTop: '1rem' }}
      >
        ▶️ Run ETL
      </button>

      {status && <p style={{ marginTop: '1rem' }}>Status: <strong>{status}</strong></p>}
    </div>
  );
}

export default WorkflowPicker;
