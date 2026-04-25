import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SummaryCard from '../SummaryCard';
import StatusBadge from '../StatusBadge';
import { Line } from 'react-chartjs-2';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'chart.js/auto';

function AdminDashboard() {
  const [stats, setStats] = useState({
    totalBatches: 0,
    activeShipments: 0,
    activeAlerts: 0,
    sensorsActive: 12
  });
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', quantity: '', location: '', temp: 4, humidity: 65 });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const [productsRes, alertsRes] = await Promise.all([
        axios.get("http://localhost:5000/api/product/all/list", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://localhost:5000/api/alert", { headers: { Authorization: `Bearer ${token}` } })
      ]);

      setBatches(productsRes.data);
      setStats({
        totalBatches: productsRes.data.length,
        activeShipments: productsRes.data.filter(p => p.status === 'In Transit').length,
        activeAlerts: alertsRes.data.length,
        sensorsActive: 12
      });
    } catch (err) {
      console.error("Error fetching admin data", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/product/create", {
        productId: `BATCH-${Math.floor(Math.random() * 10000)}`,
        name: form.name,
        originLocation: form.location,
        harvestDate: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Batch Created Successfully!");
      fetchData();
      setForm({ name: '', quantity: '', location: '', temp: 4, humidity: 65 });
    } catch (err) {
      alert("Error creating batch");
    }
  };

  const chartData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Avg Temperature (°C)',
        data: [4.2, 4.5, 4.1, 4.3, 4.8, 4.6],
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Humidity (%)',
        data: [65, 68, 66, 70, 72, 69],
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Overview */}
      <section style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
        <SummaryCard title="Total Batches" value={stats.totalBatches} icon="📦" color="#10b981" trend="+12%" />
        <SummaryCard title="Active Shipments" value={stats.activeShipments} icon="🚚" color="#3b82f6" trend="+5%" />
        <SummaryCard title="Active Alerts" value={stats.activeAlerts} icon="🚨" color={stats.activeAlerts > 0 ? "#ef4444" : "#10b981"} />
        <SummaryCard title="Sensors Active" value={stats.sensorsActive} icon="📡" color="#6366f1" />
      </section>

      {/* Analytics & Map */}
      <section style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Sensor Telemetry (Avg)</h3>
          <div style={{ height: '300px' }}>
            <Line data={chartData} options={{ maintainAspectRatio: false, plugins: { legend: { position: 'bottom' } } }} />
          </div>
        </div>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Batch Locations</h3>
          <div style={{ height: '300px', width: '100%' }}>
            <MapContainer center={[20, 77]} zoom={4} style={{ height: '100%', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {batches.map((b, i) => (
                <Marker key={i} position={[20 + (Math.random() - 0.5) * 10, 77 + (Math.random() - 0.5) * 10]}>
                  <Popup>{b.name} - {b.productId}</Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>
      </section>

      {/* Batch Management */}
      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <div className="card">
          <h3 style={{ marginBottom: '1.5rem' }}>Create New Batch</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input className="input-field" placeholder="Product Name" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <input className="input-field" placeholder="Quantity (e.g. 500kg)" value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} required />
            <input className="input-field" placeholder="Location" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
            <div style={{ display: 'flex', gap: '1rem' }}>
              <input className="input-field" type="number" placeholder="Temp (°C)" value={form.temp} onChange={e => setForm({...form, temp: e.target.value})} />
              <input className="input-field" type="number" placeholder="Humidity (%)" value={form.humidity} onChange={e => setForm({...form, humidity: e.target.value})} />
            </div>
            <button type="submit" className="btn btn-primary">Create & Start Tracking</button>
          </form>
        </div>

        <div className="card" style={{ overflowX: 'auto' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>Registered Batches</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border)', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
                <th style={{ padding: '1rem' }}>Batch ID</th>
                <th style={{ padding: '1rem' }}>Product</th>
                <th style={{ padding: '1rem' }}>Location</th>
                <th style={{ padding: '1rem' }}>Status</th>
              </tr>
            </thead>
            <tbody>
              {batches.slice(0, 5).map((b) => (
                <tr key={b._id} style={{ borderBottom: '1px solid var(--border)', fontSize: '0.875rem' }}>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{b.productId}</td>
                  <td style={{ padding: '1rem' }}>{b.name}</td>
                  <td style={{ padding: '1rem' }}>{b.originLocation}</td>
                  <td style={{ padding: '1rem' }}>
                    <StatusBadge status={b.status} verified={true} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

export default AdminDashboard;
