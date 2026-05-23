const styles = {
  Alta: "bg-red-100 text-red-700",
  Media: "bg-orange-100 text-orange-700",
  Baja: "bg-blue-100 text-blue-700",
};

export default function PrioridadBadge({ prioridad }) {
  return (
    <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded ${styles[prioridad] || "bg-gray-100 text-gray-600"}`}>
      {prioridad}
    </span>
  );
}
