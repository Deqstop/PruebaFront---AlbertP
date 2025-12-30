import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import { useAuth } from "./context/AuthContext";
import CreateAction from "./pages/CreateAction";

/**
 * Componente de orden superior (HOC) para la protección de rutas.
 * Actúa como un guardián (Middleware de UI) que verifica el estado de autenticación
 * antes de permitir el acceso a componentes privados.
 * * @param children - Los componentes que se desean renderizar si el usuario está autenticado.
 */
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  // Mientras se valida el token en el localStorage (estado inicial)
  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-surface">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Si la carga finalizó y no hay sesión activa, redirige al login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

/**
 * Componente Raíz de la Aplicación.
 * Define la estructura del enrutamiento y aplica los guardianes de seguridad.
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* --- Rutas Públicas --- */}
        <Route path="/login" element={<Login />} />

        {/* --- Rutas Protegidas --- 
            Envueltas en ProtectedRoute para asegurar que solo usuarios con token accedan.
        */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard/create"
          element={
            <ProtectedRoute>
              <CreateAction />
            </ProtectedRoute>
          }
        />

        {/* --- Lógica de Redirección --- */}

        {/* Raíz: Si el usuario entra a '/', lo enviamos al Dashboard (que validará su sesión) */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all: Cualquier ruta no definida redirige al Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
