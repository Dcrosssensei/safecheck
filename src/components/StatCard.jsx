export default function StatCard({ titulo, valor, color }) {
  const colors = {
    red: "bg-red-50 border-red-200 text-red-700",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-700",
    green: "bg-green-50 border-green-200 text-green-700",
    blue: "bg-blue-50 border-blue-200 text-blue-700",
  };

  return (
    <div className={`rounded-xl border p-5 ${colors[color] || colors.blue}`}>
      <div className="text-3xl font-bold">{valor}</div>
      <div className="text-sm font-medium mt-1">{titulo}</div>
    </div>
  );
}
