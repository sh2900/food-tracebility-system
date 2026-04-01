import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MapView from "../components/MapView";

function Dashboard() {
  const [data, setData] = useState({
    temperature: "--",
    humidity: "--",
    location: "Scanning...",
    timestamp: "--",
    status: "Initializing..."
  });
  const [loading, setLoading] = useState(false);

  const fetchLiveData = () => {
    setLoading(true);
    fetch("http://localhost:5000/data")
      .then(res => res.json())
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchLiveData();
    const interval = setInterval(fetchLiveData, 15000); // 15s refresh
    return () => clearInterval(interval);
  }, []);

  const simulateRecord = () => {
    setLoading(true);
    fetch("http://localhost:5000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        temperature: Math.floor(Math.random() * 15),
        location: "Warehouse-B",
        status: "IoT Checkpoint"
      })
    })
    .then(res => res.json())
    .then(r => {
        alert("Success! Block recorded. Check history.");
        setLoading(false);
    })
    .catch(err => {
        alert("Failed to sign transaction.");
        setLoading(false);
    });
  };

  return (
    <Layout>
      <div style={{ padding: "10px" }}>
        <h1 style={{ marginBottom: "5px", color: "white" }}>🌟 IoT Real-Time Monitor</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Traceability data secured via Ethereum Blockchain.</p>

        {/* Dashboard Status Card */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
          marginBottom: "30px"
        }}>
          <StatCard title="Live Temperature" value={`${data.temperature} °C`} icon="🌡️" color="#3b82f6" />
          <StatCard title="Air Humidity" value={`${data.humidity} %`} icon="💧" color="#8b5cf6" />
          <StatCard title="Device Location" value={data.location} icon="📍" color="#22c55e" />
        </div>

        {/* Analysis & Controls */}
        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
            <div style={{ 
                flex: "2",
                background: "rgba(255,255,255,0.05)",
                padding: "20px",
                borderRadius: "15px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div>
                    <h3>🚀 System Controls</h3>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Manual trigger for smart contract interaction.</p>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button 
                        onClick={fetchLiveData} 
                        disabled={loading}
                        className="premium-button"
                    >
                        {loading ? "..." : "Refresh Status"}
                    </button>
                    <button 
                        onClick={simulateRecord}
                        disabled={loading}
                        className="premium-button sec"
                    >
                        Simulate Blockchain Store
                    </button>
                </div>
            </div>

            <div style={{ 
                flex: "1",
                background: data.status?.includes("Safe") ? "#064e3b" : 
                            data.status?.includes("Moderate") ? "#78350f" : "#7f1d1d",
                padding: "20px",
                borderRadius: "15px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                minWidth: "200px"
            }}>
                <div style={{ textAlign: "center" }}>
                    <h1 style={{ margin: 0, fontSize: "2.5rem" }}>{data.status?.split(" ")[0]}</h1>
                    <p style={{ marginTop: "5px", fontWeight: "bold" }}>{data.status?.split(" ").slice(1).join(" ")}</p>
                </div>
            </div>
        </div>

        <h3>📦 Location Flow</h3>
        <MapView lat={17.3850} lng={78.4867} />
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <div style={{
      background: "rgba(30, 41, 59, 0.7)",
      padding: "25px",
      borderRadius: "20px",
      border: "1px solid rgba(255,255,255,0.05)",
      position: "relative",
      overflow: "hidden"
    }}>
      <div style={{ 
          position: "absolute", 
          top: "-10px", 
          right: "-10px", 
          fontSize: "4rem", 
          opacity: "0.1" 
      }}>{icon}</div>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</p>
      <h2 style={{ margin: "10px 0 0", fontSize: "2.2rem", fontWeight: "bold", color: color }}>{value}</h2>
    </div>
  );
}

export default Dashboard;