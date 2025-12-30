import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm, useWatch } from "react-hook-form";
import { X, Upload, Loader2, CheckCircle2 } from "lucide-react";
import { appApi } from "../api/clients";
import Layout from "../components/Layout";
import axios from "axios";

/**
 * Componente CreateAction.
 * Renderiza un formulario modal para la creación de nuevas categorías de acciones sociales.
 * Maneja validación de datos, carga de archivos (iconos) y estados de envío al servidor.
 */
const CreateAction: React.FC = () => {
  const navigate = useNavigate();

  // --- Estados Locales ---
  const [serverError, setServerError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [logoError, setLogoError] = useState(false);

  // --- Configuración de React Hook Form ---
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<{
    name: string;
    description: string;
    status: boolean;
    color: string;
  }>({
    defaultValues: {
      status: true,
      color: "#4F46E5",
    },
  });

  /** * Observadores de campo (Hooks de vigilancia)
   * Utilizados para actualizaciones de UI en tiempo real (contador de caracteres y vista previa de color).
   */
  const descriptionValue = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });

  const currentColor = useWatch({
    control,
    name: "color",
    defaultValue: "#4F46E5",
  });

  /**
   * Gestiona la selección del archivo de imagen.
   * @param e - Evento de cambio del input de tipo file.
   */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0] ?? null;
    if (selected) {
      setFile(selected);
      setFileName(selected.name);
      setLogoError(false);
    }
  };

  /**
   * Procesa el envío del formulario.
   * Transforma los datos del formulario a FormData para permitir el envío de archivos binarios.
   * @param values - Objeto con los valores validados del formulario.
   */
  const onSubmit = async (values: {
    name: string;
    description: string;
    status: boolean;
    color: string;
  }) => {
    setServerError(null);

    // Validación manual para el campo de archivo (no gestionado por react-hook-form)
    if (!file) {
      setLogoError(true);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", values.name);
      formData.append("description", values.description);
      formData.append("status", values.status ? "1" : "0");
      formData.append("color", values.color);
      formData.append("icon", file);

      // Petición POST a la instancia de API configurada
      await appApi.post("/actions/admin-add", formData);

      setSuccess(true);
      // Redirección retardada para permitir al usuario ver el mensaje de éxito
      setTimeout(() => navigate("/dashboard"), 1800);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setServerError(
          error.response?.data?.message ||
            "Error: El servidor no aceptó los datos."
        );
      } else {
        setServerError("Error inesperado");
      }
    }
  };

  /**
   * Renderizado de pantalla de éxito (Feedback visual post-registro)
   */
  if (success) {
    return (
      <Layout>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl flex flex-col items-center text-center max-w-sm w-full">
            <CheckCircle2 size={60} className="text-green-500 mb-4" />
            <h2 className="text-2xl font-bold text-gray-800">
              ¡Acción Creada!
            </h2>
            <p className="text-gray-500 mt-2">Redirigiendo al dashboard...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      {/* Contenedor del Modal */}
      <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/40 backdrop-blur-sm p-4 md:p-6 overflow-auto">
        <div className="w-full max-w-[480px] md:rounded-[28px] bg-white p-5 md:p-8 shadow-2xl">
          {/* Cabecera del Formulario */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl font-bold text-[#1E1B4B]">
              Crear categoría
            </h2>
            <button
              onClick={() => navigate("/dashboard")}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Campo: Nombre con validación obligatoria */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Nombre de la categoría*
              </label>
              <input
                {...register("name", { required: "El nombre es obligatorio" })}
                placeholder="Escribe el nombre de la buena acción"
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm transition-all ${
                  errors.name
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
              />
              {errors.name && (
                <span className="inline-block px-3 py-1 rounded-md border border-red-500 text-red-500 text-xs font-medium">
                  {errors.name.message}
                </span>
              )}
            </div>

            {/* Campo: Descripción con límite de caracteres */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Descripción de la buena acción*
              </label>
              <textarea
                {...register("description", {
                  required: "La descripción es obligatoria",
                  maxLength: { value: 200, message: "Máximo 200 caracteres" },
                })}
                placeholder="Agregar descripción"
                rows={3}
                className={`w-full px-4 py-3 rounded-xl border outline-none text-sm resize-none transition-all ${
                  errors.description
                    ? "border-red-500 focus:border-red-500"
                    : "border-gray-200 focus:border-indigo-500"
                }`}
              />
              <div className="flex justify-between items-center">
                {errors.description && (
                  <span className="inline-block px-3 py-1 rounded-md border border-red-500 text-red-500 text-xs font-medium">
                    {errors.description.message}
                  </span>
                )}
                <div className="text-xs text-gray-400 font-medium ml-auto">
                  {descriptionValue?.length ?? 0}/200
                </div>
              </div>
            </div>

            {/* Campo: Carga de Archivo (Logo) */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">Logo*</label>
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />
                <div
                  className={`w-full px-4 py-3 rounded-xl border flex justify-between items-center bg-white transition-all hover:border-gray-300 ${
                    logoError ? "border-red-500" : "border-gray-200"
                  }`}
                >
                  <span
                    className={`text-sm truncate pr-4 ${
                      fileName ? "text-slate-700" : "text-gray-400"
                    }`}
                  >
                    {fileName || "Carga archivo"}
                  </span>
                  <Upload
                    size={18}
                    className={`${
                      logoError ? "text-red-500" : "text-slate-600"
                    } flex-shrink-0`}
                  />
                </div>
              </div>
              {logoError && (
                <span className="inline-block px-3 py-1 rounded-md border border-red-500 text-red-500 text-xs font-medium">
                  El logo es obligatorio
                </span>
              )}
            </div>

            {/* Campo: Color HEX con vista previa dinámica */}
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-700">
                Color (HEX)*
              </label>
              <div className="flex gap-3 items-center">
                <div
                  className="w-12 h-12 rounded-xl border border-gray-200 shadow-sm transition-colors duration-200 flex-shrink-0"
                  style={{
                    backgroundColor: currentColor?.match(
                      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/
                    )
                      ? currentColor
                      : "#e5e7eb",
                  }}
                />
                <div className="relative flex-1">
                  <input
                    {...register("color", {
                      required: "El código de color es obligatorio",
                      pattern: {
                        value: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
                        message: "Usa formato #hex (ej: #FFF o #4F46E5)",
                      },
                    })}
                    placeholder="Registra color código HEX"
                    className={`w-full h-full px-4 py-3 rounded-xl border outline-none text-sm font-mono transition-all ${
                      errors.color
                        ? "border-red-500 focus:border-red-500"
                        : "border-gray-200 focus:border-indigo-500"
                    }`}
                  />
                </div>
              </div>
              {errors.color && (
                <span className="inline-block px-3 py-1 rounded-md border border-red-500 text-red-500 text-xs font-medium">
                  {errors.color.message}
                </span>
              )}
            </div>

            {/* Campo: Estado Activo/Inactivo (Switch) */}
            <div className="flex items-center gap-4 py-2">
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  {...register("status")}
                  className="sr-only peer"
                />
                <div className="w-14 h-7 bg-gray-200 rounded-full peer peer-checked:bg-cyan-400 after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-7"></div>
              </label>
              <span className="text-sm font-bold text-slate-700">Activo</span>
            </div>

            {/* Mensaje de Error del Servidor */}
            {serverError && (
              <div className="bg-red-500 text-white p-3 rounded-xl text-sm font-medium">
                {serverError}
              </div>
            )}

            {/* Acciones del Formulario */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="w-full sm:flex-1 py-3 border border-[#1E1B4B] text-[#1E1B4B] rounded-2xl font-bold text-base hover:bg-gray-50 transition-all"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:flex-1 py-3 bg-[#1E1B4B] text-white rounded-2xl font-bold text-base disabled:bg-gray-300 transition-all shadow-lg"
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin mx-auto" />
                ) : (
                  "Crear Acción"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default CreateAction;
