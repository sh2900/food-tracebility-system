import React from 'react';

const StatusBadge = ({ status, verified }) => {
  const getStatusClass = (s) => {
    switch (s?.toLowerCase()) {
      case 'safe':
      case 'active':
      case 'in transit':
      case 'at warehouse':
        return 'badge-safe';
      case 'warning':
      case 'delayed':
        return 'badge-warning';
      case 'critical':
      case 'compromised':
        return 'badge-critical';
      default:
        return 'badge-safe';
    }
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
      <span className={`badge ${getStatusClass(status)}`}>
        {status || 'Unknown'}
      </span>
      {verified && (
        <span className="verified-badge" title="Data stored securely on blockchain">
          🛡️ Verified
        </span>
      )}
    </div>
  );
};

export default StatusBadge;
