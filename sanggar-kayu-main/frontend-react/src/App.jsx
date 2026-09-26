import './App.css'
import './Styles/Theme.css'
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import Transactions from "./Pages/Transactions";
import Products from "./Pages/Products";
import Pos from  "./Pages/Pos";
import User from "./Pages/User";
import "antd/dist/reset.css";
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        
        {/* Protected */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<Navigate to="dashboard" replace />} />

            <Route path="dashboard" element={<Dashboard />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="products" element={<Products />} />
            <Route path="pos" element={<Pos />} />
            <Route path="user" element={<User />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App
