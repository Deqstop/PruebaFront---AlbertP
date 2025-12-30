import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Home,
  BarChart2,
  Users,
  LogOut,
  LayoutGrid,
  Heart,
  ShoppingBag,
  Star,
  Folder,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import LogoBeKind from "../utils/bekindLogo.png";

/**
 * Componente de diseño principal (Layout).
 * Proporciona la estructura global de la aplicación, incluyendo la barra lateral (Sidebar),
 * el encabezado superior (Header) y el contenedor principal para las páginas hijas.
 */
const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  /**
   * Gestiona el cierre de sesión del usuario.
   * Limpia el estado de autenticación y redirige a la página de login.
   */
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-[#F9FAFB]">
      {/* --- Sidebar Lateral --- */}
      <aside className="w-72 bg-white border-r border-gray-100 flex flex-col sticky top-0 h-screen">
        {/* Sección del Logo en Sidebar */}
        <div className="p-8 flex items-center">
          <img
            src={LogoBeKind}
            alt="Be Kind Logo"
            className="h-14 w-auto object-contain"
          />
        </div>

        {/* Navegación Principal */}
        <nav className="flex-1 px-6 space-y-2 mt-4">
          <NavItem icon={<Home size={20} />} label="Home" />
          <NavItem icon={<BarChart2 size={20} />} label="Impacto Social" />
          <NavItem icon={<Users size={20} />} label="Comunidad" />
          <NavItem icon={<Star size={20} />} label="Sponsors" />
          <NavItem icon={<ShoppingBag size={20} />} label="Marketplace" />
          <NavItem icon={<Heart size={20} />} label="Bakanes" />
          <NavItem icon={<Folder size={20} />} label="Contenidos" />
          <NavItem
            icon={<LayoutGrid size={20} />}
            label="Categorias de acciones"
            active
          />
        </nav>

        {/* Botón de Cierre de Sesión al final del Sidebar */}
        <div className="p-6 border-t border-gray-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-3 w-full text-gray-500 hover:bg-rose-50 hover:text-rose-600 rounded-xl transition-all font-semibold"
          >
            <LogOut size={20} />
            <span className="text-sm">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* --- Área de Contenido --- */}
      <div className="flex-1 flex flex-col">
        {/* Header Azul Superior: Contiene el logo centrado y perfil de usuario */}
        <header className="h-24 bg-[#1E1B4B] flex items-center justify-between px-12 relative shadow-lg">
          {/* Logo centrado en el Header mediante posicionamiento absoluto */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <img
              src={LogoBeKind}
              alt="Be Kind Network"
              className="h-16 w-auto object-contain brightness-0 invert"
            />
          </div>

          {/* Avatar de Usuario (Placeholder) */}
          <div className="ml-auto">
            <div className="w-10 h-10 bg-[#FBBF24] rounded-full flex items-center justify-center text-[#1E1B4B] font-bold border-2 border-white/10">
              A
            </div>
          </div>
        </header>

        {/* Contenido principal inyectado desde las rutas */}
        <main className="flex-1 px-12 mt-8 relative z-10">
          <div className="bg-white rounded-[20px] shadow-sm min-h-full border border-gray-100 overflow-hidden">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

/**
 * Componente interno para los elementos de navegación.
 * @param icon - Icono de la librería lucide-react.
 * @param label - Texto descriptivo del enlace.
 * @param active - Define si el ítem representa la ruta actual.
 */
const NavItem = ({
  icon,
  label,
  active = false,
}: {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}) => (
  <div
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl cursor-pointer transition-all font-bold text-sm ${
      active
        ? "bg-[#E0F7FC] text-[#00B5E2] shadow-sm shadow-cyan-100/50"
        : "text-gray-400 hover:bg-gray-50 hover:text-gray-600"
    }`}
  >
    {icon}
    <span>{label}</span>
  </div>
);

export default Layout;
