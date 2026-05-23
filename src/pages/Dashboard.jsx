import { useHallazgos } from "../hooks/useHallazgos";
import StatCard from "../components/StatCard";
import EstadoBadge from "../components/EstadoBadge";
import PrioridadBadge from "../components/PrioridadBadge";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { hallazgos, loading } = useHallazgos();

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">Cargando datos...</div>;
  }

  const abiertos = hallazgos.filter((h) => h.estado === "Abierto");
  const enProceso = hallazgos.filter((h) => h.estado === "En Proceso");
  const cerrados = hallazgos.filter((h) => h.estado === "Cerrado");

  const porCategoria = hallazgos.reduce((acc, h) => {
    acc[h.categoria] = (acc[h.categoria] || 0) + 1;
    return acc;
  }, {});

  const recientes = [...hallazgos].slice(0, 5);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard titulo="Total" valor={hallazgos.length} color="blue" />
        <StatCard titulo="Abiertos" valor={abiertos.length} color="red" />
        <StatCard titulo="En Proceso" valor={enProceso.length} color="yellow" />
        <StatCard titulo="Cerrados" valor={cerrados.length} color="green" />
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Por categoría</h2>
          <div className="space-y-2">
            {Object.entries(porCategoria).map(([cat, count]) => (
              <div key={cat} className="flex items-center gap-3">
                <div className="text-sm text-gray-600 w-28">{cat}</div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${(count / hallazgos.length) * 100}%` }}
                  />
                </div>
                <div className="text-sm font-medium text-gray-700 w-6 text-right">{count}</div>
              </div>
            ))}
            {Object.keys(porCategoria).length === 0 && (
              <p className="text-gray-400 text-sm">Sin datos aún.</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-5">
          <h2 className="font-semibold text-gray-700 mb-4">Hallazgos recientes</h2>
          <div className="space-y-3">
            {recientes.map((h) => (
              <Link
                key={h.id}
                to={`/hallazgos/${h.id}`}
                className="flex items-center justify-between hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
              >
                <div className="text-sm text-gray-700 truncate max-w-[180px]">{h.titulo}</div>
                <div className="flex items-center gap-2 shrink-0">
                  <PrioridadBadge prioridad={h.prioridad} />
                  <EstadoBadge estado={h.estado} />
                </div>
              </Link>
            ))}
            {recientes.length === 0 && (
              <p className="text-gray-400 text-sm">Sin hallazgos registrados.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
