import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Blockchain() {
  const [records, setRecords] = useState([]);
  const [error, setError] = useState(null);

  const fetchHistory = () => {
    fetch("http://localhost:5000/real-blockchain")
      .then(res => {
        if (!res.ok) throw new Error("Backend connection failed.");
        return res.json();
      })
      .then(data => setRecords(data))
      .catch(err => {
        console.error(err);
        setError("Error: Could not fetch blockchain data. Ensure backend is running.");
      });
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return (
    <Layout>
      <div style={{
        padding: "20px",
        borderRadius: "15px",
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(10px)",
        border: "1px solid rgba(255,255,255,0.1)"
      }}>
        <div style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <h2>⛓ Immutable History</h2>
          <button 
            onClick={fetchHistory}
            style={{
              padding: "10px 20px",
              background: "#3b82f6",
              border: "none",
              borderRadius: "8px",
              color: "white",
              cursor: "pointer"
            }}>
            Refresh
          </button>
        </div>

        {error && (
            <div style={{ color: "#ef4444", marginBottom: "15px" }}>
                {error}
            </div>
        )}

        {records.length === 0 && !error && (
            <p style={{ color: "#94a3b8" }}>No blockchain records found.</p>
        )}

        <div style={{
          display: "grid",
          gap: "12px"
        }}>
          {records.slice().reverse().map((r, i) => (
            <div key={i} style={{
              background: "#1e293b",
              padding: "15px",
              borderRadius: "12px",
              borderLeft: `4px solid ${r.status?.includes("Safe") ? "#22c55e" : "#eab308"}`,
              transition: "transform 0.2s"
            }}>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <strong>🌡 {r.temperature}°C</strong>
                <span style={{ fontSize: "0.9rem", color: "#94a3b8" }}>{r.timestamp}</span>
              </div>
              <div style={{ marginTop: "5px" }}>
                📍 {r.location} | <span style={{ 
                    color: r.status?.includes("Safe") ? "#22c55e" : 
                           r.status?.includes("Moderate") ? "#eab308" : "#ef4444" 
                }}>{r.status}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
}

export default Blockchain;