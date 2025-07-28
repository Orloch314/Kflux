import React from 'react';

const FolderPicker = () => {
  const selectFolder = async () => {
    const folderPath = await window.electron.invoke('select-folder');
    console.log('Selected folder:', folderPath);
    // Puoi anche aggiornare lo stato, mostrare il path o usarlo nel flusso KNIME!
  };

  return (
    <button onClick={selectFolder}>
      Select Folder
    </button>
  );
};

export default FolderPicker;
