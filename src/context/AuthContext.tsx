import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

/**
 * Interfaz que define la estructura y tipos del contexto de autenticación.
 */
interface AuthContextType {
  /** Indica si el usuario tiene una sesión activa. */
  isAuthenticated: boolean;
  /** Función para registrar el token en el almacenamiento persistente y actualizar el estado. */
  login: (token: string) => void;
  /** Función para remover las credenciales y resetear el estado de autenticación. */
  logout: () => void;
  /** Indica si la validación inicial del token está en proceso. */
  isLoading: boolean;
}

/**
 * Creación del contexto de autenticación.
 * Se inicializa como 'undefined' para obligar el uso del proveedor.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Proveedor del contexto de autenticación (AuthProvider).
 * Encapsula la lógica de persistencia de sesión y distribuye el estado a toda la aplicación.
 */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  /**
   * Efecto de inicialización que se ejecuta una sola vez al montar el componente.
   * Verifica la existencia de un token previo en el localStorage para restaurar la sesión.
   */
  useEffect(() => {
    const checkAuth = () => {
      // Intento de recuperación del token persistido
      const token = localStorage.getItem("token");
      if (token) {
        setIsAuthenticated(true);
      }
      // Finaliza el estado de carga independientemente del resultado
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  /**
   * Establece la sesión del usuario.
   * @param token - Cadena de texto que representa el JWT o identificador de sesión.
   */
  const login = (token: string) => {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  };

  /**
   * Finaliza la sesión del usuario.
   * Limpia los datos sensibles del almacenamiento local y actualiza el estado global.
   */
  const logout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Hook personalizado para acceder al estado y métodos de autenticación.
 * * @throws {Error} Si el hook se invoca fuera de un componente envuelto por AuthProvider.
 * @returns {AuthContextType} El contexto de autenticación actual.
 */
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  // Validación de seguridad para asegurar que el contexto esté disponible
  if (context === undefined) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }

  return context;
};
