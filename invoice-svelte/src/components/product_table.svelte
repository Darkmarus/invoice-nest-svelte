<script lang="ts">
  let { products } = $props<{ products: any[] }>();
</script>

<div class="overflow-x-auto">
  <table class="table table-zebra w-full">
    <thead>
      <tr>
        <th>ID</th>
        <th>Nombre</th>
        <th>Precio</th>
        <th>Categoría</th>
        <th>Stock</th>
        <th>Acciones</th>
      </tr>
    </thead>
    <tbody>
      {#each products as product (product.id)}
        <tr>
          <td>{product.id}</td>
          <td>
            <div>
              <div class="font-bold">{product.name}</div>
              <div class="text-sm opacity-50">{product.description || 'Descripción del producto'}</div>
            </div>
          </td>
          <td>${product.price.toFixed(2)}</td>
          <td>
            <span class="badge badge-outline">{product.category}</span>
          </td>
          <td>
            <span class="badge badge-success">{product.stock}</span>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-error">Eliminar</button>
            </div>
          </td>
        </tr>
      {/each}
    </tbody>
  </table>
</div>
