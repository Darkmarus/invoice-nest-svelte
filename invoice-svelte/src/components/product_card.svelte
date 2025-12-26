<script lang="ts">
  import { apiUrl } from '../stores/config_store';

  let {
    product = {
      id: '',
      name: '',
      price: 0,
      images: [] as string[],
      description: '',
      category: '',
    },
  } = $props();

  const resolvedImages = (path: string) => `${apiUrl()}/${path}`;

  let hash = $derived(() => {
    let h = 0;
    for (let c of product.id) h += c.charCodeAt(0);
    return h % 360;
  });

  let placeholderColor = $derived(`hsl(${hash()}, 70%, 40%)`);
</script>

<div class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300">
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
  {:else}
    <figure class="px-4 pt-4">
      <div
        class="rounded-xl h-48 w-full flex items-center justify-center text-white text-2xl font-bold"
        style:background-color={placeholderColor}>
        {product.name}
      </div>
    </figure>
  {/if}

  <div class="card-body">
    <h2 class="card-title text-lg font-bold">{product.name}</h2>
    <p class="text-sm text-base-content/70">{product.description}</p>
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary">${(product.price ?? 0).toFixed(2)}</span>
      <div class="badge badge-outline">{product.category}</div>
    </div>
    <div class="card-actions flex flex-col sm:flex-row justify-end gap-2 mt-4">
      <button class="btn btn-primary btn-sm">Añadir al carrito</button>
      <button class="btn btn-outline btn-sm">Ver detalles</button>
    </div>
  </div>
</div>
