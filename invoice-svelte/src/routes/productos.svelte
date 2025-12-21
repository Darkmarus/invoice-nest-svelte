<script lang="ts">
  import FormModal from '../components/form_modal.svelte';
  import ProductFilters from '../components/product_filters.svelte';
  import ProductTable from '../components/product_table.svelte';
  import ProductCards from '../components/product_cards.svelte';
  import ProductForm from '../components/product_form.svelte';

  let showModal = $state(false);
  let searchValue = $state('');
  let categoryValue = $state('');
  let newProduct = $state({
    name: '',
    price: 0,
    category: '',
    description: '',
  });

  let products = $state([
    {
      id: 1,
      name: 'Laptop Pro',
      price: 1299.99,
      category: 'Electrónica',
      description: 'Laptop de alto rendimiento para profesionales',
      stock: 15,
    },
    {
      id: 2,
      name: 'Mouse Inalámbrico',
      price: 29.99,
      category: 'Accesorios',
      description: 'Mouse ergonómico con conexión Bluetooth',
      stock: 50,
    },
  ]);

  function handleSave() {
    console.log('Nuevo producto:', newProduct);
    // Reset form
    newProduct = { name: '', price: 0, category: '', description: '' };
    showModal = false;
  }
</script>

<div class="space-y-6">
  <div class="mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-2xl md:text-3xl font-bold text-base-content">Gestión de Productos</h1>
      <button class="btn btn-primary btn-sm md:btn" onclick={() => (showModal = true)}> Nuevo Producto </button>
    </div>
  </div>

  <ProductFilters bind:searchValue bind:categoryValue />

  <!-- Table view for desktop -->
  <div class="hidden md:block">
    <ProductTable {products} />
  </div>

  <!-- Card view for mobile -->
  <div class="block md:hidden">
    <ProductCards {products} />
  </div>

  <FormModal
    bind:isOpen={showModal}
    title="Nuevo Producto"
    confirmText="Crear"
    cancelText="Cancelar"
    onConfirm={handleSave}
    onCancel={() => (showModal = false)}>
    <ProductForm bind:newProduct onSubmit={handleSave} />
  </FormModal>
</div>
