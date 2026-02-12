# Frontend - Gestión Financiera (PrevalentWare)

Aplicación de gestión de ingresos y gastos con Next.js (Pages Router), TypeScript, Tailwind CSS, Shadcn/UI y Better Auth.

## Stack

- **Framework:** Next.js 14 (Pages Router) + TypeScript
- **Estilos:** Tailwind CSS + Shadcn/UI (Button, Table, Input, Dialog, Select, Card, etc.)
- **Gráficos:** Recharts
- **Auth:** Better Auth (cliente, proveedor GitHub)
- **Validación:** Zod + React Hook Form (sin validación HTML nativa en formularios admin)
- **Tests:** Vitest + Testing Library

## Requisitos

- Node.js 18+
- Backend corriendo (por defecto en `http://localhost:8000`)

## Instalación

```bash
npm install
```

## Comunicación con el backend (Next.js API routes)

El frontend cumple el requisito **"NextJS API routes para comunicación con el backend"** con una capa BFF (Backend for Frontend):

- **`src/pages/api/[[...path]].ts`**: ruta que hace proxy de las peticiones al backend (movements, users, reports). Reenvía método, headers (incl. cookie), body y query.
- Si está definida **`NEXT_PUBLIC_API_URL`**, el cliente llama al backend directamente (recomendado en desarrollo).
- Si **no** está definida, el cliente llama a las rutas `/api/*` del propio frontend y el proxy reenvía al backend usando la variable de servidor **`BACKEND_URL`** (recomendado en producción para no exponer la URL del backend en el cliente).

## Variables de entorno

Crea `.env.local` en la raíz del frontend:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

## Scripts

| Comando        | Descripción                         |
|----------------|-------------------------------------|
| `npm run dev`  | Servidor de desarrollo (puerto **3000**) |
| `npm run build`| Build de producción                |
| `npm start`    | Servidor en modo producción         |
| `npm run lint` | Linter ESLint                      |
| `npm test`     | Pruebas unitarias (Vitest)         |

## Despliegue en Vercel

1. En Vercel, crea un nuevo proyecto importando este repositorio (`Frontend-PrevalentWare-Prueba`).
2. En **Settings → Environment Variables**, añade:
   - `NEXT_PUBLIC_API_URL` con la URL pública del backend.  
     Ejemplo: `https://backend-prevalentware-prueba.vercel.app`
3. Deja la configuración por defecto de framework:
   - Framework: **Next.js**
   - Comando de build: `npm run build`
   - Comando de start: `npm start`
4. Haz clic en **Deploy**.  
   Al finalizar, Vercel mostrará la URL pública del frontend.

## Estructura

```
src/
├── core/           # Dominio y servicios (llamadas API)
├── pages/
│   └── api/        # BFF: proxy al backend ([[...path]].ts)
├── components/
│   ├── shared/     # Layout, Sidebar, paginación
│   ├── features/   # Movimientos, Usuarios, Reportes
│   ├── ui/         # Componentes Shadcn
│   └── hoc/        # withSession, withRole (RBAC)
├── hooks/          # useAuth, useRole
├── lib/            # auth-client, validaciones (Zod), utils
└── pages/          # Páginas (Home, Movimientos, Usuarios, Reportes, Login)
```

## Roles y rutas

- **Usuario (USER):** Solo accede a la gestión de movimientos (lectura).
- **Administrador (ADMIN):** Movimientos (CRUD), gestión de usuarios, reportes y descarga CSV.
- Home muestra enlaces según rol; `/users` y `/reports` están protegidos por `withRole(..., { requiredRole: "ADMIN" })`.

## Formularios (admin)

Los formularios de administración (edición de usuario, nuevo/editar movimiento) usan:

- **Validación con Zod** (sin atributos HTML `required`, `min`, `max`, `pattern`).
- **React Hook Form** con `zodResolver`.
- **Alertas:** mensajes bajo cada campo y toasts (Sonner) en caso de error de validación o fallo de guardado.

