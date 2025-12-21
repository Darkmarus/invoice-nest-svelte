<script lang="ts">
  let { newProduct = $bindable({ name: '', price: 0, category: '', description: '' }), onSubmit } = $props();

  const categories = ['Electrónica', 'Accesorios', 'Software', 'Hogar', 'Ropa'];

  function handleSubmit() {
    onSubmit();
  }
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
      placeholder="Nombre del producto" />
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
      step="0.01" />
  </div>
  <div class="form-control">
    <label class="label" for="category">
      <span class="label-text">Categoría</span>
    </label>
    <select id="category" bind:value={newProduct.category} class="select select-bordered">
      <option value="">Seleccionar categoría</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>
  <div class="form-control">
    <label class="label" for="description">
      <span class="label-text">Descripción</span>
    </label>
    <textarea
      id="description"
      bind:value={newProduct.description}
      class="textarea textarea-bordered"
      placeholder="Descripción del producto"></textarea>
  </div>
</div>
