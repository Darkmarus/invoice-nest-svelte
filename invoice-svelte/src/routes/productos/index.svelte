<script lang="ts">
  import { navigate } from 'sv-router/generated';
  import { onMount } from 'svelte';
  import Pagination from '../../components/pagination.svelte';
  import ProductCards from '../../components/product_cards.svelte';
  import ProductFilters from '../../components/product_filters.svelte';
  import ProductTable from '../../components/product_table.svelte';
  import { productsStore } from '../../stores/products_store';

  let searchValue = $state('');

  // Initial fetch
  onMount(() => {
    productsStore.fetch({
      page: 1,
      limit: 10,
    });
  });

  // Reactive effect for search changes
  $effect(() => {
    productsStore.fetch({
      page: 1,
      limit: 10,
      name: searchValue || undefined,
    });
  });

  function goToCreate() {
    navigate('/productos/crear');
  }

  function goToPage(page: number) {
    productsStore.fetch({
      page,
      limit: 10,
      name: searchValue || undefined,
    });
  }
</script>

<div class="space-y-6">
  <div class="mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl font-bold text-base-content">Gestión de Productos</h1>
      <button class="btn btn-primary btn-sm md:btn" onclick={goToCreate}> Nuevo Producto </button>
    </div>
  </div>

  <ProductFilters bind:searchValue />

  {#if $productsStore.loading}
    <div class="flex justify-center">
      <span class="loading loading-spinner loading-lg"></span>
    </div>
  {:else if $productsStore.error}
    <div class="alert alert-error">
      <span>{$productsStore.error}</span>
    </div>
  {:else}
    <!-- Table view for desktop -->
    <div class="hidden md:block">
      <ProductTable products={$productsStore.data} />
    </div>

    <!-- Card view for mobile -->
    <div class="block md:hidden">
      <ProductCards products={$productsStore.data} />
    </div>

    <!-- Pagination -->
    <Pagination
      currentPage={$productsStore.page}
      totalPages={$productsStore.totalPages}
      totalItems={$productsStore.total}
      itemsPerPage={$productsStore.limit}
      itemName="productos"
      onPageChange={goToPage} />
  {/if}
</div>
