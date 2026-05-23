import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getHallazgo, avanzarEstado } from "../hooks/useHallazgos";
import { useAuth } from "../contexts/AuthContext";
import EstadoBadge from "../components/EstadoBadge";
import PrioridadBadge from "../components/PrioridadBadge";

export default function HallazgoDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, rol } = useAuth();

  const [hallazgo, setHallazgo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notaModal, setNotaModal] = useState("");
  const [accionModal, setAccionModal] = useState("");
  const [responsableModal, setResponsableModal] = useState("");
  const [modalTipo, setModalTipo] = useState(null);
  const [saving, setSaving] = useState(false);
  const [errorModal, setErrorModal] = useState("");

  const puedeGestionar = rol === "supervisor" || rol === "admin";

  useEffect(() => {
    getHallazgo(id).then((data) => {
      setHallazgo(data);
      setLoading(false);
    });
  }, [id]);

  const formatFecha = (ts) => {
    if (!ts) return "—";
    const d = ts.toDate ? ts.toDate() : new Date(ts);
    return d.toLocaleDateString("es-CO", { day: "2-digit", month: "long", year: "numeric" });
  };

  const abrirModal = (tipo) => {
    setModalTipo(tipo);
    setNotaModal("");
    setAccionModal("");
    setResponsableModal("");
    setErrorModal("");
  };

  const confirmarTransicion = async () => {
    setErrorModal("");

    if (modalTipo === "En Proceso") {
      if (!responsableModal.trim()) {
        setErrorModal("Ingresa el nombre del responsable.");
        return;
      }
    }

    if (modalTipo === "Cerrado") {
      if (!accionModal.trim()) {
        setErrorModal("Describe la acción correctiva tomada.");
        return;
      }
    }

    setSaving(true);
    try {
      const extras = {};
      if (modalTipo === "En Proceso") extras.responsable = responsableModal.trim();
      if (modalTipo === "Cerrado") extras.accionCorrectiva = accionModal.trim();

      await avanzarEstado(
        id,
        modalTipo,
        user.uid,
        notaModal || `Cambio a ${modalTipo}`,
        extras
      );

      const updated = await getHallazgo(id);
      setHallazgo(updated);
      setModalTipo(null);
    } catch {
      setErrorModal("Error al actualizar. Intenta de nuevo.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="text-gray-500 py-8 text-center">Cargando hallazgo...</div>;
  }

  if (!hallazgo) {
    return (
      <div className="text-center py-10 text-gray-500">
        Hallazgo no encontrado.{" "}
        <Link to="/hallazgos" className="text-blue-600 underline">Volver</Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-5">
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <Link to="/hallazgos" className="hover:text-blue-600">Hallazgos</Link>
        <span>/</span>
        <span className="text-gray-700">{hallazgo.titulo}</span>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6 space-y-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{hallazgo.titulo}</h1>
            <div className="text-sm text-gray-500 mt-0.5">{hallazgo.ubicacion}</div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <PrioridadBadge prioridad={hallazgo.prioridad} />
            <EstadoBadge estado={hallazgo.estado} />
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
          <div>
            <div className="text-gray-500 text-xs mb-0.5">Categoría</div>
            <div className="font-medium text-gray-700">{hallazgo.categoria}</div>
          </div>
          <div>
            <div className="text-gray-500 text-xs mb-0.5">Fecha reporte</div>
            <div className="font-medium text-gray-700">{formatFecha(hallazgo.fechaCreacion)}</div>
          </div>
          {hallazgo.responsable && (
            <div>
              <div className="text-gray-500 text-xs mb-0.5">Responsable</div>
              <div className="font-medium text-gray-700">{hallazgo.responsable}</div>
            </div>
          )}
          {hallazgo.fechaCierre && (
            <div>
              <div className="text-gray-500 text-xs mb-0.5">Fecha cierre</div>
              <div className="font-medium text-gray-700">{formatFecha(hallazgo.fechaCierre)}</div>
            </div>
          )}
        </div>

        <div>
          <div className="text-gray-500 text-xs mb-1">Descripción</div>
          <p className="text-gray-700 text-sm leading-relaxed">{hallazgo.descripcion}</p>
        </div>

        {hallazgo.accionCorrectiva && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="text-xs text-green-700 font-medium mb-1">Acción correctiva</div>
            <p className="text-sm text-green-800">{hallazgo.accionCorrectiva}</p>
          </div>
        )}

        {puedeGestionar && hallazgo.estado === "Abierto" && (
          <button
            onClick={() => abrirModal("En Proceso")}
            className="bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Asignar responsable → En Proceso
          </button>
        )}

        {puedeGestionar && hallazgo.estado === "En Proceso" && (
          <button
            onClick={() => abrirModal("Cerrado")}
            className="bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            Registrar cierre → Cerrado
          </button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="font-semibold text-gray-700 mb-4">Historial</h2>
        <ol className="relative border-l border-gray-200 space-y-4 ml-3">
          {(hallazgo.historial || []).map((entry, i) => (
            <li key={i} className="ml-4">
              <div className="absolute -left-1.5 mt-1.5 w-3 h-3 rounded-full border-2 border-white bg-blue-400" />
              <div className="flex items-center gap-2">
                <EstadoBadge estado={entry.estado} />
                <span className="text-xs text-gray-400">{entry.fecha ? new Date(entry.fecha).toLocaleDateString("es-CO", { day: "2-digit", month: "short", year: "numeric" }) : ""}</span>
              </div>
              <p className="text-sm text-gray-600 mt-0.5">{entry.nota}</p>
            </li>
          ))}
        </ol>
      </div>

      {modalTipo && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
            <h3 className="font-semibold text-gray-800">
              {modalTipo === "En Proceso" ? "Asignar responsable" : "Registrar cierre"}
            </h3>

            {modalTipo === "En Proceso" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre del responsable <span className="text-red-500">*</span>
                </label>
                <input
                  value={responsableModal}
                  onChange={(e) => setResponsableModal(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Nombre del responsable asignado"
                />
              </div>
            )}

            {modalTipo === "Cerrado" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Acción correctiva tomada <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={accionModal}
                  onChange={(e) => setAccionModal(e.target.value)}
                  rows={3}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  placeholder="Describe la corrección realizada..."
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nota adicional (opcional)
              </label>
              <input
                value={notaModal}
                onChange={(e) => setNotaModal(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Observación..."
              />
            </div>

            {errorModal && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg px-3 py-2">
                {errorModal}
              </div>
            )}

            <div className="flex gap-3 pt-1">
              <button
                onClick={confirmarTransicion}
                disabled={saving}
                className="bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                {saving ? "Guardando..." : "Confirmar"}
              </button>
              <button
                onClick={() => setModalTipo(null)}
                className="border border-gray-300 hover:bg-gray-50 text-gray-700 text-sm font-medium px-5 py-2 rounded-lg transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
