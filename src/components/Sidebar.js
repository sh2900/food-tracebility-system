import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <div style={{
      width: "210px",
      height: "93vh",
      background: "#020617",
      color: "white",
      padding: "20px",
      position: "fixed"
    }}>
      <h2 style={{ marginBottom: "40px" }}>🚀 TraceChain</h2>

      <NavItem to="/dashboard" label="📊 Dashboard" active={isActive("/dashboard")} />
      <NavItem to="/blockchain" label="⛓ Blockchain" active={isActive("/blockchain")} />
      <NavItem to="/analytics" label="📈 Analytics" active={isActive("/analytics")} />

      {/* Logout */}
      <button
        onClick={() => {
          localStorage.removeItem("auth");
          window.location.href = "/";
        }}
        style={{
          marginTop: "40px",
          background: "#ef4444",
          border: "none",
          padding: "10px",
          color: "white",
          borderRadius: "5px",
          cursor: "pointer"
        }}
      >
        Logout
      </button>
    </div>
  );
}

function NavItem({ to, label, active }) {
  return (
    <Link
      to={to}
      style={{
        display: "block",
        padding: "10px",
        marginBottom: "10px",
        borderRadius: "6px",
        background: active ? "#1e293b" : "transparent",
        color: "white",
        textDecoration: "none"
      }}
    >
      {label}
    </Link>
  );
}

export default Sidebar;