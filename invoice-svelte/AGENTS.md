# AGENTS.md

## Descripción del Proyecto

Invoice-Svelte es una aplicación web para la gestión de productos e inventario con interfaz de usuario moderna. Permite a los usuarios crear, editar, visualizar y eliminar productos con soporte para gestión de imágenes, paginación y filtros avanzados.

## Stack Tecnológico

- **Frontend Framework**: Svelte 5 (latest version with runes)
- **Language**: TypeScript
- **Build Tool**: Vite (rolldown-vite)
- **Styling**: Tailwind CSS 4 + DaisyUI 5
- **Routing**: sv-router (file-based routing)
- **Image Processing**: svelte-easy-crop
- **Development**: Prettier + Svelte Check

## Comandos Disponibles

```bash
npm run dev      # Inicia servidor de desarrollo (--host)
npm run build    # Compila para producción
npm run preview  # Previsualiza build de producción
npm run format   # Formatea código con Prettier
npm run check    # Ejecuta type checking con svelte-check y tsc
```

## Estructura del Proyecto

**Nota**: Todos los nombres de archivos siguen el estándar `kebab-case` (palabras separadas por guiones).

```
src/
├── app.svelte                  # Entry point de la aplicación
├── main.ts                     # Inicialización
├── components/                 # Componentes reutilizables
│   ├── layout.svelte          # Layout principal
│   ├── header.svelte          # Header de navegación
│   ├── product_form.svelte    # Formulario de producto
│   ├── product_card.svelte    # Tarjeta de producto
│   ├── product_cards.svelte   # Grid de tarjetas
│   ├── product_table.svelte   # Tabla de productos
│   ├── product_grid.svelte    # Grid de productos
│   ├── product_filters.svelte # Filtros de búsqueda
│   ├── product_image_manager.svelte # Gestor de imágenes
│   ├── pagination.svelte      # Componente de paginación
│   └── form_modal.svelte      # Modal de formulario
├── routes/                     # Rutas de la aplicación
│   ├── index.svelte           # Home
│   └── productos/
│       ├── index.svelte       # Listado de productos
│       ├── crear.svelte       # Crear producto
│       ├── editar.[id].svelte # Editar producto
│       └── [id].svelte        # Detalle de producto
├── api/                        # Capa de API
│   ├── fetch_wrapper.ts       # Cliente HTTP con retry logic
│   └── products_api.ts        # API de productos
├── stores/                     # Estado global
│   ├── config_store.ts        # Configuración de API
│   └── products_store.ts      # Store de productos
└── models/                     # Tipos TypeScript
    ├── product_response.ts    # Modelos de respuesta
    └── product_request.ts     # Modelos de solicitud
```

## Modelos de Datos

### ProductResponse

- `id`: string - Identificador único
- `name`: string - Nombre del producto
- `details`: string - Descripción detallada
- `stock`: number - Cantidad en inventario
- `price`: number - Precio unitario
- `enabled`: boolean - Estado de habilitación
- `created_at`: string - Fecha de creación
- `updated_at`: string - Fecha de actualización
- `description?`: string - Descripción opcional
- `category?`: string - Categoría opcional
- `images?`: FileResponse[] - Array de imágenes

### CreateProductRequest

- `name`: string
- `price`: number
- `stock`: number
- `details`: string
- `images?`: File[] - Array de archivos de imagen

### UpdateProductRequest

- `name?`: string
- `price?`: number
- `stock?`: number
- `details?`: string
- `enabled?`: boolean

## Configuración Dinámica

La aplicación carga su configuración desde `/config.json` al inicio:

```json
{
  "apiUrl": "https://api.ejemplo.com"
}
```

## API Endpoints

- `GET /products` - Listar productos (con paginación y filtros)
- `POST /products` - Crear producto (multipart/form-data)
- `GET /products/:id` - Obtener producto por ID
- `PUT /products/:id` - Actualizar producto
- `DELETE /products/:id` - Eliminar producto

## Parámetros de Filtro

- `page`: número de página (default: 1)
- `limit`: items por página (default: 10)
- `name`: filtro por nombre
- `minPrice`: precio mínimo
- `maxPrice`: precio máximo
- `enabled`: estado de habilitación
- `sortBy`: campo de ordenamiento (name|price|stock|created_at|updated_at)
- `sortOrder`: dirección de ordenamiento (ASC|DESC)

## Gestión de Estado

### configStore

Maneja la configuración de la API y estado de carga inicial.

### productsStore

Maneja el estado de productos con las siguientes operaciones:

- `fetch(params)` - Cargar productos con filtros
- `fetchProduct(id)` - Obtener un producto específico
- `create(data)` - Crear nuevo producto
- `update(id, data)` - Actualizar producto
- `delete(id)` - Eliminar producto

## Cliente HTTP

El `ApiClient` incluye:

- Retry logic (3 intentos con exponential backoff)
- Manejo de errores tipado (ApiError)
- Soporte para JSON y FormData
- Tipado genérico de respuestas

## Estilos

- Uso de utilidades de Tailwind CSS
- Componentes de DaisyUI
- Diseño responsive
- Sistema de colores coherente

## Linting y Type Checking

```bash
npm run check    # Ejecutar svelte-check y tsc
npm run format   # Formatear código con Prettier
```
