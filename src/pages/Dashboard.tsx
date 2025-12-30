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
import type { ActionItem } from "../types";
import Layout from "../components/Layout";

/* =========================
   Helpers de validación (sin `any`)
========================= */

type RawObject = Record<string, unknown>;

const isObject = (v: unknown): v is RawObject =>
  typeof v === "object" && v !== null;

const hasActionItemShape = (v: unknown): v is RawObject =>
  isObject(v) && "id" in v && "name" in v && "status" in v;

const extractActionItemsFromUnknown = (data: unknown): ActionItem[] => {
  if (Array.isArray(data) && data.every(hasActionItemShape)) {
    return data as unknown as ActionItem[];
  }

  if (isObject(data)) {
    const maybeItems = (data as RawObject).items;
    const maybeResults = (data as RawObject).results;

    if (Array.isArray(maybeItems) && maybeItems.every(hasActionItemShape)) {
      return maybeItems as unknown as ActionItem[];
    }

    if (Array.isArray(maybeResults) && maybeResults.every(hasActionItemShape)) {
      return maybeResults as unknown as ActionItem[];
    }
  }

  return [];
};

const parseTotalRecords = (data: unknown): number | undefined => {
  if (!isObject(data)) return undefined;
  const tr = (data as RawObject).totalRecords;
  if (typeof tr === "number") return tr;
  if (typeof tr === "string") {
    const n = Number(tr);
    return Number.isFinite(n) ? Math.trunc(n) : undefined;
  }
  return undefined;
};

/* =========================
   Component
========================= */

const Dashboard = () => {
  const navigate = useNavigate();

  const [data, setData] = useState<ActionItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [page, setPage] = useState<number>(1);
  const [totalRecords, setTotalRecords] = useState<number>(0);
  const [pageSize, setPageSize] = useState<number>(10);
  const [activeTab, setActiveTab] = useState<"Categorias" | "Tipos" | "Evidencias">(
    "Categorias"
  );
  const [query, setQuery] = useState<string>("");

  const fetchActions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await appApi.get<unknown>("/actions/admin-list", {
        params: {
          pageNumber: page,
          pageSize,
          search: query || undefined,
        },
      });

      const raw = response.data;
      const items = extractActionItemsFromUnknown(raw);
      const tr = parseTotalRecords(raw);

      setData(items);
      setTotalRecords(tr ?? items.length);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Error de API:", error.response?.data ?? error.message);
      } else {
        console.error(error);
      }
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
        {/* Page header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-extrabold text-[#12113A]">Categorías</h1>
          <button
            onClick={() => navigate("/dashboard/create")}
            className="inline-flex items-center gap-2 bg-[#261647] text-white px-4 py-2 rounded-md shadow hover:opacity-95"
          >
            <Plus size={16} />
            Crear tipo de categoría
          </button>
        </div>

        {/* Tabs container */}
        <div className="shadow-sm border border-gray-100 rounded-md mb-6">
          <nav className="flex items-center gap-6 px-4 py-2 bg-white">
            {(["Categorias", "Tipos", "Evidencias"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setActiveTab(t)}
                className={`py-3 px-2 text-sm font-medium ${
                  activeTab === t
                    ? "border-b-4 border-[#261647] text-[#261647]"
                    : "text-gray-600"
                }`}
              >
                {t}
              </button>
            ))}
          </nav>
        </div>

        {/* Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          {/* Toolbar - search + filters */}
          <div className="px-6 py-5 flex items-center justify-between gap-4">
            <div className="flex items-center gap-4 flex-1">
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      setPage(1);
                      fetchActions();
                    }
                  }}
                  placeholder="Buscar"
                  className="w-full rounded-lg border border-gray-200 px-10 py-2 text-sm outline-none focus:ring-2 focus:ring-[#261647]/20"
                />
              </div>

              <button
                onClick={() => {
                  setPage(1);
                  fetchActions();
                }}
                className="inline-flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md text-sm text-gray-700 hover:bg-gray-50"
              >
                <Filter size={16} />
                Filtros
              </button>
            </div>

            <div className="text-sm text-gray-500"> {/* espacio a la derecha si se necesita */}</div>
          </div>

          {/* Table header */}
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-400 text-[12px] uppercase tracking-wider font-semibold border-b border-gray-100">
                  <th className="px-6 py-4">Nombre de la categoría</th>
                  <th className="px-6 py-4">Icono de la categoría</th>
                  <th className="px-6 py-4">Estado</th>
                  <th className="px-6 py-4">Descripción</th>
                  <th className="px-6 py-4">Fecha de creación</th>
                  <th className="px-6 py-4 text-center">Acciones</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      Cargando datos...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-gray-400">
                      No se encontraron registros.
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr key={String(item.id)} className="bg-white">
                      <td className="px-6 py-4 text-sm text-gray-800">{item.name}</td>
                      <td className="px-6 py-4">
                        {/* Placeholder icon */}
                        <div className="w-6 h-6 rounded-md bg-pink-100 flex items-center justify-center text-pink-600 text-sm">📷</div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-block px-3 py-1 text-xs font-semibold rounded-md ${
                            item.status ? "bg-emerald-100 text-emerald-700" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status ? "Activo" : "Inactivo"}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{String(item.description ?? "")}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">
                        {item.createdAt ? new Date(String(item.createdAt)).toLocaleDateString() : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-3 text-gray-400">
                          <Edit2 className="cursor-pointer" size={16} />
                          <Trash2 className="cursor-pointer" size={16} />
                          <Eye className="cursor-pointer" size={16} />
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination & footer */}
          <div className="px-6 py-4 bg-gray-50 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-sm text-gray-600">
              <span>Resultados por página</span>
              <select
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
                className="border rounded px-2 py-1 text-sm"
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
              </select>
            </div>

            <div className="flex items-center gap-6 text-sm text-gray-600">
              <div>
                {totalRecords === 0
                  ? `0 - 0 de 0`
                  : `${(page - 1) * pageSize + 1} - ${Math.min(page * pageSize, totalRecords)} de ${totalRecords}`}
              </div>

              <div className="flex items-center gap-2">
                <button
                  disabled={page === 1}
                  onClick={() => setPage(1)}
                  className="p-1 rounded disabled:opacity-40"
                >
                  {"<<"}
                </button>
                <button
                  disabled={page === 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="p-1 rounded disabled:opacity-40"
                >
                  <ChevronLeft size={18} />
                </button>
                <span className="font-semibold text-[#261647]">Página {page}</span>
                <button
                  disabled={page * pageSize >= totalRecords}
                  onClick={() => setPage((p) => p + 1)}
                  className="p-1 rounded disabled:opacity-40"
                >
                  <ChevronRight size={18} />
                </button>
                <button
                  disabled={page * pageSize >= totalRecords}
                  onClick={() => setPage(Math.max(1, Math.ceil(totalRecords / pageSize)))}
                  className="p-1 rounded disabled:opacity-40"
                >
                  {">>"}
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
