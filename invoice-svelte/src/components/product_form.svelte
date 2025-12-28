<script lang="ts">
  // Importa el componente para manejar imágenes del producto
  import ProductImageManager from './product_image_manager.svelte';

  // Props del componente: producto nuevo y imágenes existentes
  let {
    newProduct = $bindable({ name: '', price: 0, stock: 0, details: '', images: [] as File[] }),
    existingImages = [] as string[],
  } = $props();
</script>

<!-- Contenedor principal del formulario en grid responsivo -->
<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <!-- Campo para el nombre del producto -->
  <div class="form-control">
    <label class="label" for="name">
      <span class="label-text font-semibold">Nombre</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <!-- Icono de etiqueta -->
      <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
        ></path>
      </svg>
      <input
        id="name"
        type="text"
        bind:value={newProduct.name}
        placeholder="Ingrese el nombre del producto"
        class="grow"
        required />
    </label>
  </div>

  <!-- Campo para el precio del producto -->
  <div class="form-control">
    <label class="label" for="price">
      <span class="label-text font-semibold">Precio</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <!-- Icono de dólar -->
      <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1"
        ></path>
      </svg>
      <input
        id="price"
        type="number"
        bind:value={newProduct.price}
        placeholder="0.00"
        class="grow"
        step="0.01"
        min="0"
        required />
    </label>
  </div>

  <!-- Campo para los detalles del producto -->
  <div class="form-control flex flex-col">
    <label class="label" for="details">
      <span class="label-text font-semibold">Detalles del Producto</span>
    </label>

    <textarea
      id="details"
      bind:value={newProduct.details}
      class="textarea textarea-bordered h-24 resize-y"
      placeholder="Ingrese una descripción detallada del producto..."
      rows="3"></textarea>
  </div>

  <!-- Campo para el stock del producto -->
  <div class="form-control">
    <label class="label" for="stock">
      <span class="label-text font-semibold">Stock</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
      <!-- Icono de caja -->
      <svg class="w-4 h-4 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path>
      </svg>
      <input id="stock" type="number" bind:value={newProduct.stock} placeholder="0" class="grow" min="0" required />
    </label>
  </div>

  <!-- Componente para manejar las imágenes del producto -->
  <ProductImageManager bind:newImages={newProduct.images} {existingImages} />
</div>