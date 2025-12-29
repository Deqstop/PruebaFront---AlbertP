import { useEffect, useState, useCallback } from "react";
import {
  Plus,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  Eye,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { appApi } from "../api/clients";
import type { ActionItem, PaginatedResponse } from "../types";
import Layout from "../components/Layout";

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  const pageSize = 10;

  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appApi.get<PaginatedResponse<ActionItem>>(
        "/actions/admin-list",
        {
          params: {
            pageNumber: page,
            pageSize: pageSize,
          },
        }
      );

      if (response.data && response.data.data) {
        setData(response.data.data);
        setTotalRecords(response.data.totalRecords || 0);
      }
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error de API:", error.response?.data);
      }
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    fetchActions();
  }, [fetchActions]);

  return (
    <Layout>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-[#1E1B4B]">Acciones</h1>
        <button
          onClick={() => navigate("/dashboard/create")}
          className="bg-[#1E1B4B] text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-opacity-90 transition-colors"
        >
          <Plus size={18} />
          Crear acción
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {/* Barra de Herramientas */}
        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
          <div className="relative w-64">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Buscar"
              className="w-full rounded-md border border-gray-300 px-10 py-1.5 text-sm outline-none focus:border-[#1E1B4B]"
            />
          </div>
          <button className="flex items-center gap-2 text-sm text-gray-600 font-medium">
            <Filter size={16} /> Filtros
          </button>
        </div>

        {/* Tabla */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 text-gray-400 text-[11px] uppercase tracking-wider font-semibold border-b border-gray-100">
                <th className="px-6 py-4">Nombre de la categoría</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Descripción</th>
                <th className="px-6 py-4">Fecha de creación</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="text-center py-10 text-gray-400 font-medium"
                  >
                    Cargando datos...
                  </td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-10 text-gray-400">
                    No se encontraron registros.
                  </td>
                </tr>
              ) : (
                data.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-sm font-medium text-gray-700">
                      {item.name}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 text-[11px] font-bold rounded-full uppercase ${
                          item.status
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.status ? "Activo" : "Inactivo"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                      {item.description}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex justify-center gap-3 text-gray-400">
                        <Edit2
                          size={16}
                          className="cursor-pointer hover:text-[#1E1B4B]"
                        />
                        <Trash2
                          size={16}
                          className="cursor-pointer hover:text-red-500"
                        />
                        <Eye
                          size={16}
                          className="cursor-pointer hover:text-[#06B6D4]"
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="p-4 flex justify-between items-center text-sm text-gray-500 bg-gray-50/30">
          <div>
            Mostrando {data.length} de {totalRecords} resultados
          </div>
          <div className="flex items-center gap-4">
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-opacity"
            >
              <ChevronLeft size={20} />
            </button>
            <span className="font-semibold text-[#1E1B4B]">Página {page}</span>
            <button
              disabled={data.length < pageSize}
              onClick={() => setPage((p) => p + 1)}
              className="p-1 rounded hover:bg-gray-200 disabled:opacity-30 transition-opacity"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
