import { Link } from "react-router-dom";

function Navbar() {
  return (
    <div style={{
      display: "flex",
      justifyContent: "space-around",
      padding: "15px",
      background: "#222",
      color: "white"
    }}>
      <Link to="/dashboard" style={{ color: "white" }}>Dashboard</Link>
      <Link to="/blockchain" style={{ color: "white" }}>Blockchain</Link>
      <Link to="/analytics" style={{ color: "white" }}>Analytics</Link>
    </div>
  );
}

export default Navbar;