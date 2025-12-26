<script lang="ts">
  import type { ProductResponse } from '../models/product_response';

  let { products } = $props<{ products: ProductResponse[] }>();
</script>

<div class="space-y-4">
  {#each products as product (product.id)}
    <div class="card bg-base-100 shadow-lg">
      <div class="card-body">
        <h2 class="card-title">{product.name}</h2>
        <p class="text-sm opacity-70">{product.description || 'Descripción del producto'}</p>
        <div class="flex justify-between items-center">
          <span class="text-lg font-bold">${(product.price ?? 0).toFixed(2)}</span>
          <span class="badge badge-outline">{product.category}</span>
        </div>
        <div class="flex justify-between items-center mt-2">
          <span class="text-sm">Stock: <span class="badge badge-success">{product.stock}</span></span>
          <div class="flex gap-2">
            <button class="btn btn-sm btn-primary">Editar</button>
            <button class="btn btn-sm btn-error">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  {/each}
</div>
