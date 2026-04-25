import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../StatusBadge';
import SummaryCard from '../SummaryCard';

function WarehouseDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStored: 0,
    avgTemp: 0,
    avgHumidity: 0,
    alerts: 0
  });

  useEffect(() => {
    fetchWarehouseData();
  }, []);

  const fetchWarehouseData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/product/all/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const warehouseBatches = res.data.filter(b => b.status === 'At Warehouse' || b.status === 'Stored');
      setBatches(warehouseBatches);
      
      // Calculate stats
      let tempSum = 0, humidSum = 0, count = 0;
      warehouseBatches.forEach(b => {
        const latest = b.history[b.history.length - 1];
        if (latest) {
          tempSum += latest.temperature || 0;
          humidSum += latest.humidity || 0;
          count++;
        }
      });

      setStats({
        totalStored: warehouseBatches.length,
        avgTemp: count > 0 ? (tempSum / count).toFixed(1) : 0,
        avgHumidity: count > 0 ? (humidSum / count).toFixed(1) : 0,
        alerts: warehouseBatches.filter(b => b.status === 'Warning' || b.status === 'Critical').length
      });
    } catch (err) {
      console.error("Error fetching warehouse data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h1 style={{ marginBottom: '0.5rem' }}>Storage Monitoring</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Real-time oversight of environmental conditions and inventory status.</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <SummaryCard title="Total Stored" value={stats.totalStored} icon="🏢" color="#3b82f6" />
        <SummaryCard title="Avg Temperature" value={`${stats.avgTemp}°C`} icon="🌡️" color="#10b981" />
        <SummaryCard title="Avg Humidity" value={`${stats.avgHumidity}%`} icon="💧" color="#6366f1" />
        <SummaryCard title="Active Alerts" value={stats.alerts} icon="🚨" color={stats.alerts > 0 ? "var(--critical)" : "var(--safe)"} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Stored Batches</h3>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
              <thead style={{ background: 'var(--bg-app)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <tr>
                  <th style={{ padding: '1rem' }}>Batch ID</th>
                  <th style={{ padding: '1rem' }}>Product Name</th>
                  <th style={{ padding: '1rem' }}>Location</th>
                  <th style={{ padding: '1rem' }}>Condition</th>
                  <th style={{ padding: '1rem' }}>Status</th>
                </tr>
              </thead>
              <tbody style={{ fontSize: '0.875rem' }}>
                {loading ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>Loading storage data...</td></tr>
                ) : batches.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center' }}>No batches currently in storage.</td></tr>
                ) : (
                  batches.map((b) => {
                    const latest = b.history[b.history.length - 1] || {};
                    return (
                      <tr key={b._id} style={{ borderBottom: '1px solid var(--border)' }}>
                        <td style={{ padding: '1rem', fontWeight: 600 }}>{b.productId}</td>
                        <td style={{ padding: '1rem' }}>{b.name}</td>
                        <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{latest.location || b.originLocation}</td>
                        <td style={{ padding: '1rem' }}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <span style={{ color: latest.temperature > 8 ? 'var(--critical)' : 'var(--safe)' }}>
                              {latest.temperature}°C
                            </span>
                            <span style={{ color: 'var(--text-muted)' }}>|</span>
                            <span>{latest.humidity}%</span>
                          </div>
                        </td>
                        <td style={{ padding: '1rem' }}>
                          <StatusBadge status={b.status} verified={true} />
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

export default WarehouseDashboard;
