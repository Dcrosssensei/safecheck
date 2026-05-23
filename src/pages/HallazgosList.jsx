import { useState } from "react";
import { Link } from "react-router-dom";
import { useHallazgos } from "../hooks/useHallazgos";
import { useAuth } from "../contexts/AuthContext";
import EstadoBadge from "../components/EstadoBadge";
import PrioridadBadge from "../components/PrioridadBadge";

export default function HallazgosList() {
  const { hallazgos, loading } = useHallazgos();
  const { rol, user } = useAuth();
  const [filtroEstado, setFiltroEstado] = useState("Todos");
  const [filtroPrioridad, setFiltroPrioridad] = useState("Todas");

  const lista =
    rol === "inspector"
      ? hallazgos.filter((h) => h.reportadoPor === user.uid)
      : hallazgos;

  const filtradas = lista.filter((h) => {
    const porEstado = filtroEstado === "Todos" || h.estado === filtroEstado;
    const porPrioridad = filtroPrioridad === "Todas" || h.prioridad === filtroPrioridad;
    return porEstado && porPrioridad;
  });

  const formatFecha = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" });
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Hallazgos</h1>
        <Link
          to="/hallazgos/nuevo"
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Nuevo hallazgo
        </Link>
      </div>

      <div className="flex flex-wrap gap-3">
        <div>
          <label className="text-xs text-gray-500 block mb-1">Estado</label>
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Todos">Todos</option>
            <option value="Abierto">Abierto</option>
            <option value="En Proceso">En Proceso</option>
            <option value="Cerrado">Cerrado</option>
          </select>
        </div>
        <div>
          <label className="text-xs text-gray-500 block mb-1">Prioridad</label>
          <select
            value={filtroPrioridad}
            onChange={(e) => setFiltroPrioridad(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="Todas">Todas</option>
            <option value="Alta">Alta</option>
            <option value="Media">Media</option>
            <option value="Baja">Baja</option>
          </select>
        </div>
      </div>

      {loading ? (
        <div className="text-gray-500 text-center py-8">Cargando hallazgos...</div>
      ) : filtradas.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
          No hay hallazgos con los filtros seleccionados.
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Título</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden sm:table-cell">Prioridad</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Estado</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600 hidden lg:table-cell">Fecha</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtradas.map((h) => (
                <tr key={h.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3">
                    <Link
                      to={`/hallazgos/${h.id}`}
                      className="text-blue-600 hover:underline font-medium"
                    >
                      {h.titulo}
                    </Link>
                    <div className="text-gray-400 text-xs mt-0.5">{h.ubicacion}</div>
                  </td>
                  <td className="px-4 py-3 text-gray-600 hidden md:table-cell">{h.categoria}</td>
                  <td className="px-4 py-3 hidden sm:table-cell">
                    <PrioridadBadge prioridad={h.prioridad} />
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={h.estado} />
                  </td>
                  <td className="px-4 py-3 text-gray-500 hidden lg:table-cell">
                    {formatFecha(h.fechaCreacion)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
