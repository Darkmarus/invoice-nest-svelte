<script lang="ts">
  // Importa la función para resolver URLs de imágenes
  import { resolvedImages } from '../stores/config_store';

  // Props del componente: producto a mostrar
  let {
    product = {
      id: '',
      name: '',
      details: '',
      price: 0,
      images: [] as string[],
      description: '',
      category: '',
    },
  } = $props();

  // Calcula un hash para el color de placeholder basado en el ID del producto
  let hash = $derived(() => {
    let h = 0;
    for (let c of product.id) h += c.charCodeAt(0);
    return h % 360;
  });

  // Color de placeholder derivado del hash
  let placeholderColor = $derived(`hsl(${hash()}, 70%, 40%)`);
</script>

<!-- Tarjeta del producto con efectos de hover -->
<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
  <!-- Si el producto tiene imágenes, mostrar carrusel -->
  {#if product.images && product.images.length > 0}
    <figure class:hover-gallery={product.images.length != 1} class="px-4 pt-4">
      {#each product.images as imageUrl}
        <img
          src={resolvedImages(imageUrl)}
          alt={product.name}
          class="rounded-xl h-48 w-full object-cover"
          onerror={(e) => ((e.target as HTMLImageElement).src = '/not_found.svg')} />
      {/each}
    </figure>
    <!-- Si no hay imágenes, mostrar placeholder -->
  {:else}
    <!-- Figura con placeholder de color -->
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
    <p class="text-sm text-base-content/70">{product.details}</p>
    <!-- Precio y categoría -->
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary">${(product.price ?? 0).toFixed(2)}</span>
      <div class="badge badge-outline">{product.category}</div>
    </div>
    <!-- Acciones de la tarjeta -->
    <div class="card-actions flex flex-col sm:flex-row justify-end gap-2 mt-4">
      <button class="btn btn-primary btn-sm">Añadir al carrito</button>
      <a href="/productos/{product.id}" class="btn btn-outline btn-sm">Ver detalles</a>
    </div>
  </div>
</div>
