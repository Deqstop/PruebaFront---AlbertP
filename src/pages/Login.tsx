import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import axios from "axios";
import { authApi } from "../api/clients";
import { useAuth } from "../context/AuthContext";
import type { LoginPayload } from "../types";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

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

  const onSubmit = async (data: LoginPayload) => {
    setIsLoading(true); // Mostrar loader
    setServerError(null);

    try {
      // Petición al endpoint de autenticación
      const response = await authApi.post("/Authentication/Login", {
        username: data.username,
        password: data.password,
      });

      const token = response.data;

      // El API devuelve el token como un string directo
      if (token && typeof token === "string") {
        login(token); // Guardar el token
        navigate("/dashboard"); // Redirigir al Dashboard
      } else {
        setServerError("Formato de respuesta inválido");
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        // Mostrar mensaje de error claro si falla
        setServerError(
          error.response?.data?.message || "Error de credenciales"
        );
      }
    } finally {
      setIsLoading(false); // Ocultar loader
    }
  };

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-[#F8FAFC]">
      {/* Elementos decorativos de fondo */}
      <div className="absolute top-[-10%] left-[-5%] w-64 h-64 rounded-full bg-blue-100/50 blur-3xl" />
      <div className="absolute bottom-[-10%] right-[-5%] w-80 h-80 rounded-full bg-blue-50 blur-3xl" />

      <div className="z-10 w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-100">
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-[#06B6D4] rounded-lg flex items-center justify-center text-white font-bold">
              BK
            </div>
            <div className="flex flex-col text-[#1E1B4B]">
              <span className="text-2xl font-bold leading-none">be kind</span>
              <span className="font-light text-xs">network</span>
            </div>
          </div>
          <h1 className="text-xl font-semibold text-center text-gray-800 px-4">
            ¡Empieza a conectar tu comunidad ante buenas acciones!
          </h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Campo Correo */}
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
                className={`input-primary pl-10 ${
                  errors.username ? "border-red-500" : ""
                }`}
              />
            </div>
            {errors.username && (
              <p className="text-[10px] text-red-500 ml-1">
                {errors.username.message}
              </p>
            )}
          </div>

          {/* Campo Contraseña - CORREGIDO con register y validaciones básicas */}
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
                className={`input-primary pl-10 pr-10 ${
                  errors.password ? "border-red-500" : ""
                }`}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.password && (
              <p className="text-[10px] text-red-500 ml-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <div className="text-right">
            <a
              href="#"
              className="text-xs text-[#1E1B4B] font-medium hover:underline"
            >
              Recuperar contraseña
            </a>
          </div>

          {/* Mensaje de Error del Servidor */}
          {serverError && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md text-xs text-red-600 text-center">
              {serverError}
            </div>
          )}

          {/* Botón con Loader */}
          <button
            type="submit"
            disabled={isLoading}
            className="btn-primary flex items-center justify-center gap-2"
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
