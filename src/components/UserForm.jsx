import React, { useState } from "react";

const UserForm = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", rol: "" });
  const [msg, setMsg] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/newUser`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error("Error al crear usuario");
      await res.json();
      setMsg("Usuario creado con éxito ✅");
      setForm({ name: "", email: "", password: "", rol: "" });
    } catch (err) {
      setMsg("❌ " + err.message);
    }
  };

  return (
    <div className="flex justify-center p-6">
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Crear Usuario</h2>
        <input className="w-full p-2 border rounded mb-3" placeholder="Nombre" name="name" value={form.name} onChange={handleChange} required />
        <input className="w-full p-2 border rounded mb-3" placeholder="Correo" type="email" name="email" value={form.email} onChange={handleChange} required />
        <input className="w-full p-2 border rounded mb-3" placeholder="Contraseña" type="password" name="password" value={form.password} onChange={handleChange} required />
        <select className="w-full p-2 border rounded mb-3" name="rol" value={form.rol} onChange={handleChange} required>
          <option value="">Seleccione un rol</option>
          <option value="admin">Admin</option>
          <option value="vendedor">Vendedor</option>
        </select>
        <button className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition">Crear</button>
        {msg && <p className="mt-3 text-center text-sm">{msg}</p>}
      </form>
    </div>
  );
};

export default UserForm;
