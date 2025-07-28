import React from 'react';
import { ReactComponent as DashboardIcon } from '../assets/icons/dashboard.svg';
import { ReactComponent as HistoryIcon } from '../assets/icons/history.svg';
import { ReactComponent as LogsIcon } from '../assets/icons/logs.svg';
import { ReactComponent as SettingsIcon } from '../assets/icons/settings.svg';
import '../styles/Sidebar.css';

const sections = [
  { key: 'dashboard', label: 'Workflows', Icon: DashboardIcon },
  { key: 'history', label: 'History', Icon: HistoryIcon },
  { key: 'logs', label: 'Logs', Icon: LogsIcon },
  { key: 'settings', label: 'Settings', Icon: SettingsIcon },
];

export default function Sidebar({ onSelect, active }) {
  return (
    <aside className="sidebar">
      <div className="sidebar-header">K-Flux</div>
      <ul className="sidebar-menu">
        {sections.map(({ key, label, Icon }) => (
          <li
            key={key}
            className={`sidebar-item ${active === key ? 'active' : ''}`}
            onClick={() => onSelect(key)}
          >
            <Icon className="sidebar-icon" />
            <span>{label}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}
