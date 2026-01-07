<script lang="ts">
  import { navigateUtils } from '../../utils/navigate-utils';
  import ProductForm from '../../components/product_form.svelte';
  import { productsStore } from '../../stores/products_store';

  let newProduct = $state({
    name: '',
    price: 0,
    stock: 0,
    details: '',
    images: [] as File[],
  });

  async function handleSave() {
    try {
      await productsStore.create(newProduct);
      newProduct = { name: '', price: 0, stock: 0, details: '', images: [] as File[] };
      navigateUtils.goProducts();
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancel() {
    navigateUtils.goProducts();
  }
</script>

<div class="container mx-auto">
  <div class="max-w-4xl mx-auto">
    <!-- Breadcrumb -->
    <div class="text-sm breadcrumbs mb-6">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
        <li>Crear Producto</li>
      </ul>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl md:text-3xl mb-6">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
          </svg>
          Crear Nuevo Producto
        </h2>

        <ProductForm bind:newProduct />

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-ghost" onclick={handleCancel}>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
          <button class="btn btn-primary" onclick={handleSave}>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Crear Producto
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
