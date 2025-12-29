import React from "react";
import { useNavigate } from "react-router-dom";
import { Home, BarChart2, Users, LogOut, LayoutGrid } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children }: { children: React.ReactNode }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 flex items-center gap-2">
          <div className="w-8 h-8 bg-[#06B6D4] rounded flex items-center justify-center text-white font-bold text-xs">
            BK
          </div>
          <span className="font-bold text-[#1E1B4B]">be kind</span>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<Home size={18} />} label="Home" />
          <NavItem icon={<BarChart2 size={18} />} label="Impacto Social" />
          <NavItem icon={<Users size={18} />} label="Comunidad" />
          <NavItem icon={<LayoutGrid size={18} />} label="Acciones" active />
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-4 py-2 w-full text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            <span className="text-sm font-medium">Cerrar sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col">
        {/* Header azul superior */}
        <header className="h-16 bg-[#1E1B4B] flex items-center justify-end px-8">
          <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center text-[#1E1B4B] font-bold text-xs">
            A
          </div>
        </header>

        <div className="p-8">{children}</div>
      </main>
    </div>
  );
};

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

const NavItem = ({ icon, label, active = false }: NavItemProps) => (
  <div
    className={`flex items-center gap-3 px-4 py-2.5 rounded-lg cursor-pointer transition-colors ${
      active ? "bg-cyan-50 text-[#06B6D4]" : "text-gray-500 hover:bg-gray-50"
    }`}
  >
    {icon}
    <span className="text-sm font-medium">{label}</span>
  </div>
);

export default Layout;
