// components/TriggerButton.js
import React, { useState } from 'react';
import { triggerETL } from '../services/api';

function TriggerButton() {
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    setStatus('In esecuzione...');
    try {
      const res = await triggerETL();
      setStatus('✔️ Flow completed');
      console.log(res.data);
    } catch (err) {
      setStatus('❌ Error');
      console.error(err);
    }
  };

 }

export default TriggerButton;
