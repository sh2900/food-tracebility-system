import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MapView from "../components/MapView";

function Dashboard() {
  const [data, setData] = useState({
    temperature: "--", humidity: "--",
    location: "Scanning...", timestamp: "--", status: "Initializing..."
  });
  const [loading, setLoading] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  useEffect(() => {
    console.log("🚀 [FRONTEND] Dashboard component mounting.");
    fetchLiveData();
    const interval = setInterval(() => {
        console.log("⏱️ [FRONTEND] Dashboard sync trigger.");
        fetchLiveData();
    }, 20000); 
    return () => {
        console.log("🧹 [FRONTEND] Dashboard component cleanup (Interval cleared).");
        clearInterval(interval);
    };
  }, []);

  const fetchLiveData = () => {
    console.log("📡 [FRONTEND] Fetching live IoT dashboard data...");
    setLoading(true);
    fetch("http://localhost:5000/data")
      .then(res => {
        console.log("📥 [FRONTEND] Sensor API response status:", res.status);
        return res.json();
      })
      .then(d => {
        console.log("📊 [FRONTEND] Data successfully synchronized:", d);
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        console.error("❌ [FRONTEND] sensor fetch exception:", err.message);
        setLoading(false);
      });
  };

  const simulateRecord = () => {
    console.log("🕹️ [FRONTEND] User triggered manual blockchain simulation.");
    setLoading(true);
    setSimulationResult(null);

    const payload = {
      temperature: Math.floor(Math.random() * 10) + 5,
      location: "Warehouse-B",
      status: "IoT Checkpoint"
    };
    console.log("📦 [FRONTEND] Request payload structure:", payload);

    fetch("http://localhost:5000/simulate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    })
    .then(async res => {
        console.log("📥 [FRONTEND] Simulation API status code:", res.status);
        const d = await res.json();
        if (!res.ok) {
            console.error("⚠️ [FRONTEND] Blockchain simulation REJECTED by server:", d);
            throw new Error(d.details || d.error || "Failed to record");
        }
        return d;
    })
    .then(r => {
        console.log("✅ [FRONTEND] Simulation success! Block Transaction Hash:", r.tx_hash);
        setSimulationResult({ success: true, tx: r.tx_hash });
        setLoading(false);
    })
    .catch(err => {
        console.error("❌ [FRONTEND] Blockchain simulation error details:", err.message);
        setSimulationResult({ success: false, msg: err.message });
        setLoading(false);
    });
  };

  return (
    <Layout>
      <div style={{ padding: "10px" }}>
        <h1 style={{ margin: 0 }}>🌟 IoT Real-Time Monitor</h1>
        <p style={{ color: "#94a3b8", marginBottom: "30px" }}>Live sensor feeds secured via Ethereum ledger.</p>

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

        <div style={{ display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" }}>
            <div style={{ 
                flex: "2",
                background: "rgba(255,255,255,0.05)",
                padding: "25px",
                borderRadius: "20px",
                border: "1px solid rgba(255,255,255,0.1)",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between"
            }}>
                <div>
                    <h3>🚀 System Controls</h3>
                    <p style={{ fontSize: "0.9rem", color: "#94a3b8" }}>Trigger manual blockchain audit proof.</p>
                </div>
                <div style={{ display: "flex", gap: "10px", marginTop: "15px" }}>
                    <button onClick={() => {
                        console.log("🔄 [FRONTEND] Manual refresh initiated.");
                        fetchLiveData();
                    }} disabled={loading} className="premium-button">
                        {loading ? "..." : "Refresh Status"}
                    </button>
                    <button onClick={simulateRecord} disabled={loading} className="premium-button sec">
                        Simulate Blockchain Store
                    </button>
                </div>

                {simulationResult && (
                    <div style={{ 
                        marginTop: "20px", 
                        padding: "12px", 
                        borderRadius: "10px",
                        background: simulationResult.success ? "#064e3b" : "#7f1d1d",
                        fontSize: "0.85rem",
                        color: "white"
                    }}>
                        {simulationResult.success ? (
                            <span>✅ [FRONTEND] SUCCESS: Block Hash: <code>{simulationResult.tx.substring(0, 30)}...</code></span>
                        ) : (
                            <span>❌ [FRONTEND] ERROR: Check browser console for full traceback.</span>
                        )}
                    </div>
                )}
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

        <h3>📦 Recent Transit Flow</h3>
        <MapView lat={17.3850} lng={78.4867} />
      </div>
    </Layout>
  );
}

function StatCard({ title, value, icon, color }) {
  console.log(`📊 [FRONTEND] Rendering Card: ${title} [${value}]`);
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
          position: "absolute", top: "-10px", right: "-10px", fontSize: "4rem", opacity: "0.1" 
      }}>{icon}</div>
      <p style={{ margin: 0, fontSize: "0.9rem", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{title}</p>
      <h2 style={{ margin: "10px 0 0", fontSize: "2.2rem", fontWeight: "bold", color: color }}>{value}</h2>
    </div>
  );
}

export default Dashboard;