<script lang="ts">
  import type { ProductResponse } from '../models/product_response';
  import { navigateUtils } from '../utils/navigate-utils';

  let { products, handleDelete } = $props<{
    products: ProductResponse[];
    handleDelete: (product: ProductResponse) => {};
  }>();
</script>

<div class="overflow-x-auto">
  <table class="table table-zebra w-full">
    <thead>
      <tr>
        <th>Nombre</th>
        <th>Precio</th>
        <!-- <th>Categoría</th> -->
        <th>Stock</th>
        <th>Imágenes</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each products as product (product.id)}
        <tr>
          <td>
            <div>
              <div class="font-bold">{product.name}</div>
              <div class="text-sm opacity-50">{product.details || 'Descripción del producto'}</div>
            </div>
          </td>
          <td>${(product.price ?? 0).toFixed(2)}</td>
          <!-- <td>
            <span class="badge badge-outline">{product.category}</span>
          </td> -->
          <td>
            <span class="badge badge-success">{product.stock ?? 0}</span>
          </td>
          <td>
            <span class="badge badge-info">{product.images?.length ?? 0}</span>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-primary" onclick={() => navigateUtils.goProductEdit(product.id)}
                >Editar</button>
              <button class="btn btn-sm btn-error" onclick={() => handleDelete(product)}>Eliminar</button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
