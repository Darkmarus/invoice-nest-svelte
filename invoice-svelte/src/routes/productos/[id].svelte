<script lang="ts">
  import { navigate, route } from 'sv-router/generated';
  import { onMount } from 'svelte';
  import { resolvedImages } from '../../stores/config_store';
  import { productsStore } from '../../stores/products_store';
  import type { ProductResponse } from '../../models/product_response';

  let product: ProductResponse | null = $state(null);
  let loading = $state(true);
  let error = $state<string | null>(null);
  let currentSlide = $state(0);
  let isPaused = $state(false);
  let autoplayInterval: ReturnType<typeof setInterval>;

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
    navigate('/');
  }

  function nextSlide() {
    if (product?.images) {
      currentSlide = (currentSlide + 1) % product.images.length;
    }
  }

  function prevSlide() {
    if (product?.images) {
      currentSlide = currentSlide === 0 ? product.images.length - 1 : currentSlide - 1;
    }
  }

  function goToSlide(index: number) {
    currentSlide = index;
  }

  $effect(() => {
    if (product?.images && product.images.length > 1 && !isPaused) {
      clearInterval(autoplayInterval);
      autoplayInterval = setInterval(nextSlide, 5000);
    } else {
      clearInterval(autoplayInterval);
    }
    return () => clearInterval(autoplayInterval);
  });

  $effect(() => {
    if (product?.images) {
      currentSlide = 0;
    }
  });
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
          <!-- Imágenes del producto en carrusel automático -->
          {#if product.images && product.images.length > 0}
            <div
              class="relative rounded-2xl overflow-hidden mb-8 bg-base-200 border border-base-300 shadow-lg"
              onmouseenter={() => (isPaused = true)}
              onmouseleave={() => (isPaused = false)}>
              <div class="relative aspect-[16/10] md:aspect-[3/2]">
                {#each product.images as image, index}
                  <div
                    class="absolute inset-0 transition-opacity duration-500 ease-in-out {index === currentSlide
                      ? 'opacity-100'
                      : 'opacity-0'}">
                    <img
                      src={resolvedImages(image.path)}
                      alt={product.name}
                      class="w-full h-full object-contain bg-base-200"
                      onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
                  </div>
                {/each}
                <!-- Botones de navegación -->
                {#if product.images.length > 1}
                  <button
                    onclick={prevSlide}
                    class="absolute left-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost bg-black/20 hover:bg-black/40 border-0 text-white backdrop-blur-sm transition-all duration-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>
                  <button
                    onclick={nextSlide}
                    class="absolute right-4 top-1/2 -translate-y-1/2 btn btn-circle btn-ghost bg-black/20 hover:bg-black/40 border-0 text-white backdrop-blur-sm transition-all duration-300">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                  <!-- Indicadores de posición -->
                  <div class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                    {#each product.images as _, index}
                      <button
                        onclick={() => goToSlide(index)}
                        class="w-2.5 h-2.5 rounded-full transition-all duration-300 {index === currentSlide
                          ? 'bg-primary w-6'
                          : 'bg-white/50 hover:bg-white/80'}"
                        aria-label={`Ir a imagen ${index + 1}`}></button>
                    {/each}
                  </div>
                  <!-- Barra de progreso -->
                  <div class="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                    <div
                      class="h-full bg-primary transition-all duration-[5000ms] ease-linear {isPaused ? 'paused' : ''}"
                      style:width="{((currentSlide + 1) / product.images.length) * 100}%">
                    </div>
                  </div>
                {/if}
              </div>
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
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"
                ></path>
              </svg>
              Volver a Productos
            </button>
            <button class="btn btn-primary">
              <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.1 5H19M7 13v8a2 2 0 002 2h10a2 2 0 002-2v-3"></path>
              </svg>
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
</div>

<style>
  .paused {
    animation-play-state: paused;
  }
</style>
