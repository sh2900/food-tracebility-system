import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Blockchain() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRecords = () => {
    console.log("📄 [FRONTEND] Attempting to synchronize blockchain ledger records...");
    setLoading(true);
    fetch("http://localhost:5000/real-blockchain")
      .then(res => {
        console.log("📥 [FRONTEND] Ledger API sync status:", res.status);
        if (!res.ok) {
            console.error("❌ [FRONTEND] Synchronize failed with status:", res.status);
            throw new Error("Could not connect to backend.");
        }
        return res.json();
      })
      .then(data => {
        console.log("📊 [FRONTEND] Ledger records restored! Total Count:", data.length);
        console.log("📋 [FRONTEND] Snapshot of latest record:", data[0]);
        setRecords(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ [FRONTEND] Blockchain history sync failed:", err.message);
        setError(err.message);
        setLoading(false);
      });
  };

  useEffect(() => {
    console.log("🚀 [FRONTEND] Blockchain Explorer component mounted.");
    fetchRecords();
    const interval = setInterval(() => {
        console.log("⏱️ [FRONTEND] Triggering auto-sync for blockchain audit trail.");
        fetchRecords();
    }, 12000); 
    return () => {
        console.log("🧹 [FRONTEND] Blockchain Explorer unmounting. Stopping sync interval.");
        clearInterval(interval);
    };
  }, []);

  return (
    <Layout>
      <div style={{ padding: "10px" }}>
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center",
          marginBottom: "20px"
        }}>
          <div>
            <h1 style={{ margin: 0 }}>⛓ Blockchain Explorer</h1>
            <p style={{ color: "#94a3b8", marginTop: "5px" }}>Live immutable audit trail of Ethereum-secured IoT data.</p>
          </div>
          <button onClick={() => {
              console.log("🔄 [FRONTEND] User manual refresh triggered.");
              fetchRecords();
            }} 
            disabled={loading} className="premium-button">
            {loading ? "Syncing..." : "🔄 Refresh Chain"}
          </button>
        </div>

        {error && (
          <div style={{ 
            background: "#450a0a", color: "#f87171", padding: "15px", borderRadius: "10px",
            marginBottom: "20px", border: "1px solid #7f1d1d" 
          }}>
            ⚠️ [FRONTEND] {error}
          </div>
        )}

        <div style={{ display: "grid", gap: "15px" }}>
          {records.length === 0 && !loading && (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b" }}>
               No transactions found on the blockchain yet. 
            </div>
          )}

          {records.map((r, i) => {
            console.log(`📑 [FRONTEND] Rendering record ${i} on stack.`);
            return (
              <div key={i} className="glass" style={{
                padding: "20px",
                borderRadius: "15px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                animation: "fadeIn 0.5s ease-out forwards",
                borderLeft: `5px solid ${r.status?.includes("Safe") ? "#22c55e" : "#ef4444"}`
              }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "1.2rem", fontWeight: "bold" }}>🌡 {r.temperature}°C</span>
                    <span style={{ 
                      fontSize: "0.75rem", padding: "3px 8px", borderRadius: "5px",
                      background: r.status?.includes("Safe") ? "#064e3b" : "#7f1d1d",
                      color: "white"
                    }}>
                      {r.status?.toUpperCase()}
                    </span>
                  </div>
                  <div style={{ marginTop: "8px", fontSize: "0.9rem", color: "#94a3b8" }}>
                    📍 {r.location} | <small>Validated at {r.timestamp}</small>
                  </div>
                </div>
                
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontSize: "0.7rem", color: "#64748b", textTransform: "uppercase" }}>Block Status</div>
                  <div style={{ color: "#22c55e", fontWeight: "bold" }}>✅ VERIFIED</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </Layout>
  );
}

export default Blockchain;