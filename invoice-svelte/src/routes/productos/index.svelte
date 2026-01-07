<script lang="ts">
  import type { ProductResponse } from 'src/models/product_response';
  import { navigateUtils } from '../../utils/navigate-utils';
  import { onMount } from 'svelte';
  import { Debounce } from '../../utils/debounce';
  import Pagination from '../../components/pagination.svelte';
  import ProductCards from '../../components/product_cards.svelte';
  import ProductTable from '../../components/product_table.svelte';
  import { productsStore } from '../../stores/products_store';

  let searchValue = $state('');
  const debounce = new Debounce(300);

  // Initial fetch
  onMount(() => {
    productsStore.fetch({
      page: 1,
      limit: 10,
    });
  });

  function goToCreate() {
    navigateUtils.goCreateProduct();
  }

  function goToPage(page: number) {
    productsStore.fetch({
      page,
      limit: 10,
      name: ($productsStore as any).searchQuery || undefined,
    });
  }
  async function handleDelete(product: ProductResponse) {
    const confirmed = confirm(
      `¿Estás seguro de que quieres eliminar el producto "${product.name}"? Esta acción no se puede deshacer.`
    );
    if (confirmed) {
      try {
        await productsStore.delete(product.id);
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Error al eliminar el producto. Por favor, inténtalo de nuevo.');
      }
    }
  }
</script>

<div class="space-y-6">
  <div class="mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl font-bold text-base-content">Gestión de Productos</h1>
      <button class="btn btn-primary btn-sm md:btn" onclick={goToCreate}> Nuevo Producto </button>
    </div>
  </div>

  <div class="form-control mb-4">
    <input
      type="text"
      placeholder="Buscar productos..."
      class="input input-bordered w-full"
      value={searchValue}
      oninput={(e) => {
        searchValue = (e.target as HTMLInputElement).value;
        debounce.call(() => (productsStore as any).setSearchQuery(searchValue));
      }} />
  </div>

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
      <ProductTable products={$productsStore.data} {handleDelete} />
    </div>

    <!-- Card view for mobile -->
    <div class="block md:hidden">
      <ProductCards products={$productsStore.data} {handleDelete} />
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
