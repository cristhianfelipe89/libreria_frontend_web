import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent } from "../components/Card";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState("");
  const [orden, setOrden] = useState("cantidad");

  useEffect(() => {
    const url = `${import.meta.env.VITE_API_URL}/dashboard`;
    //console.log("URL del dashboard:", url);

    fetch(url)
      .then((res) => res.json())
      .then(setData)
      .catch((err) => console.error("Error cargando dashboard:", err));
  }, []);


  if (!data) return <p className="p-6">Cargando...</p>;

  // ---- FUNCIONES AUXILIARES ----
  const getVentas = () => {
    let todas = [];

    if (!usuarioSeleccionado) {
      // Todos los usuarios
      Object.entries(data.ventasPorUsuario).forEach(([usuario, productos]) => {
        Object.values(productos).forEach((prod) => {
          todas.push({
            usuario,
            producto: prod.producto,
            cantidad: prod.cantidad,
            valor: prod.valor,
          });
        });
      });
    } else {
      // Solo un usuario
      const productos = data.ventasPorUsuario[usuarioSeleccionado] || {};
      Object.values(productos).forEach((prod) => {
        todas.push({
          usuario: usuarioSeleccionado,
          producto: prod.producto,
          cantidad: prod.cantidad,
          valor: prod.valor,
        });
      });
    }

    // Ordenar dinámicamente
    todas.sort((a, b) => b[orden] - a[orden]);
    return todas;
  };

  const ventasUsuario = getVentas();

  // ---- EXPORTAR ----
  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(ventasUsuario);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Ventas");
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    const dataBlob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(dataBlob, `ventas_${usuarioSeleccionado || "todos"}.xlsx`);
  };

  const usuarios = Object.keys(data.ventasPorUsuario || {});

  return (
    <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* ----- METAS ----- */}
      <Card>
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold">Meta por Cantidad</h3>
          <p className="text-2xl font-bold">{data.metas.cantidad}</p>
          <p className="text-sm text-gray-600">
            Actual:{" "}
            {Object.values(data.ventasPorUsuario)
              .flatMap((prod) => Object.values(prod))
              .reduce((sum, p) => sum + p.cantidad, 0)}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="text-center">
          <h3 className="text-lg font-semibold">Meta por Valor</h3>
          <p className="text-2xl font-bold">${data.metas.valor}</p>
          <p className="text-sm text-gray-600">
            Actual: $
            {Object.values(data.ventasPorUsuario)
              .flatMap((prod) => Object.values(prod))
              .reduce((sum, p) => sum + p.valor, 0)}
          </p>
        </CardContent>
      </Card>

      {/* ----- TOP POR CANTIDAD ----- */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">
            Top 10 Productos más vendidos (Cantidad)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topPorCantidad}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="cantidad" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----- TOP POR VALOR ----- */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent>
          <h3 className="text-lg font-semibold mb-4">
            Top 10 Productos más vendidos (Valor)
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data.topPorValor}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="producto" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="valor" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* ----- VENTAS POR USUARIO ----- */}
      <Card className="col-span-1 md:col-span-2">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold mb-4">Ventas por Usuario</h3>

          <div className="flex flex-col md:flex-row gap-4 mb-4 items-center">
            {/* Selector de usuario */}
            <select
              className="border p-2 rounded"
              onChange={(e) => setUsuarioSeleccionado(e.target.value)}
              value={usuarioSeleccionado}
            >
              <option value="">Todos los usuarios</option>
              {usuarios.map((u) => (
                <option key={u} value={u}>
                  {u}
                </option>
              ))}
            </select>

            {/* Ordenar */}
            <select
              className="border p-2 rounded"
              onChange={(e) => setOrden(e.target.value)}
              value={orden}
            >
              <option value="cantidad">Ordenar por Cantidad</option>
              <option value="valor">Ordenar por Valor</option>
            </select>

            {/* Botón exportar */}
            <button
              onClick={exportToExcel}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            >
              Exportar a Excel
            </button>
          </div>

          <table className="min-w-full text-sm border">
            <thead className="bg-gray-100">
              <tr>
                <th className="text-left p-2">Usuario</th>
                <th className="text-left p-2">Producto</th>
                <th className="text-right p-2">Cantidad</th>
                <th className="text-right p-2">Valor</th>
              </tr>
            </thead>
            <tbody>
              {ventasUsuario.map((v, idx) => (
                <tr key={idx} className="border-t">
                  <td className="p-2">{v.usuario}</td>
                  <td className="p-2">{v.producto}</td>
                  <td className="p-2 text-right">{v.cantidad}</td>
                  <td className="p-2 text-right">${v.valor}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}