<script lang="ts">
  let { searchValue = $bindable('') } = $props();
</script>

<div class="flex-1">
  <input type="text" bind:value={searchValue} placeholder="Buscar productos..." class="input input-bordered w-full" />
</div>
