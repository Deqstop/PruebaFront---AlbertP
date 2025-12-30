import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { appApi } from "../api/clients";
import Layout from "../components/Layout";

/* =========================
   Tipos basados en la API
========================= */

interface ActionItem {
  id: string;
  name: string;
  description: string;
  icon: string; // Campo 'icon' verificado en Postman
  color: string;
  status: number; // 1 = Activo, 0 = Inactivo
  createdAt: string;
}

interface ApiWrapper {
  data: {
    pageNumber: number;
    pageSize: number;
    totalElements: number;
    totalPages: number;
    data: ActionItem[]; // El array real está en este tercer nivel
  };
}

/* =========================
   Componente Dashboard
========================= */

const Dashboard = () => {
  const navigate = useNavigate();

  // Estados
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
   * Petición a la API
   */
  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appApi.get<ApiWrapper>("/actions/admin-list", {
        params: {
          pageNumber: page,
          pageSize: pageSize,
          search: query || undefined,
        },
      });

      // Ruta de acceso según estructura verificada: response.data (axios) -> .data (api wrapper) -> .data (array)
      const apiResponse = response.data.data;
      const items = apiResponse.data || [];
      const total = apiResponse.totalElements || 0;

      setData(items);
      setTotalRecords(total);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error de API:", error.response?.data ?? error.message);
      } else {
        console.error("Error inesperado:", error);
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, query]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return (
    <Layout>
      <div className="max-w-7xl mx-auto px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#12113A]">
            {activeTab}
          </h1>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="inline-flex items-center gap-2 bg-[#261647] text-white px-4 py-2 rounded-md shadow hover:opacity-95 transition-all"
          >
            <Plus size={16} />
            Crear tipo de categoría
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex items-center gap-8 px-2 bg-white">
            {(["Categorias", "Tipos", "Evidencias"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`py-4 px-1 text-sm font-bold transition-all ${
                  activeTab === t
                    ? "border-b-2 border-[#261647] text-[#261647]"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        {/* Card Principal */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Buscador */}
          <div className="px-6 py-5">
            <div className="relative w-96">
              <Search
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={16}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && fetchActions()}
                placeholder="Buscar"
                className="w-full rounded-lg border border-gray-200 px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#261647]/20"
              />
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-white text-gray-400 text-[11px] uppercase tracking-wider font-bold border-b border-gray-100">
                  <th className="px-6 py-4">Nombre de la categoría</th>
                  <th className="px-6 py-4 text-center">Icono</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Fecha de creación</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      Cargando registros...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 text-gray-400">
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-5 text-sm font-medium text-gray-700">
                        {item.name}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center">
                          {item.icon ? (
                            <img
                              src={item.icon}
                              alt={item.name}
                              className="w-8 h-8 rounded-lg object-contain bg-gray-50 border border-gray-100 p-1"
                            />
                          ) : (
                            <div className="w-8 h-8 rounded-lg bg-pink-100 flex items-center justify-center text-pink-600 text-[10px] font-bold">
                              ID
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span
                          className={`inline-block px-3 py-1 text-[11px] font-bold rounded-md ${
                            item.status === 1
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status === 1 ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500 max-w-xs truncate">
                        {item.description}
                      </td>
                      <td className="px-6 py-5 text-sm text-gray-500">
                        {new Date(item.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex justify-center gap-4 text-gray-400">
                          <Edit2
                            className="cursor-pointer hover:text-indigo-600 transition-colors"
                            size={16}
                          />
                          <Trash2
                            className="cursor-pointer hover:text-red-600 transition-colors"
                            size={16}
                          />
                          <Eye
                            className="cursor-pointer hover:text-gray-600 transition-colors"
                            size={16}
                          />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer / Paginación */}
          <div className="px-6 py-4 bg-white border-t border-gray-100 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-2">
              <span>Resultados por página:</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="bg-transparent font-bold outline-none cursor-pointer text-[#261647]"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <span className="font-medium">
                {totalRecords > 0
                  ? `${(page - 1) * pageSize + 1} - ${Math.min(
                      page * pageSize,
                      totalRecords
                    )} de ${totalRecords}`
                  : "0 - 0 de 0"}
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  disabled={page * pageSize >= totalRecords}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1 hover:bg-gray-100 rounded disabled:opacity-20 transition-all"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
