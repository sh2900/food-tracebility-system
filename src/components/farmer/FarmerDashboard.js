import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StatusBadge from '../StatusBadge';

function FarmerDashboard() {
  const [batches, setBatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name: '', location: '' });

  useEffect(() => {
    fetchBatches();
  }, []);

  const fetchBatches = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/product/my/products", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setBatches(res.data);
    } catch (err) {
      console.error("Error fetching farmer batches", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://localhost:5000/api/product/create", {
        productId: `FARM-${Math.floor(Math.random() * 10000)}`,
        name: form.name,
        originLocation: form.location,
        harvestDate: new Date().toISOString()
      }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Harvest Registered!");
      fetchBatches();
      setForm({ name: '', location: '' });
    } catch (err) {
      alert("Error registering harvest");
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <section>
        <h1 style={{ marginBottom: '0.5rem' }}>Welcome back, Farmer!</h1>
        <p style={{ color: 'var(--text-secondary)' }}>Register your new harvests and track their status on the blockchain.</p>
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
        <div className="card" style={{ height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem' }}>🚜 Register New Harvest</h3>
          <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Product Name</label>
              <input className="input-field" placeholder="e.g. Organic Tomatoes" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            </div>
            <div>
              <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.5rem', display: 'block' }}>Farm Location</label>
              <input className="input-field" placeholder="e.g. Green Valley Farm" value={form.location} onChange={e => setForm({...form, location: e.target.value})} required />
            </div>
            <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>Register Harvest</button>
          </form>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <h3 style={{ marginBottom: '0.5rem' }}>My Recent Batches</h3>
          {loading ? (
            <p>Loading your batches...</p>
          ) : batches.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌾</div>
              <h4>No harvests registered yet.</h4>
              <p style={{ color: 'var(--text-muted)' }}>Start by filling out the form on the left.</p>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
              {batches.map((b) => (
                <div key={b._id} className="card" style={{ position: 'relative' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', letterSpacing: '0.05em' }}>{b.productId}</span>
                    <StatusBadge status={b.status} verified={true} />
                  </div>
                  <h4 style={{ marginBottom: '0.5rem', fontSize: '1.125rem' }}>{b.name}</h4>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    📍 {b.originLocation}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    📅 {new Date(b.harvestDate).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default FarmerDashboard;
