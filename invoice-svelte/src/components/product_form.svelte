<script lang="ts">
  let { newProduct = $bindable({ name: '', price: 0, stock: 0 }) } = $props();
</script>

<div class="space-y-4">
  <div class="form-control">
    <label class="label" for="name">
      <span class="label-text">Nombre</span>
    </label>
    <input
      id="name"
      type="text"
      bind:value={newProduct.name}
      class="input input-bordered"
      placeholder="Nombre del producto"
      required />
  </div>
  <div class="form-control">
    <label class="label" for="price">
      <span class="label-text">Precio</span>
    </label>
    <input
      id="price"
      type="number"
      bind:value={newProduct.price}
      class="input input-bordered"
      placeholder="0.00"
      step="0.01"
      min="0"
      required />
  </div>
  <div class="form-control">
    <label class="label" for="stock">
      <span class="label-text">Stock</span>
    </label>
    <input
      id="stock"
      type="number"
      bind:value={newProduct.stock}
      class="input input-bordered"
      placeholder="0"
      min="0"
      required />
  </div>
</div>
