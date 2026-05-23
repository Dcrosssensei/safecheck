import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function Navbar() {
  const { user, rol, userData, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const rolLabel = { inspector: "Inspector", supervisor: "Supervisor", admin: "Administrador" };

  return (
    <nav className="bg-blue-700 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold tracking-tight">
          SafeCheck
        </Link>

        <div className="flex items-center gap-6 text-sm">
          {(rol === "supervisor" || rol === "admin") && (
            <Link to="/dashboard" className="hover:text-blue-200 transition-colors">
              Dashboard
            </Link>
          )}
          <Link to="/hallazgos" className="hover:text-blue-200 transition-colors">
            Hallazgos
          </Link>
          <Link to="/hallazgos/nuevo" className="hover:text-blue-200 transition-colors">
            + Nuevo
          </Link>

          <div className="flex items-center gap-3 border-l border-blue-500 pl-4">
            <div className="text-right">
              <div className="font-medium">{userData?.displayName || user?.email}</div>
              <div className="text-blue-300 text-xs">{rolLabel[rol] || rol}</div>
            </div>
            <button
              onClick={handleLogout}
              className="bg-blue-600 hover:bg-blue-500 px-3 py-1 rounded text-xs transition-colors"
            >
              Salir
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}
