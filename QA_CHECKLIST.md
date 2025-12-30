# QA_CHECKLIST.md

## Checklist de Pruebas Funcionales – Aplicación React (BeKind Network)

### Alcance

Validar el flujo funcional completo de la aplicación:

* Autenticación (Login)
* Protección de rutas
* Listado de categorías
* Búsqueda y paginación
* Creación de una nueva acción

---

## 1\. Autenticación (Login)

### TC-01: Login exitoso con credenciales válidas

**Precondición:** Usuario registrado y activo  
**Pasos:**

1. Ingresar correo válido
2. Ingresar contraseña correcta
3. Presionar botón "Ingresar"

**Resultado esperado:**

* Se recibe token desde la API
* El token se guarda en localStorage
* El usuario es redirigido al Dashboard

---

### TC-02: Login fallido con credenciales incorrectas

**Pasos:**

1. Ingresar correo válido
2. Ingresar contraseña incorrecta
3. Presionar "Ingresar"

**Resultado esperado:**

* Se muestra mensaje de error
* No se guarda token
* El usuario permanece en /login

---

### TC-03: Validación de campos obligatorios en Login

**Pasos:**

1. Enviar formulario vacío

**Resultado esperado:**

* Se muestran mensajes de validación
* No se realiza la petición a la API

---

### TC-04: Protección de rutas privadas

**Pasos:**

1. Acceder manualmente a /dashboard sin token

**Resultado esperado:**

* Redirección automática a /login

---

## 2\. Dashboard – Listado de Categorías

### TC-05: Carga inicial del listado

**Precondición:** Usuario autenticado  
**Pasos:**

1. Ingresar al Dashboard

**Resultado esperado:**

* Se muestra la tabla con categorías
* Se renderizan nombre, estado, descripción y fecha

---

### TC-06: Visualización correcta del estado (Activo / Inactivo)

**Resultado esperado:**

* Status = 1 → etiqueta "Activo"
* Status = 0 → etiqueta "Inactivo"
* Colores correctos según estado

---

## 3\. Paginación

### TC-07: Cambio de cantidad de registros por página

**Pasos:**

1. Cambiar "Resultados por página" (5 / 10 / 20)

**Resultado esperado:**

* El listado se actualiza correctamente
* Se reinicia a la página 1

---

### TC-08: Navegación entre páginas

**Pasos:**

1. Usar botones siguiente/anterior

**Resultado esperado:**

* Cambia el contenido de la tabla
* Los botones se deshabilitan cuando corresponde

---

## 4\. Creación de Acción

### TC-09: Acceso a formulario de creación

**Pasos:**

1. Click en "Crear tipo de categoría"

**Resultado esperado:**

* Se abre el modal/formulario CreateAction

---

### TC-10: Validación de campos obligatorios

**Pasos:**

1. Enviar formulario sin nombre, descripción o logo

**Resultado esperado:**

* Se muestran errores de validación
* No se envía la información a la API

---

### TC-11: Creación exitosa de una nueva acción

**Pasos:**

1. Completar todos los campos correctamente
2. Subir un icono válido
3. Presionar "Crear Acción"

**Resultado esperado:**

* La API responde correctamente
* Se muestra mensaje de éxito
* Redirección automática al Dashboard
* La nueva acción aparece en el listado

---

## 5\. Manejo de Sesión

### TC-12: Expiración o token inválido (401)

**Pasos:**

1. Forzar token inválido
2. Realizar petición protegida

**Resultado esperado:**

* Se elimina el token
* Redirección automática a /login

---

## Estado Final

✅ Flujo funcional completo validado  
✅ Cumple con criterios de autenticación, seguridad, usabilidad y manejo de errores

---

