/**
 * PUNTO DE ENTRADA PRINCIPAL
 * Este archivo inicializa el árbol de componentes de React y lo inyecta en el DOM.
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css"; // Importación de estilos globales de Tailwind
import { AuthProvider } from "./context/AuthContext";

/**
 * Renderizado de la Aplicación:
 * Se utiliza createRoot para habilitar las funcionalidades concurrentes.
 * * Jerarquía de Wrappers:
 * 1. <React.StrictMode>: Herramienta de desarrollo para resaltar problemas potenciales.
 * 2. <AuthProvider>: Proveedor de contexto que envuelve toda la App para asegurar que
 * el estado de autenticación esté disponible en cualquier ruta o componente.
 * 3. <App />: Orquestador de rutas y vistas.
 */
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </React.StrictMode>
);
