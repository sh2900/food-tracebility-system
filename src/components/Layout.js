import Sidebar from "./Sidebar";

function Layout({ children }) {
  return (
    <div style={{ display: "flex", background: "#0f172a" }}>
      
      <Sidebar />

      <div style={{
        marginLeft: "220px",
        padding: "30px",
        width: "100%",
        minHeight: "100vh",
        color: "white"
      }}>
        {children}
      </div>

    </div>
  );
}

export default Layout;