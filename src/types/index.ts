/**
 * --- TIPOS DE AUTENTICACIÓN ---
 */

/**
 * Datos requeridos para la solicitud de inicio de sesión.
 */
export interface LoginPayload {
  /** Nombre de usuario, usualmente el correo electrónico. */
  username: string;
  /** Contraseña del usuario (opcional en la interfaz, requerida en la lógica). */
  password?: string;
}

/**
 * Estructura de la respuesta exitosa tras el Login.
 */
export interface LoginResponse {
  /** Token de acceso JWT. */
  token: string;
  /** Fecha/Hora en que el token deja de ser válido. */
  expiration?: string;
  /** Información básica del perfil de usuario autenticado. */
  user?: {
    email: string;
    name: string;
  };
}

/**
 * --- TIPOS DE ACCIÓN / CATEGORÍA ---
 */

/**
 * Representa una categoría de buena acción dentro del sistema.
 */
export interface ActionItem {
  /** Identificador único (soporta numérico o UUID). */
  id: number | string;
  /** Título visible de la categoría. */
  name: string;
  /** Resumen de los objetivos de la categoría. */
  description: string;
  /** URL o path del icono almacenado en el servidor. */
  icon?: string;
  /** Estado de disponibilidad. Soporta etiquetas string o booleano según la versión de la API. */
  status: 'Active' | 'Inactive' | boolean;
  /** Marca de tiempo de creación en formato ISO. */
  createdAt: string;
  /** Código hexadecimal para personalización de la UI. */
  color?: string;
}

/**
 * --- TIPOS DE UTILIDAD / API ---
 */

/**
 * Estructura genérica para envolver cualquier respuesta que requiera paginación.
 * @template T - El tipo de dato contenido en el arreglo 'data'.
 */
export interface PaginatedResponse<T> {
  /** Listado de elementos de la página actual. */
  data: T[];
  /** Índice de la página actual. */
  pageNumber: number;
  /** Cantidad de registros por página. */
  pageSize: number;
  /** Total global de registros en la base de datos. */
  totalRecords: number;
  /** Cantidad total de páginas disponibles. */
  totalPages: number;
}