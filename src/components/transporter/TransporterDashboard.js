import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../StatusBadge';
import SummaryCard from '../SummaryCard';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

function TransporterDashboard() {
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    activeShipments: 0,
    delayed: 0,
    avgTransitTemp: 4.5
  });

  useEffect(() => {
    fetchShipmentData();
  }, []);

  const fetchShipmentData = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/product/all/list", {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const inTransit = res.data.filter(p => p.status === 'In Transit');
      setShipments(inTransit);
      
      setStats({
        activeShipments: inTransit.length,
        delayed: inTransit.filter(p => p.status === 'Warning').length,
        avgTransitTemp: 4.5
      });
    } catch (err) {
      console.error("Error fetching shipment data", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h1 style={{ marginBottom: '0.5rem' }}>In Transit Tracking</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Live movement monitoring and environmental tracking for active shipments.</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <SummaryCard title="Active Shipments" value={stats.activeShipments} icon="🚚" color="#3b82f6" />
        <SummaryCard title="In Transit" value={stats.activeShipments} icon="📍" color="#6366f1" />
        <SummaryCard title="Avg Transit Temp" value={`${stats.avgTransitTemp}°C`} icon="🌡️" color="#10b981" />
        <SummaryCard title="Delayed/Warning" value={stats.delayed} icon="⚠️" color={stats.delayed > 0 ? "var(--warning)" : "var(--safe)"} />
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Active Shipments</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {loading ? (
              <p>Loading shipments...</p>
            ) : shipments.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                No active shipments found.
              </div>
            ) : (
              shipments.map((s) => {
                const latest = s.history[s.history.length - 1] || {};
                return (
                  <div key={s._id} style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1rem',
                    background: 'var(--bg-app)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border)'
                  }}>
                    <div>
                      <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{s.productId} - {s.name}</div>
                      <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>📍 Current: {latest.location || 'Unknown'}</div>
                    </div>
                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
                      <StatusBadge status={s.status} verified={true} />
                      <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary)' }}>🌡️ {latest.temperature || '--'}°C</div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Live Movement</h3>
          <div style={{ height: '300px', width: '100%', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <MapContainer center={[20, 77]} zoom={4} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {shipments.map((s, i) => (
                <Marker key={i} position={[20 + (Math.random() - 0.5) * 5, 77 + (Math.random() - 0.5) * 5]}>
                  <Popup>{s.productId} - In Transit</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>
    </div>
  );
}

export default TransporterDashboard;
