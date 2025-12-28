<script lang="ts">
  import { navigate } from 'sv-router/generated';
  import { route } from 'sv-router/generated';
  import { onMount } from 'svelte';
  import { productsStore } from '../../stores/products_store';
  import { resolvedImages } from '../../stores/config_store';

  let product: any = $state(null);
  let loading = $state(true);
  let error = $state<string | null>(null);

  // Cargar datos del producto al montar el componente
  onMount(async () => {
    // Obtener el ID del producto desde los parámetros de la ruta
    const { id } = route.getParams('/productos/:id');

    if (id) {
      try {
        const fetchedProduct = await productsStore.fetchProduct(id);
        if (fetchedProduct) {
          product = fetchedProduct;
        } else {
          error = 'Producto no encontrado';
        }
      } catch (err) {
        error = 'Error al cargar el producto';
        console.error(err);
      }
    } else {
      error = 'ID de producto no proporcionado';
    }
    loading = false;
  });

  function handleBack() {
    navigate('/productos');
  }
</script>

<div class="container mx-auto">
  <div class="max-w-4xl mx-auto">
    <!-- Breadcrumb -->
    <div class="text-sm breadcrumbs mb-6">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li>Detalles del Producto</li>
      </ul>
    </div>

    {#if loading}
      <!-- Indicador de carga -->
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if error}
      <!-- Mensaje de error -->
      <div class="alert alert-error">
        <span>{error}</span>
      </div>
    {:else if product}
      <!-- Detalles del producto -->
      <div class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <!-- Imágenes del producto en carrusel -->
          {#if product.images && product.images.length > 0}
            <div class="carousel w-full mb-6">
              {#each product.images as imageUrl, i}
                {@const prev = i === 0 ? product.images.length - 1 : i - 1}
                {@const next = i === product.images.length - 1 ? 0 : i + 1}
                <div id="slide-{product.id}-{i}" class="carousel-item relative w-full">
                  <img
                    src={resolvedImages(imageUrl)}
                    alt={product.name}
                    class="rounded-xl h-64 w-full object-cover"
                    onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
                  <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                    <a href="#slide-{product.id}-{prev}" class="btn btn-circle">❮</a>
                    <a href="#slide-{product.id}-{next}" class="btn btn-circle">❯</a>
                  </div>
                </div>
              {/each}
            </div>
          {/if}

          <!-- Información del producto -->
          <h1 class="card-title text-3xl font-bold mb-4">{product.name}</h1>
          <p class="text-lg text-base-content/80 mb-4">{product.details}</p>
          <div class="flex items-center justify-between mb-4">
            <span class="text-4xl font-bold text-primary">${(product.price ?? 0).toFixed(2)}</span>
            <div class="badge badge-outline badge-lg">{product.category}</div>
          </div>
          <div class="text-sm text-base-content/60 mb-6">
            <p><strong>Stock disponible:</strong> {product.stock ?? 0} unidades</p>
          </div>

          <!-- Acciones -->
          <div class="card-actions justify-between">
            <button class="btn btn-ghost" onclick={handleBack}>
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
              </svg>
              Volver a Productos
            </button>
            <button class="btn btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
              </svg>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>