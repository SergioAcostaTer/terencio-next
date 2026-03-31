# Terencio Cash Market - Next.js Internal System

Proyecto Next.js 16 con App Router que combina:

- Landing page y contenido marketing existente
- Formulario público de alta de socios en `/register`
- Backoffice interno en `/backoffice`
- Pantalla Smart TV en `/display`

## Stack

- Next.js 16
- React 19
- Tailwind CSS v4
- Prisma 7
- Neon PostgreSQL
- Cloudflare R2
- Self-auth con cookie HTTP-only
- React Hook Form + Zod
- Nodemailer

## Requisitos

- Node.js 20.9 o superior
- pnpm
- Base de datos Neon PostgreSQL
- Bucket Cloudflare R2
- Credenciales SMTP para el envío de emails

## Instalación

1. Instala dependencias:

```bash
pnpm install
```

2. Crea el archivo de entorno a partir del ejemplo:

```bash
cp .env.example .env
```

En Windows PowerShell:

```powershell
Copy-Item .env.example .env
```

3. Rellena todas las variables de entorno.

## Variables de entorno

### Base de datos Neon

- `DATABASE_URL`: cadena principal de conexión a Neon
- `DIRECT_URL`: segunda URL requerida por el proyecto y reservada para flujos de migración/administración

Ejemplo Neon:

```env
DATABASE_URL="postgresql://USER:PASSWORD@ep-xxxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
DIRECT_URL="postgresql://USER:PASSWORD@ep-xxxxxx.eu-central-1.aws.neon.tech/neondb?sslmode=require"
```

### Cloudflare R2

- `R2_ACCOUNT_ID`
- `R2_ACCESS_KEY_ID`
- `R2_SECRET_ACCESS_KEY`
- `R2_BUCKET_NAME`
- `R2_PUBLIC_BASE_URL`
- `R2_ENDPOINT`

El proyecto sube archivos a estas carpetas:

- `memberships/`
- `slides/`

### Auth

- `AUTH_SECRET`: mínimo 32 caracteres
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

El usuario admin se crea o actualiza con el seed.

### App

- `APP_BASE_URL`: normalmente `http://localhost:3000` en local

### Email SMTP

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASSWORD`
- `SMTP_FROM`
- `SMTP_SECURE`

Sin SMTP no se podrá completar el envío de notificaciones del formulario de socios.

## Configurar Neon

1. Crea un proyecto en Neon.
2. Crea una base de datos PostgreSQL.
3. Copia la connection string de Neon.
4. Pega esa URL en `DATABASE_URL` y `DIRECT_URL`.
5. Mantén `sslmode=require`.

## Configurar R2

1. Crea un bucket en Cloudflare R2.
2. Genera Access Key ID y Secret Access Key.
3. Configura un dominio público o URL pública para leer los archivos.
4. Rellena `R2_PUBLIC_BASE_URL` y `R2_ENDPOINT`.

## Prisma

1. Genera el cliente:

```bash
pnpm prisma generate
```

2. Crea la migración inicial y aplícala:

```bash
pnpm db:migrate --name init
```

Si prefieres el comando Prisma directo:

```bash
pnpm prisma migrate dev --name init
```

3. Crea el usuario administrador:

```bash
pnpm db:seed
```

## Desarrollo

Arranca el proyecto:

```bash
pnpm dev
```

Abre:

- `http://localhost:3000/`
- `http://localhost:3000/register`
- `http://localhost:3000/backoffice/login`
- `http://localhost:3000/display`

## Producción

Antes de desplegar:

1. Configura todas las variables de entorno reales.
2. Ejecuta migraciones.
3. Ejecuta el seed para garantizar el admin inicial.
4. Verifica acceso a Neon, R2 y SMTP.

## Notas funcionales

- `/ofertas` redirige a `/`
- El backoffice protege rutas con cookie HTTP-only y `src/proxy.ts`
- Las diapositivas activas se sirven desde `/api/slides`
- La pantalla `/display` hace polling periódico para refrescar el carrusel

## Contenido editorial

Los artículos y noticias siguen gestionándose con Markdown en `/content`.
