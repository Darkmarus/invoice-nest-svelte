<script lang="ts">
  import { Debounce } from '../utils/debounce';
  import { productsStore } from '../stores/products_store';
  import ProductGrid from '../components/product_grid.svelte';

  let searchValue = $state('');
  const debounce = new Debounce(300);
</script>

<div class="container mx-auto px-4">
  <div class="form-control mb-6">
    <input
      type="text"
      placeholder="Buscar productos..."
      class="input input-bordered w-full max-w-md mx-auto"
      value={searchValue}
      oninput={(e) => {
        searchValue = (e.target as HTMLInputElement).value;
        debounce.call(() => (productsStore as any).setSearchQuery(searchValue));
      }} />
  </div>

  <ProductGrid />
</div>
