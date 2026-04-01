import { useEffect, useState } from "react";
import Layout from "../components/Layout";

function Blockchain() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    fetch("http://127.0.0.1:5000/real-blockchain")
      .then(res => res.json())
      .then(data => setRecords(data));
  }, []);

  return (
    <Layout>
      <h2>Blockchain Records</h2>

      {records.map((r, i) => (
        <div style={{
        background: "#1e293b",
        padding: "15px",
        margin: "10px 0",
        borderRadius: "10px"
        }}>
        ⛓ {r.temperature}°C | {r.status}
        <br />
        <small>{r.timestamp}</small>
        </div>
      ))}
    </Layout>
  );
}

export default Blockchain;