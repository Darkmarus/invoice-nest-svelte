<script lang="ts">
  import { onMount } from 'svelte';
  import ProductCard from './product_card.svelte';
  import Pagination from './pagination.svelte';
  import { productsStore } from '../stores/products_store';

  const itemsPerPage = 6;

  // Initial fetch
  onMount(() => {
    productsStore.fetch({
      page: 1,
      limit: itemsPerPage,
    });
  });

  function handlePageChange(page: number) {
    productsStore.fetch({
      page,
      limit: itemsPerPage,
    });
  }
</script>

<section class="">
  <div class="container mx-auto">
    {#if $productsStore.loading}
      <div class="flex justify-center">
        <span class="loading loading-spinner loading-lg"></span>
      </div>
    {:else if $productsStore.error}
      <div class="alert alert-error">
        <span>{$productsStore.error}</span>
      </div>
    {:else}
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {#each $productsStore.data as product (product.id)}
          <ProductCard {product} />
        {/each}
      </div>

      <Pagination
        currentPage={$productsStore.page}
        totalPages={$productsStore.totalPages}
        totalItems={$productsStore.total}
        itemsPerPage={$productsStore.limit}
        itemName="productos"
        onPageChange={handlePageChange} />
    {/if}
  </div>
</section>
