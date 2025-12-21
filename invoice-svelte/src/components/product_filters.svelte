<script lang="ts">
  let { searchValue = $bindable(''), categoryValue = $bindable('') } = $props();

  const categories = ['Electrónica', 'Accesorios', 'Software', 'Hogar', 'Ropa'];
</script>

<div class="flex flex-col md:flex-row gap-4">
  <div class="flex-1">
    <input type="text" bind:value={searchValue} placeholder="Buscar productos..." class="input input-bordered w-full" />
  </div>
  <div class="md:w-48">
    <select bind:value={categoryValue} class="select select-bordered w-full">
      <option value="">Todas las categorías</option>
      {#each categories as cat}
        <option value={cat}>{cat}</option>
      {/each}
    </select>
  </div>
</div>
