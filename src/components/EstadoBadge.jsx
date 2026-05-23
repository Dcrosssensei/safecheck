const styles = {
  Abierto: "bg-red-100 text-red-700 border border-red-200",
  "En Proceso": "bg-yellow-100 text-yellow-700 border border-yellow-200",
  Cerrado: "bg-green-100 text-green-700 border border-green-200",
};

export default function EstadoBadge({ estado }) {
  return (
    <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${styles[estado] || "bg-gray-100 text-gray-600"}`}>
      {estado}
    </span>
  );
}
