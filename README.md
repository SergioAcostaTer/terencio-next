# Terencio Cash Market - Next.js Internal System

Proyecto Next.js 16 con App Router que combina:

- Web pública y contenido marketing
- Formularios públicos de contacto, profesionales, newsletter y alta de socios
- Backoffice interno en `/backoffice`
- Pantalla Smart TV en `/display`

## Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Prisma 7
- PostgreSQL
- Cloudflare R2
- Nodemailer
- React Hook Form + Zod
- Auth interna con cookie HTTP-only

## Requisitos

- Node.js 20.9 o superior
- pnpm
- Base de datos PostgreSQL accesible desde la app
- 2 buckets en Cloudflare R2:
  - 1 público para slides
  - 1 privado para documentos de usuarios
- Credenciales SMTP válidas

## Qué hace el sistema

- `/` sirve la web pública
- `/contacto` guarda consultas en base de datos y envía notificación por email
- `/profesionales` guarda solicitudes comerciales y envía notificación por email
- La newsletter guarda suscripciones en base de datos y envía notificación por email
- `/register` guarda altas de socios, sube documentación a R2 privado y permite verla desde backoffice con presigned URLs
- `/backoffice` permite gestionar solicitudes y slides
- `/display` muestra las slides activas del supermercado

## Estructura funcional

- `src/app/api/contact/route.ts`: formulario de contacto
- `src/app/api/professional/route.ts`: formulario de profesionales
- `src/app/api/newsletter/route.ts`: newsletter
- `src/app/api/memberships/submit/route.ts`: alta de socios
- `src/app/api/memberships/[id]/files/[fileType]/route.ts`: acceso autenticado a documentos privados
- `src/app/api/slides/route.ts`: listado y alta de slides
- `src/app/api/slides/[id]/route.ts`: edición y borrado de slides
- `src/app/backoffice/(protected)/*`: panel interno
- `src/lib/r2.ts`: subida, borrado y firma de archivos R2
- `src/lib/mail.ts`: envío SMTP
- `prisma/schema.prisma`: modelos de base de datos

## Puesta en marcha

### 1. Instalar dependencias

```bash
pnpm install
```

### 2. Crear `.env`

En Linux/macOS:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

### 3. Configurar variables de entorno

Rellena todas las variables del `.env`.

Ejemplo base:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"

R2_ACCOUNT_ID="..."
R2_ACCESS_KEY_ID="..."
R2_SECRET_ACCESS_KEY="..."
R2_PUBLIC_BUCKET_NAME="terencio-public"
R2_PRIVATE_BUCKET_NAME="terencio-private"
R2_PUBLIC_BASE_URL="https://public-cdn.example.com"
R2_ENDPOINT="https://<account-id>.r2.cloudflarestorage.com"
R2_PRIVATE_URL_EXPIRES_SECONDS="900"

AUTH_SECRET="una-clave-larga-de-al-menos-32-caracteres"
ADMIN_EMAIL="admin@example.com"
ADMIN_PASSWORD="cambia-esto"

APP_BASE_URL="http://localhost:3000"

SMTP_HOST="smtp.example.com"
SMTP_PORT="587"
SMTP_USER="user@example.com"
SMTP_PASSWORD="..."
SMTP_FROM="info@kitcash.es"
SMTP_SECURE="false"
```

## Variables de entorno

### Base de datos

- `DATABASE_URL`: URL PostgreSQL estándar

Usa formato Prisma/Node:

```env
DATABASE_URL="postgresql://USER:PASSWORD@HOST:5432/DATABASE?sslmode=require"
```

No uses formato JDBC (`jdbc:postgresql://...`), porque este proyecto corre sobre Node.js y Prisma.

### Cloudflare R2

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_PUBLIC_BUCKET_NAME`
- `R2_PRIVATE_BUCKET_NAME`
- `R2_PUBLIC_BASE_URL`
- `R2_ENDPOINT`
- `R2_PRIVATE_URL_EXPIRES_SECONDS` opcional, por defecto `900`

Uso actual:

- Bucket público: slides del display
- Bucket privado: documentos de membresías

### Auth interna

- `AUTH_SECRET`: mínimo 32 caracteres
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

El seed crea o actualiza este usuario administrador.

### App

- `APP_BASE_URL`

En local normalmente:

```env
APP_BASE_URL="http://localhost:3000"
```

### SMTP

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `SMTP_SECURE`

Sin SMTP los formularios no podrán completar el envío de avisos por correo.

## Configuración por servicio

### PostgreSQL

1. Crea una base de datos PostgreSQL.
2. Copia la URL de conexión en `DATABASE_URL`.
3. Mantén `sslmode=require` si tu proveedor lo requiere.

### Cloudflare R2

1. Crea 2 buckets:
   - uno público para slides
   - uno privado para documentación de usuarios
2. Genera Access Key ID y Secret Access Key con permisos sobre ambos.
3. Configura `R2_ENDPOINT`.
4. Configura `R2_PUBLIC_BASE_URL` apuntando al bucket/CDN público.
5. Guarda los nombres reales en:
   - `R2_PUBLIC_BUCKET_NAME`
   - `R2_PRIVATE_BUCKET_NAME`

### SMTP

1. Usa una cuenta SMTP real.
2. Configura `SMTP_FROM` con un remitente válido.
3. Verifica que el servidor permita envíos desde la app.

## Base de datos y Prisma

### 1. Generar cliente Prisma

```bash
pnpm db:generate
```

### 2. Aplicar esquema a la base de datos

Si estás desarrollando localmente:

```bash
pnpm db:migrate --name init
```

Si ya tienes la base preparada y solo quieres sincronizar el esquema:

```bash
npx prisma db push
```

### 3. Crear el usuario admin inicial

```bash
pnpm db:seed
```

Esto crea o actualiza el admin con `ADMIN_EMAIL` y `ADMIN_PASSWORD`.

## Arrancar en desarrollo

```bash
pnpm dev
```

URLs útiles:

- `http://localhost:3000/`
- `http://localhost:3000/contacto`
- `http://localhost:3000/profesionales`
- `http://localhost:3000/register`
- `http://localhost:3000/backoffice/login`
- `http://localhost:3000/display`

## Flujo recomendado de arranque desde cero

1. `pnpm install`
2. Copiar `.env.example` a `.env`
3. Rellenar PostgreSQL, R2, SMTP y credenciales admin
4. `pnpm db:generate`
5. `npx prisma db push` o `pnpm db:migrate --name init`
6. `pnpm db:seed`
7. `pnpm dev`
8. Entrar en `/backoffice/login`

## Build de producción

```bash
pnpm build
pnpm start
```

Antes de desplegar:

1. Configura todas las variables reales
2. Verifica acceso a PostgreSQL
3. Verifica acceso a los dos buckets de R2
4. Verifica SMTP
5. Aplica el esquema de Prisma
6. Ejecuta el seed del admin

## Backoffice

Secciones actuales:

- Consultas web
- Memberships
- Slides

Autenticación:

- login por email y contraseña admin
- sesión con cookie HTTP-only
- protección de rutas en `src/proxy.ts`

## Gestión de archivos

### Slides

- se suben al bucket público
- se guardan con URL pública directa
- el display consume esas URLs

### Documentos de memberships

- se suben al bucket privado
- no se exponen con URL pública
- el backoffice abre una ruta autenticada interna
- esa ruta genera una presigned URL temporal

## Emails

Se envían notificaciones SMTP para:

- contacto
- profesionales
- newsletter
- memberships

Los destinatarios salen del contenido/configuración interna de la app.

## Contenido editorial

Los artículos y noticias se gestionan con Markdown en:

- `content/blog`

## Scripts disponibles

```bash
pnpm dev
pnpm build
pnpm start
pnpm lint
pnpm db:generate
pnpm db:migrate
pnpm db:seed
```

## TODO

- Añadir migraciones versionadas si se quiere evitar `db push` en ciertos entornos
- Añadir gestión de estado para consultas y memberships desde backoffice
- Añadir borrado o archivado de consultas
- Añadir paginación y filtros en backoffice
- Añadir tests de integración para formularios y APIs
- Añadir validación operativa de configuración al arranque
- Añadir documentación de despliegue en el proveedor final
