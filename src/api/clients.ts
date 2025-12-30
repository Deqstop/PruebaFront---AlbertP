import axios from "axios";

/** * Instancia de Axios para servicios relacionados con la autenticación (Login, Registro).
 * Utiliza una base URL específica para el flujo de identidad.
 */
export const authApi = axios.create({
  baseURL: "https://dev.apinetbo.bekindnetwork.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});

/** * Instancia de Axios principal para los recursos de la aplicación.
 * Configurada para interactuar con la versión 1 de la API del ecosistema.
 */
export const appApi = axios.create({
  baseURL: "https://dev.api.bekindnetwork.com/api/v1",
});

/**
 * Interceptor de solicitudes para la instancia appApi.
 * Se encarga de adjuntar el token de seguridad y configurar las cabeceras de contenido
 * antes de que la petición salga hacia el servidor.
 */
appApi.interceptors.request.use(
  (config) => {
    // Recuperación del token desde el almacenamiento local
    const token = localStorage.getItem("token");

    // Si existe un token, se inyecta en la cabecera de Autorización bajo el esquema Bearer
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    /**
     * Gestión del Content-Type:
     * Si los datos enviados son del tipo FormData, se elimina el Content-Type para que
     * el navegador establezca automáticamente el boundary necesario para archivos.
     * De lo contrario, se establece como JSON.
     */
    if (config.data instanceof FormData) {
      delete config.headers["Content-Type"];
    } else {
      config.headers["Content-Type"] = "application/json";
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * Interceptor de respuestas para la instancia appApi.
 * Gestiona de forma centralizada las respuestas del servidor, enfocándose en el
 * manejo de errores de sesión expirada o no autorizada.
 */
appApi.interceptors.response.use(
  (response) => response,
  (error) => {
    /**
     * Si el servidor devuelve un estado 401 (No autorizado), se procede a
     * limpiar la sesión local y redirigir al login si el usuario no está ya allí.
     */
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      if (!window.location.pathname.includes("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);