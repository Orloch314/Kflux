import { triggerETL } from '../services/api';


export default function TriggerButton({ label, onClick }) {
  return (
    <button className="workflow-control-button" onClick={onClick}>
      {label}
    </button>
  );
}


