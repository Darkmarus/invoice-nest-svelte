<script lang="ts">
  let { product = {
    id: 0,
    name: "",
    price: 0,
    images: [] as string[],
    description: "",
    category: "",
  } } = $props();
</script>

<div
  class="card bg-base-100 shadow-xl hover:shadow-2xl transition-shadow duration-300"
>
  {#if product.images && product.images.length > 0}
    <figure class:hover-gallery={product.images.length != 1} class="px-4 pt-4">
      {#each product.images as image}
        <img
          src={image}
          alt={product.name}
          class="rounded-xl h-48 w-full object-cover"
        />
      {/each}
    </figure>
  {:else}
    <figure class="px-4 pt-4">
      <img
        src={"https://placehold.co/300x200"}
        alt={product.name}
        class="rounded-xl h-48 w-full object-cover"
      />
    </figure>
  {/if}

  <div class="card-body">
    <h2 class="card-title text-lg font-bold">{product.name}</h2>
    <p class="text-sm text-base-content/70">{product.description}</p>
    <div class="flex items-center justify-between">
      <span class="text-2xl font-bold text-primary"
        >${product.price.toFixed(2)}</span
      >
      <div class="badge badge-outline">{product.category}</div>
    </div>
    <div class="card-actions justify-end mt-4">
      <button class="btn btn-primary btn-sm">Añadir al carrito</button>
      <button class="btn btn-outline btn-sm">Ver detalles</button>
    </div>
  </div>
</div>
