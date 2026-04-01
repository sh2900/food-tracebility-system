import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import MapView from "../components/MapView";

function Dashboard() {
  const [data, setData] = useState({});
  const lat = 17.3850;
  const lng = 78.4867;

  useEffect(() => {
    fetch("http://127.0.0.1:5000/data")
      .then(res => res.json())
      .then(data => setData(data));
  }, []);

  return (
    <Layout>
      <h1 style={{ marginBottom: "20px" }}>
        👋 Welcome Back
      </h1>
      <h2>Dashboard</h2>

      {/* Cards */}
      <div style={{
        display: "flex",
        gap: "20px",
        marginTop: "20px"
      }}>
        <Card title="Temperature" value={`${data.temperature} °C`} icon="🌡️" />
        <Card title="Humidity" value={`${data.humidity} %`} icon="💧" />
        <Card title="Location" value={data.location} icon="📍" />
      </div>
      

      {/* Status */}
      <div style={{
        marginTop: "20px",
        padding: "15px",
        borderRadius: "10px",
        background: data.status?.includes("High") ? "#dc2626" :
                    data.status?.includes("Moderate") ? "#f59e0b" :
                    "#16a34a"
       }}>
       {data.status}
       </div>
      <h3>📍 Location Tracking</h3>
      <MapView lat={lat} lng={lng} />
    </Layout>
  );
}

function Card({ title, value, icon }) {
  return (
    <div style={{
      background: "#1e293b",
      padding: "20px",
      borderRadius: "12px",
      flex: 1,
      color: "white"
    }}>
      <div style={{ fontSize: "24px" }}>{icon}</div>
      <h4>{title}</h4>
      <h2>{value}</h2>
    </div>
  );
}

export default Dashboard;