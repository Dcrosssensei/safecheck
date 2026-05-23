import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute, RoleRoute } from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import HallazgosList from "./pages/HallazgosList";
import NewHallazgo from "./pages/NewHallazgo";
import HallazgoDetail from "./pages/HallazgoDetail";

function Layout({ children }) {
  return (
    <div className="min-h-screen bg-slate-100">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout>
                  <Navigate to="/hallazgos" replace />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/dashboard"
            element={
              <RoleRoute roles={["supervisor", "admin"]}>
                <Layout>
                  <Dashboard />
                </Layout>
              </RoleRoute>
            }
          />

          <Route
            path="/hallazgos"
            element={
              <ProtectedRoute>
                <Layout>
                  <HallazgosList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hallazgos/nuevo"
            element={
              <ProtectedRoute>
                <Layout>
                  <NewHallazgo />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/hallazgos/:id"
            element={
              <ProtectedRoute>
                <Layout>
                  <HallazgoDetail />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}
