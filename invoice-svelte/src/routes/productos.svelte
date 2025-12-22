<script lang="ts">
  import FormModal from '../components/form_modal.svelte';
  import ProductFilters from '../components/product_filters.svelte';
  import ProductTable from '../components/product_table.svelte';
  import ProductCards from '../components/product_cards.svelte';
  import ProductForm from '../components/product_form.svelte';
  import { productsStore } from '../stores/products_store';


  let showModal = $state(false);
  let searchValue = $state('');
  let newProduct = $state({
    name: '',
    price: 0,
    stock: 0,
  });

  // Reactive effect for search changes
  $effect(() => {
    productsStore.fetch({
      page: 1,
      limit: 10,
      name: searchValue || undefined,
    });
  });

  async function handleSave() {
    try {
      await productsStore.create(newProduct);
      newProduct = { name: '', price: 0, stock: 0 };
      showModal = false;
    } catch (err) {
      console.error(err);
    }
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
      <button class="btn btn-primary btn-sm md:btn" onclick={() => (showModal = true)}> Nuevo Producto </button>
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
    {#if $productsStore.totalPages > 1}
      <div class="flex justify-center mt-8">
        <div class="join">
          <button
            class="join-item btn"
            disabled={$productsStore.page === 1}
            onclick={() => goToPage($productsStore.page - 1)}>
            «
          </button>
          {#each Array($productsStore.totalPages) as _, i}
            <button
              class="join-item btn"
              class:btn-active={$productsStore.page === i + 1}
              onclick={() => goToPage(i + 1)}>
              {i + 1}
            </button>
          {/each}
          <button
            class="join-item btn"
            disabled={$productsStore.page === $productsStore.totalPages}
            onclick={() => goToPage($productsStore.page + 1)}>
            »
          </button>
        </div>
      </div>
    {/if}
  {/if}

  <FormModal
    bind:isOpen={showModal}
    title="Nuevo Producto"
    confirmText="Crear"
    cancelText="Cancelar"
    onConfirm={handleSave}
    onCancel={() => (showModal = false)}>
    <ProductForm bind:newProduct />
  </FormModal>
</div>
