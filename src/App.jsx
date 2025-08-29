import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import UserForm from "./components/UserForm";
import Dashboard from "./components/Dashboard";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white p-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
          <h1 className="font-bold text-xl">Panel Admin</h1>
          <div className="space-x-4">
            <Link to="/crear-usuario" className="hover:underline">Crear Usuario</Link>
            <Link to="/dashboard" className="hover:underline">Dashboard</Link>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/crear-usuario" element={<UserForm />} />
          <Route path="/dashboard" element={<Dashboard />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
