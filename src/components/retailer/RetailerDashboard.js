import React, { useState } from 'react';
import axios from 'axios';
import ProductTimeline from '../ProductTimeline';
import StatusBadge from '../StatusBadge';

function RetailerDashboard() {
  const [searchID, setSearchID] = useState("");
  const [traceData, setTraceData] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleTrace = async (e) => {
    e.preventDefault();
    if (!searchID) return;
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/product/${searchID}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setTraceData(res.data);
    } catch (err) {
      alert("Batch not found. Please verify the ID.");
      setTraceData(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h1 style={{ marginBottom: '0.5rem' }}>Product Traceability</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Verify product authenticity and trace the entire supply chain journey from farm to shelf.</p>
      </section>

      <section className="card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
        <form onSubmit={handleTrace} style={{ display: 'flex', gap: '1rem' }}>
          <input 
            className="input-field" 
            placeholder="Enter Batch ID (e.g. BATCH-1234)" 
            value={searchID} 
            onChange={e => setSearchID(e.target.value)} 
            required 
          />
          <button type="submit" className="btn btn-primary" disabled={loading} style={{ minWidth: '120px' }}>
            {loading ? 'Searching...' : 'Trace Journey'}
          </button>
        </form>
      </section>

      {traceData ? (
        <section style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }} className="fade-in">
          <div>
            <div className="card" style={{ marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0 }}>📦 Journey Timeline</h3>
                <div className="verified-badge">🛡️ Fully Traceable</div>
              </div>
              <ProductTimeline history={traceData.history} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <div className="card">
              <h3 style={{ marginBottom: '1.25rem' }}>Product Verification</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Current Owner</div>
                  <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{traceData.status === 'At Retailer' ? 'Retailer Store #01' : 'In Supply Chain'}</div>
                </div>
                <div style={{ padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Ledger Status</div>
                  <div style={{ color: 'var(--safe)', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    ✓ IMMUTABLE RECORDS
                  </div>
                </div>
              </div>
              <div style={{ marginTop: '1.5rem', fontSize: '0.875rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "This product has been verified against the blockchain ledger. All timestamps and environmental data are immutable."
              </div>
            </div>

            <div className="card">
              <h3 style={{ marginBottom: '1.25rem' }}>Current Status</h3>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Safety Status</span>
                <StatusBadge status={traceData.status} verified={true} />
              </div>
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>✅</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>AUTHENTIC</div>
                </div>
                <div style={{ flex: 1, textAlign: 'center', padding: '1rem', background: 'var(--bg-app)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>🥗</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>SAFE</div>
                </div>
              </div>
            </div>
          </div>
        </section>
      ) : !loading && (
        <section style={{ textAlign: 'center', padding: '4rem', opacity: 0.6 }}>
          <div style={{ fontSize: '4rem', marginBottom: '1.5rem' }}>🔍</div>
          <h2>Enter a Batch ID to see the journey</h2>
          <p>You can find the Batch ID on the product packaging or shipment manifest.</p>
        </section>
      )}
    </div>
  );
}

export default RetailerDashboard;
