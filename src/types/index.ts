// --- Auth Types ---
export interface LoginPayload {
  username: string;
  password?: string;
}

export interface LoginResponse {
  token: string;
  expiration?: string;
  user?: {
    email: string;
    name: string;
  };
}

// --- Action/Category Types ---
export interface ActionItem {
  id: number | string;
  name: string;          // "Nombre de la categoría"
  description: string;   // "Descripción"
  icon?: string;         // URL del icono
  status: 'Active' | 'Inactive' | boolean; // "Estado"
  createdAt: string;     // "Fecha de creación"
  color?: string;        // Campo extra para color
}

export interface PaginatedResponse<T> {
  data: T[];
  pageNumber: number;
  pageSize: number;
  totalRecords: number;
  totalPages: number;
}