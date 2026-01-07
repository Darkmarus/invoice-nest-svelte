<script lang="ts">
  import type { FileResponse, ProductResponse } from 'src/models/product_response';
  import { resolvedImages } from '../stores/config_store';
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';

  let {
    product = {
      id: '',
      name: '',
      details: '',
      price: 0,
      images: [] as FileResponse[],
      description: '',
      category: '',
    } as ProductResponse,
  } = $props();

  let hash = $derived(() => {
    let h = 0;
    for (let c of product.id) h += c.charCodeAt(0);
    return h % 360;
  });

  let placeholderColor = $derived(`hsl(${hash()}, 70%, 40%)`);

  let currentImageIndex = $state(0);
  let isAnimating = $state(false);

  $effect(() => {
    if (product.images && product.images.length > 0) {
      currentImageIndex = 0;
    }
  });

  function nextImage() {
    if (product.images && product.images.length > 1 && !isAnimating) {
      const images = product.images;
      isAnimating = true;
      setTimeout(() => {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        setTimeout(() => {
          isAnimating = false;
        }, 500);
      }, 50);
    }
  }
</script>

<!-- Tarjeta del producto con efectos de hover -->
<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
  {#if product.images && product.images.length > 0}
    <figure class="px-4 pt-4">
      <div class="relative h-48 w-full">
        {#each product.images as image, index (index)}
          {#if index === currentImageIndex}
            <button
              type="button"
              class="absolute inset-0 w-full h-full p-0 border-0 bg-transparent cursor-pointer z-30 focus:outline-none"
              transition:fly={{ x: -200, y: 50, duration: 500 }}
              onclick={nextImage}
              ontouchend={nextImage}
              aria-label="Ver siguiente imagen">
              <img
                src={resolvedImages(image.path)}
                alt={product.name}
                class="w-full h-full object-cover rounded-xl pointer-events-none"
                onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
            </button>
          {:else if product.images && index === (currentImageIndex + 1) % product.images.length}
            <img
              src={resolvedImages(image.path)}
              alt={product.name}
              class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-80 scale-95 rotate-3 translate-x-4 translate-y-2 shadow-xl z-20"
              transition:fly={{ x: 0, y: 0, duration: 300 }}
              onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
          {:else if product.images && index === (currentImageIndex + 2) % product.images.length}
            <img
              src={resolvedImages(image.path)}
              alt={product.name}
              class="absolute inset-0 w-full h-full object-cover rounded-xl opacity-60 scale-90 rotate-6 translate-x-8 translate-y-4 shadow-xl z-10"
              transition:fly={{ x: 0, y: 0, duration: 300 }}
              onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
          {/if}
        {/each}
      </div>
    </figure>
  {:else}
    <figure class="px-4 pt-4">
      <div
        class="rounded-xl h-48 w-full flex items-center justify-center text-white text-2xl font-bold"
        style:background-color={placeholderColor}>
        {product.name}
      </div>
    </figure>
  {/if}

  <!-- Cuerpo de la tarjeta con información del producto -->
  <div class="card-body">
    <!-- Título del producto -->
    <h2 class="card-title text-lg font-bold">{product.name}</h2>
    <!-- Descripción del producto -->
    <!-- <p class="text-sm text-base-content/70">{product.details}</p> -->
    <!-- Precio y categoría -->
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary">${(product.price ?? 0).toFixed(2)}</span>
      <!-- <div class="badge badge-outline">{product.category}</div> -->
    </div>
    <!-- Acciones de la tarjeta -->
    <div class="card-actions flex flex-col sm:flex-row justify-end gap-2 mt-4">
      <!-- <button class="btn btn-primary btn-sm">Añadir al carrito</button> -->
      <a href="/productos/{product.id}" class="btn btn-outline btn-sm">Ver detalles</a>
    </div>
  </div>
</div>
