import { useEffect, useState } from "react";
import axios from "axios";
import Layout from "../components/Layout";

function Blockchain() {
  const [productId, setProductId] = useState("");
  const [logs, setLogs] = useState([]);
  const [allLogs, setAllLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAllLogs();
  }, []);

  const fetchAllLogs = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/blockchain/logs/all", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setAllLogs(res.data.reverse()); // Show latest first
    } catch (err) {
      console.error("Error fetching global logs", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductLogs = async () => {
    if (!productId) return fetchAllLogs();
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(`http://localhost:5000/api/blockchain/logs/${productId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setLogs(res.data.reverse());
    } catch (err) {
      alert("Error fetching blockchain logs");
    } finally {
      setLoading(false);
    }
  };

  const currentLogs = productId ? logs : allLogs;

  return (
    <Layout>
      <div className="fade-in">
        <h1 style={{ marginBottom: "0.5rem" }}>⛓ Blockchain Ledger Explorer</h1>
        <p style={{ color: "var(--text-secondary)", marginBottom: "2rem" }}>Real-time verification of supply chain events on the Ethereum network.</p>

        <div className="card" style={{ display: "flex", gap: "1rem", marginBottom: "2rem" }}>
          <input 
            className="input-field"
            placeholder="Search by Product ID (leave empty for all transactions)" 
            value={productId} 
            onChange={e => setProductId(e.target.value)} 
            style={{ flex: 1 }}
          />
          <button onClick={fetchProductLogs} className="btn btn-primary" disabled={loading}>
            {productId ? 'Verify ID' : 'Refresh Ledger'}
          </button>
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead style={{ background: 'var(--bg-app)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    <tr>
                        <th style={{ padding: '1rem 1.5rem' }}>Verification</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Product ID</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Data Hash</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Timestamp</th>
                        <th style={{ padding: '1rem 1.5rem' }}>Actor</th>
                    </tr>
                </thead>
                <tbody style={{ fontSize: '0.875rem' }}>
                    {loading ? (
                        <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>Synchronizing with blockchain...</td></tr>
                    ) : currentLogs.length === 0 ? (
                        <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>No immutable records found.</td></tr>
                    ) : (
                        currentLogs.map((log, idx) => (
                            <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <span className="verified-badge">
                                        ✓ VERIFIED
                                    </span>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', fontWeight: 600, color: 'var(--secondary)' }}>{log.productId}</td>
                                <td style={{ padding: '1rem 1.5rem' }}>
                                    <code style={{ fontSize: '0.75rem', color: 'var(--text-muted)', background: 'var(--bg-app)', padding: '2px 6px', borderRadius: '4px' }}>
                                        {log.dataHash.substring(0, 16)}...
                                    </code>
                                </td>
                                <td style={{ padding: '1rem 1.5rem', color: 'var(--text-secondary)' }}>{new Date(log.timestamp * 1000).toLocaleString()}</td>
                                <td style={{ padding: '1rem 1.5rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>{log.actor}</td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>

        <div style={{ marginTop: '2rem', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="card">
                <h4 style={{ marginBottom: '1rem' }}>Network Status</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Protocol</span>
                    <span style={{ color: 'var(--safe)', fontWeight: 600 }}>Ethereum (Ganache)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Consensus</span>
                    <span style={{ color: 'var(--secondary)', fontWeight: 600 }}>Proof of Authority</span>
                </div>
            </div>
            <div className="card">
                <h4 style={{ marginBottom: '1rem' }}>Contract Information</h4>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Address</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.7rem', fontFamily: 'monospace' }}>{process.env.REACT_APP_CONTRACT_ADDR || '0x4ee5b71e92eC3BF4EFC8c0b26BAE58cC270f305C'}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Compiler</span>
                    <span style={{ color: 'var(--text-secondary)' }}>solc 0.8.0</span>
                </div>
            </div>
        </div>
      </div>
    </Layout>
  );
}

export default Blockchain;