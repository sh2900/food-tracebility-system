import { useEffect, useState } from "react";
import Layout from "../components/Layout";
import { Line } from "react-chartjs-2";

import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js";

// ✅ Register chart components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement);

function Analytics() {
  const [history, setHistory] = useState([]);

  // 🔥 Fetch data from backend
  useEffect(() => {
    const fetchData = () => {
      fetch("http://127.0.0.1:5000/data")
        .then(res => res.json())
        .then(data => {
          setHistory(prev => [data, ...prev.slice(0, 9)]);
        });
    };

    fetchData();
    const interval = setInterval(fetchData, 3000);
    return () => clearInterval(interval);
  }, []);

  // 📊 Chart Data
  const chartData = {
    labels: history.map(item => item.timestamp),
    datasets: [
      {
        label: "Temperature (°C)",
        data: history.map(item => item.temperature),
        borderColor: "#667eea",
        backgroundColor: "rgba(102,126,234,0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  // ✅ Chart Options (AXIS LABELS + TITLE)
  const options = {
    responsive: true,
    plugins: {
      legend: {
        labels: {
          color: "white",
        },
      },
      title: {
        display: true,
        text: "Temperature Trend Over Time",
        color: "white",
        font: {
          size: 18,
        },
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Time",
          color: "white",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "white",
        },
      },
      y: {
        title: {
          display: true,
          text: "Temperature (°C)",
          color: "white",
          font: {
            size: 14,
          },
        },
        ticks: {
          color: "white",
        },
      },
    },
  };

  return (
    <Layout>
      <h2>📈 Temperature Trend Over Time</h2>

      <div
        style={{
          background: "#1e293b",
          padding: "20px",
          borderRadius: "10px",
        }}
      >
        <Line data={chartData} options={options} />
      </div>
    </Layout>
  );
}

export default Analytics;