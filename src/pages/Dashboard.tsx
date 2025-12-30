import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  SlidersHorizontal,
  Eye,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { appApi } from "../api/clients";
import Layout from "../components/Layout";

/* --- Interfaces de Datos --- */

/** Representa un elemento individual de categoría de acción. */
interface ActionItem {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  /** Estado de la acción: 1 para Activo, 0 para Inactivo. */
  status: number;
  createdAt: string;
}

/** Estructura de la respuesta paginada que entrega la API. */
interface ApiWrapper {
  data: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    data: ActionItem[];
  };
}

/**
 * Componente Dashboard.
 * Visualiza y gestiona las categorías, tipos y evidencias mediante una tabla paginada.
 * Incluye funcionalidades de búsqueda, filtrado y navegación a creación.
 */
const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  // --- Estados de Datos y UI ---
  const [data, setData] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<
    "Categorias" | "Tipos" | "Evidencias"
  >("Categorias");
  const [query, setQuery] = useState<string>("");

  /**
   * Obtiene los datos desde el servidor.
   * Utiliza useCallback para evitar recrear la función en cada renderizado,
   * optimizando el rendimiento y el ciclo de vida del useEffect.
   */
  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appApi.get<ApiWrapper>("/actions/admin-list", {
        params: {
          pageNumber: page,
          pageSize: pageSize,
          search: query || undefined, // Evita enviar strings vacíos a la API
        },
      });

      // Acceso seguro a la respuesta anidada de la API
      const apiResponse = response.data.data;
      setData(apiResponse.data || []);
      setTotalRecords(apiResponse.totalElements || 0);
    } catch (error) {
      console.error("Error cargando datos:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  /**
   * Efecto que dispara la carga de datos cada vez que cambian la página,
   * el tamaño de página o el término de búsqueda.
   */
  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return (
    <Layout>
      <div className="min-h-screen bg-white px-4 sm:px-10 py-8">
        {/* Título dinámico basado en la pestaña activa */}
        <h1 className="text-4xl font-bold text-[#12113A] mb-10">{activeTab}</h1>

        {/* --- Sistema de Navegación por Tabs --- */}
        <div className="mb-8 border-b border-gray-100">
          <nav className="flex gap-8">
            {(["Categorias", "Tipos", "Evidencias"] as const).map((t) => (
              <button
                key={t}
                onClick={() => {
                  setActiveTab(t);
                  setPage(1); // Reinicio a la primera página al cambiar de sección
                }}
                className={`pb-4 text-sm font-semibold transition-all relative ${
                  activeTab === t
                    ? "text-[#261647] border-b-2 border-[#261647]"
                    : "text-gray-400"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        {/* --- Barra de Herramientas (Búsqueda y Acciones) --- */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 mb-6">
          <div className="flex items-center gap-4 w-full md:w-auto">
            {/* Input de Búsqueda */}
            <div className="relative w-full md:w-64">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchActions()}
                placeholder="Buscar"
                className="w-full border border-gray-300 rounded-md pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
            </div>
            <button className="flex items-center gap-2 text-[#12113A] font-bold text-sm">
              <SlidersHorizontal size={16} />
              Filtros
            </button>
          </div>

          <button
            onClick={() => navigate("/dashboard/create")}
            className="flex items-center justify-center gap-2 bg-[#1E1B4B] text-white px-6 py-2.5 rounded-md font-bold text-sm hover:bg-[#2d2a6e] transition-colors w-full md:w-auto shadow-sm"
          >
            <Plus size={16} />
            Crear tipo de categoría
          </button>
        </div>

        {/* --- Tabla de Contenidos --- */}
        <div className="overflow-x-auto border border-gray-100 rounded-sm">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="bg-[#F9FAFB] text-gray-500 text-xs font-bold border-b border-gray-200 uppercase tracking-wider">
                <th className="px-6 py-4">
                  Nombre de la categoría{" "}
                  <span className="ml-1 opacity-50">↕</span>
                </th>
                <th className="px-6 py-4 text-center">
                  Icono <span className="ml-1 opacity-50">↕</span>
                </th>
                <th className="px-6 py-4">
                  Estado <span className="ml-1 opacity-50">↕</span>
                </th>
                <th className="px-6 py-4">
                  Descripción <span className="ml-1 opacity-50">↕</span>
                </th>
                <th className="px-6 py-4">
                  Fecha de creación <span className="ml-1 opacity-50">↕</span>
                </th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {/* Renderizado condicional mientras carga o si no hay datos */}
              {!loading &&
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="text-sm text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-6 font-medium text-[#4B5563]">
                      {item.name}
                    </td>
                    <td className="px-6 py-6 text-center">
                      <div className="w-8 h-8 rounded flex items-center justify-center mx-auto overflow-hidden">
                        {item.icon ? (
                          <img
                            src={item.icon}
                            alt=""
                            className="w-full h-full object-contain p-1"
                          />
                        ) : (
                          <span className="text-[8px] font-bold text-pink-600">
                            ICON
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span
                        className={`px-4 py-1.5 rounded-md text-xs font-semibold ${
                          item.status === 1
                            ? "bg-[#DCFCE7] text-[#166534] border border-[#BBF7D0]"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status === 1 ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-6 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-6">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-6">
                      <div className="flex justify-center gap-4 text-gray-400">
                        <Edit2
                          size={16}
                          className="cursor-pointer hover:text-indigo-600 transition-colors"
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer hover:text-red-600 transition-colors"
                        />
                        <Eye
                          size={16}
                          className="cursor-pointer hover:text-gray-600 transition-colors"
                        />
                      </div>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
          {/* Spinner o estado vacío cuando loading es true */}
          {loading && (
            <div className="py-10 text-center text-gray-400">
              Cargando datos...
            </div>
          )}
        </div>

        {/* --- Paginación y Footer --- */}
        <div className="flex flex-col md:flex-row items-center justify-end gap-6 py-6 text-sm text-gray-500">
          <div className="flex items-center gap-2">
            Resultados por página:
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setPage(1);
              }}
              className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-indigo-500"
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
          </div>

          <div className="font-medium">
            {(page - 1) * pageSize + 1} -{" "}
            {Math.min(page * pageSize, totalRecords)} de {totalRecords}
          </div>

          {/* Controles de navegación de página */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPage(1)}
              disabled={page === 1}
              className="p-1 hover:text-black disabled:opacity-20 transition-opacity"
            >
              <ChevronsLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-1 hover:text-black disabled:opacity-20 transition-opacity"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page * pageSize >= totalRecords}
              className="p-1 hover:text-black disabled:opacity-20 transition-opacity"
            >
              <ChevronRight size={18} />
            </button>
            <button
              onClick={() => setPage(Math.ceil(totalRecords / pageSize))}
              disabled={page * pageSize >= totalRecords}
              className="p-1 hover:text-black disabled:opacity-20 transition-opacity"
            >
              <ChevronsRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
