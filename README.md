# Be Kind Network — Frontend (React + Vite + TypeScript + Tailwind)

Este repositorio contiene la aplicación frontend construida con **Vite + React + TypeScript + Tailwind CSS**. El proyecto implementa autenticación (login), un dashboard con listado paginado de categorías/acciones, y un formulario para crear nuevas acciones con subida de iconos.

---

## 🚀 Requisitos Previos

- **Node.js**: v16+ (recomendado v18+)
- **npm** (o yarn/pnpm)
- **Git** (para clonar el repo)

---

## 🛠️ Instalación y Ejecución Local

1.  **Clona el repositorio:**

    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd <NOMBRE_DEL_REPOSITORIO>
    ```

2.  **Instala dependencias:**

    ```bash
    npm install
    ```

3.  **Variables de entorno (Opcional pero recomendado):**
    Crea un archivo `.env.local` en la raíz y añade tus endpoints:
    ```env
    VITE_AUTH_API=https://dev.apinetbo.bekindnetwork.com/api
    VITE_APP_API=https://dev.api.bekindnetwork.com/api/v1
        ```

4.  **Ejecuta en modo desarrollo:**
    ```bash
    npm run dev
    ```
    La app estará disponible en `http://localhost:5173`.

---

## 📦 Scripts Disponibles

- `npm run dev`: Inicia el servidor de desarrollo.
- `npm run build`: Construye la versión optimizada para producción.
- `npm run preview`: Previsualiza localmente la build de producción.

---

## 📚 Librerías Principales

- **React 18** & **TypeScript**
- **Vite**: Bundler y servidor de desarrollo.
- **Tailwind CSS**: Estilos mediante utilidades.
- **Axios**: Cliente HTTP con instancias configuradas (`authApi` y `appApi`).
- **React Router DOM**: Gestión de rutas y protección de navegación.
- **React Hook Form**: Manejo y validación eficiente de formularios.
- **Lucide React**: Set de iconos.

---

## 🧠 Decisiones Técnicas Importantes

- **Autenticación via Context:** Se implementó un `AuthContext` que gestiona el estado global. El token se guarda en `localStorage` bajo la key `"token"`.
- **Protección de Rutas:** El componente `ProtectedRoute` bloquea rutas privadas si el usuario no está autenticado.
- **Manejo de API:**
  - `appApi` incluye un interceptor para añadir el token `Bearer` automáticamente.
  - Manejo de `FormData`: El interceptor elimina el `Content-Type` en envíos de archivos para que el navegador asigne el boundary correcto.
  - **Error 401:** Redirección automática al login y limpieza de credenciales si el token expira.
- **Formularios:** `CreateAction` utiliza `FormData` para enviar: `name`, `description`, `status` ("1" o "0"), `color` (HEX) e `icon` (archivo binario).

---

## ⚠️ Notas y Supuestos

- **Endpoint de Login:** El código espera que el endpoint devuelva el token como un `string` plano. Si devuelve un objeto `{ token: '...' }`, se debe ajustar `Login.tsx`.
- **CORS:** Si hay errores de conexión local, verificar la configuración de CORS en el backend o configurar el proxy en `vite.config.ts`.
- **Validaciones:** Se aplican validaciones básicas en el cliente (longitud, formato HEX, requeridos).

---

## ✅ QA Checklist (Resumen)

Se recomienda verificar los siguientes puntos en cada despliegue:

1.  Login exitoso y persistencia al recargar página.
2.  Acceso denegado a `/dashboard` sin token.
3.  Listado correcto de acciones con paginación funcional.
4.  Creación de acción con subida de imagen (validar envío de multipart/form-data).
5.  Cierre de sesión manual y por error 401.

---

## 🚀 Posibles Mejoras

- Extraer URLs de API a variables de entorno de forma estricta.
- Añadir Toasts para feedback visual en errores.
- Implementar Refresh Token si el backend lo soporta.
- Cobertura de tests con Vitest.
