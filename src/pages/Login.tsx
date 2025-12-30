import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { authApi } from "../api/clients";
import { useAuth } from "../context/AuthContext";
import type { LoginPayload } from "../types";
import LogoBeKind from "../utils/bekindLogo.png";

/**
 * Componente de Autenticación (Login).
 * Gestiona el acceso de usuarios mediante credenciales, validación de formularios
 * y persistencia del token de sesión a través del AuthContext.
 */
const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  // --- Estados de UI ---
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // --- Configuración de React Hook Form ---
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginPayload>({
    defaultValues: {
      username: "",
      password: "",
    },
  });

  /**
   * Procesa el envío de credenciales al endpoint de autenticación.
   * @param data - Objeto con username (email) y password validados.
   */
  const onSubmit = async (data: LoginPayload) => {
    setIsLoading(true);
    setServerError(null);

    try {
      // Petición POST a la API de identidad
      const response = await authApi.post("/Authentication/Login", {
        username: data.username,
        password: data.password,
      });

      const token = response.data;

      /**
       * Validación de la respuesta:
       * El servidor devuelve el token directamente como una cadena.
       */
      if (token && typeof token === "string") {
        login(token); // Actualiza el contexto global y localStorage
        navigate("/dashboard"); // Redirección al área privada
      } else {
        setServerError("Formato de respuesta inválido");
      }
    } catch (error: unknown) {
      // Gestión centralizada de errores de red o credenciales
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message || "Error de credenciales"
        );
      } else {
        setServerError("Error inesperado");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC] px-4">
      {/* Elementos decorativos de fondo (Blobs de color) */}
      <div className="hidden md:block absolute top-[-8%] left-[-5%] w-64 h-64 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="hidden md:block absolute bottom-[-8%] right-[-5%] w-80 h-80 rounded-full bg-blue-50 blur-3xl" />

      {/* Contenedor principal de la tarjeta de Login */}
      <div className="z-10 w-full max-w-md sm:max-w-lg md:max-w-md lg:max-w-lg p-6 sm:p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        {/* Cabecera: Logo y Bienvenida */}
        <div className="flex flex-col items-center mb-6 sm:mb-8">
          <div className="mb-4 sm:mb-6">
            <img
              src={LogoBeKind}
              alt="Be Kind Logo"
              className="h-20 w-auto object-contain"
            />
          </div>
          <h1 className="text-center text-base sm:text-xl font-semibold text-gray-800 px-2">
            ¡Empieza a conectar tu comunidad ante buenas acciones!
          </h1>
        </div>

        {/* Formulario de acceso */}
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4 sm:space-y-5"
        >
          {/* Campo: Correo Electrónico */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-1">
              Correo Electrónico*
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register("username", {
                  required: "El correo es obligatorio",
                })}
                type="email"
                placeholder="Ingresar correo"
                className={`w-full h-11 rounded-xl border px-10 text-sm outline-none focus:ring-2 focus:ring-[#261647]/10 transition ${
                  errors.username ? "border-red-500" : "border-gray-200"
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-[11px] text-red-500 ml-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo: Contraseña con opción de visualización */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-600 ml-1">
              Contraseña*
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                {...register("password", {
                  required: "La contraseña es obligatoria",
                })}
                type={showPassword ? "text" : "password"}
                placeholder="Ingresa tu contraseña"
                className={`w-full h-11 rounded-xl border px-10 pr-10 text-sm outline-none focus:ring-2 focus:ring-[#261647]/10 transition ${
                  errors.password ? "border-red-500" : "border-gray-200"
                }`}
                disabled={isLoading}
              />
              {/* Botón para alternar visibilidad de contraseña */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[11px] text-red-500 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Enlace de recuperación */}
          <div className="text-right">
            <a
              href="#"
              className="text-xs text-[#1E1B4B] font-medium hover:underline"
            >
              Recuperar contraseña
            </a>
          </div>

          {/* Alerta de Error del Servidor */}
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 text-center">
              {serverError}
            </div>
          )}

          {/* Botón de acción principal con estado de carga */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-xl bg-[#261647] text-white font-medium flex items-center justify-center gap-2 disabled:opacity-60 transition shadow-sm hover:bg-[#1e113a]"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              "Ingresar"
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
