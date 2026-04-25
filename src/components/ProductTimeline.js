import React from 'react';

const ProductTimeline = ({ history }) => {
  if (!history || history.length === 0) return null;

  return (
    <div style={{ padding: '1rem 0' }}>
      <div style={{ position: 'relative', paddingLeft: '2.5rem' }}>
        <div style={{ 
          position: 'absolute', 
          left: '0.5rem', 
          top: '0.5rem', 
          bottom: '0.5rem', 
          width: '2px', 
          background: 'var(--border)',
          borderRadius: '1px'
        }}></div>
        
        {history.map((step, idx) => (
          <div key={idx} style={{ position: 'relative', marginBottom: '2rem' }}>
            <div style={{ 
              position: 'absolute', 
              left: '-2.4rem', 
              top: '0.25rem', 
              width: '1rem', 
              height: '1rem', 
              borderRadius: '50%', 
              background: step.blockchainHash ? 'var(--primary)' : 'var(--text-muted)',
              border: '3px solid var(--bg-surface)',
              boxShadow: step.blockchainHash ? '0 0 0 2px var(--primary-glow)' : 'none',
              zIndex: 1
            }}></div>
            
            <div className="card" style={{ 
              padding: '1.25rem',
              backgroundColor: 'var(--bg-app)',
              border: '1px solid var(--border)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ 
                  fontFamily: 'Outfit, sans-serif', 
                  fontWeight: 700, 
                  color: 'var(--text-primary)',
                  fontSize: '1rem' 
                }}>
                  {step.status}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 500 }}>
                  {new Date(step.timestamp).toLocaleString()}
                </span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>📍</span> {step.location}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Action by: <span style={{ color: 'var(--text-primary)', fontWeight: 600, textTransform: 'capitalize' }}>{step.role}</span>
                </div>
              </div>
              
              {(step.temperature !== undefined || step.humidity !== undefined) && (
                <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem' }}>
                  <div style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '0.375rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    🌡️ {step.temperature}°C
                  </div>
                  <div style={{ 
                    background: 'var(--bg-surface)', 
                    padding: '0.375rem 0.75rem', 
                    borderRadius: 'var(--radius-sm)', 
                    border: '1px solid var(--border)',
                    fontSize: '0.75rem',
                    fontWeight: 600,
                    color: 'var(--secondary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.25rem'
                  }}>
                    💧 {step.humidity}%
                  </div>
                </div>
              )}
              
              {step.blockchainHash && (
                <div style={{ 
                  marginTop: '1rem', 
                  paddingTop: '0.75rem', 
                  borderTop: '1px solid var(--border)', 
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '0.25rem'
                }}>
                  <div className="verified-badge" style={{ alignSelf: 'flex-start' }}>
                    🛡️ Verified on Ledger
                  </div>
                  <code style={{ 
                    fontSize: '0.625rem', 
                    color: 'var(--text-muted)', 
                    wordBreak: 'break-all',
                    backgroundColor: 'var(--bg-surface)',
                    padding: '0.25rem',
                    borderRadius: '4px'
                  }}>
                    {step.blockchainHash}
                  </code>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductTimeline;
