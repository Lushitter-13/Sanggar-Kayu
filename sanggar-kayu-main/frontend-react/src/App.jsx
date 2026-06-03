import './App.css'
import './Styles/Theme.css'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Products from "./Pages/Products";
import Pos from  "./Pages/Pos";
import "antd/dist/reset.css";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<AppLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/products" element={<Products />} />
          <Route path="/pos" element={<Pos />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
