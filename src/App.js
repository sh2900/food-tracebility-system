import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Blockchain from "./pages/Blockchain";
import Analytics from "./pages/Analytics";
import MyProducts from "./pages/MyProducts";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/blockchain" element={<Blockchain />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/my-products" element={<MyProducts />} />
    </Routes>
  );
}

export default App;