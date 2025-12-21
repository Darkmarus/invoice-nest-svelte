<script lang="ts">
</script>

<div class="space-y-6">
  <div class="mb-6">
    <div class="flex justify-between items-center">
      <h1 class="text-3xl font-bold text-base-content">Gestión de Productos</h1>
      <button class="btn btn-primary">
        Nuevo Producto
      </button>
    </div>
  </div>

  <div class="flex flex-col md:flex-row gap-4">
    <div class="flex-1">
      <input
        type="text"
        placeholder="Buscar productos..."
        class="input input-bordered w-full"
      />
    </div>
    <div class="md:w-48">
      <select
        class="select select-bordered w-full"
      >
        <option value="">Todas las categorías</option>
        <option value="Electrónica">Electrónica</option>
        <option value="Accesorios">Accesorios</option>
        <option value="Software">Software</option>
        <option value="Hogar">Hogar</option>
        <option value="Ropa">Ropa</option>
      </select>
    </div>
  </div>

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
        <tr>
          <td>1</td>
          <td>
            <div>
              <div class="font-bold">Laptop Pro</div>
              <div class="text-sm opacity-50">Laptop de alto rendimiento para profesionales</div>
            </div>
          </td>
          <td>$1299.99</td>
          <td>
            <span class="badge badge-outline">Electrónica</span>
          </td>
          <td>
            <span class="badge badge-success">15</span>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-error">Eliminar</button>
            </div>
          </td>
        </tr>
        <tr>
          <td>2</td>
          <td>
            <div>
              <div class="font-bold">Mouse Inalámbrico</div>
              <div class="text-sm opacity-50">Mouse ergonómico con conexión Bluetooth</div>
            </div>
          </td>
          <td>$29.99</td>
          <td>
            <span class="badge badge-outline">Accesorios</span>
          </td>
          <td>
            <span class="badge badge-success">50</span>
          </td>
          <td>
            <div class="flex gap-2">
              <button class="btn btn-sm btn-primary">Editar</button>
              <button class="btn btn-sm btn-error">Eliminar</button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</div>