<script lang="ts">
  let { 
    isOpen = $bindable(false),
    title = 'Formulario',
    confirmText = 'Guardar',
    cancelText = 'Cancelar',
    onConfirm = () => {},
    onCancel = () => {}
  } = $props();

  function handleConfirm() {
    onConfirm();
  }

  function handleCancel() {
    isOpen = false;
    onCancel();
  }
</script>

{#if isOpen}
  <div class="modal modal-open">
    <div class="modal-box">
      <h3 class="font-bold text-lg">{title}</h3>
      
      <div class="py-4">
        {@render children?.()}
      </div>
      
      <div class="modal-action">
        <button onclick={handleCancel} class="btn">{cancelText}</button>
        <button onclick={handleConfirm} class="btn btn-primary">{confirmText}</button>
      </div>
    </div>
  </div>
{/if}