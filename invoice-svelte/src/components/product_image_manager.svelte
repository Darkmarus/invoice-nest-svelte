<script lang="ts">
  import type { CombinedImage } from '../models/product_request';

  // Importa funciones para resolver URLs de imágenes y el componente Cropper
  import Cropper from 'svelte-easy-crop';
  import { resolvedImages } from '../stores/config_store';

  // Props del componente: imágenes combinadas
  let { combinedImages = $bindable([] as CombinedImage[]) } = $props();

  // Estado para drag and drop
  let draggedIndex = $state<number | null>(null);
  let dragOverIndex = $state<number | null>(null);

  // Estados para el modal de recorte
  let showCropModal = $state(false);
  let imageToCrop = $state<string>('');
  let crop = $state({ x: 0, y: 0 });
  let zoom = $state(1);
  let croppedAreaPixels = $state({ x: 0, y: 0, width: 0, height: 0 });
  let croppedImageFile = $state<File | null>(null);

  // Maneja la subida de imágenes, procesa una a la vez para recortar
  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    if (files && files.length > 0) {
      const file = files[0]; // Procesa una imagen a la vez para recortar
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          imageToCrop = e.target.result as string;
          showCropModal = true;
          croppedImageFile = file; // Almacena el archivo original para usar después
        }
      };
      reader.readAsDataURL(file);
    }
  }

  // Maneja la finalización del recorte de la imagen
  function onCropComplete(e: any) {
    croppedAreaPixels = e.pixels;
  }

  // Aplica el recorte y guarda la imagen recortada
  async function applyCrop() {
    if (!imageToCrop || !croppedImageFile) return;

    try {
      // Crea un canvas para aplicar el recorte
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const image = new Image();
      image.src = imageToCrop;

      await new Promise((resolve) => {
        image.onload = resolve;
      });

      canvas.width = 300;
      canvas.height = 200;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        300,
        200
      );

      canvas.toBlob((blob) => {
        if (blob && croppedImageFile) {
          const croppedFile = new File([blob], croppedImageFile.name, {
            type: croppedImageFile.type,
            lastModified: Date.now(),
          });

          combinedImages = [...combinedImages, { type: 'new', data: croppedFile }];

          // Reset crop state
          showCropModal = false;
          imageToCrop = '';
          crop = { x: 0, y: 0 };
          zoom = 1;
          croppedImageFile = null;
        }
      }, croppedImageFile?.type || 'image/jpeg');
    } catch (error) {
      console.error('Error applying crop:', error);
    }
  }

  // Cancela el recorte y resetea el estado
  function cancelCrop() {
    showCropModal = false;
    imageToCrop = '';
    crop = { x: 0, y: 0 };
    zoom = 1;
    croppedImageFile = null;
  }

  // Elimina una imagen del índice dado
  function removeImage(index: number) {
    combinedImages = combinedImages.filter((_, i) => i !== index);
  }

  // Drag and drop handlers
  function handleDragStart(event: DragEvent, index: number) {
    draggedIndex = index;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  function handleDragOver(event: DragEvent) {
    event.preventDefault();
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  function handleDragEnter(event: DragEvent, index: number) {
    event.preventDefault();
    if (index !== draggedIndex) {
      dragOverIndex = index;
    }
  }

  function handleDragLeave(event: DragEvent) {
    if (!event.currentTarget || !event.relatedTarget) return;
    const current = event.currentTarget as HTMLElement;
    const related = event.relatedTarget as HTMLElement;
    if (!current.contains(related)) {
      dragOverIndex = null;
    }
  }

  function handleDrop(event: DragEvent, targetIndex: number) {
    event.preventDefault();
    if (draggedIndex === null) return;

    const items = [...combinedImages];
    const [removed] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, removed);
    combinedImages = items;

    draggedIndex = null;
    dragOverIndex = null;
  }

  function handleDragEnd() {
    draggedIndex = null;
    dragOverIndex = null;
  }
</script>

<!-- Sección de control de formulario para imágenes, ocupa 2 columnas en md -->
<div class="form-control md:col-span-2">
  <!-- Etiqueta para el input de imágenes -->
  <label class="label" for="images">
    <span class="label-text font-semibold">Imágenes del Producto</span>
  </label>
  <!-- Contenedor para el input y texto descriptivo -->
  <div class="flex-col items-center gap-4">
    <!-- Input para seleccionar archivos de imagen -->
    <input
      id="images"
      type="file"
      accept="image/*"
      multiple
      class="file-input file-input-bordered file-input-primary"
      onchange={handleImageUpload} />
    <!-- Texto de ayuda -->
    <div class="text-sm opacity-70">Selecciona imágenes para recortar y agregar</div>
  </div>

  <!-- Si hay imágenes, mostrar el grid -->
  {#if combinedImages.length > 0}
    <!-- Contenedor con margen superior -->
    <div class="mt-4">
      <!-- Título con contador de imágenes -->
      <h4 class="font-semibold mb-2">Imágenes del Producto ({combinedImages.length})</h4>
      <!-- Grid responsivo para mostrar las imágenes -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
        <!-- Itera sobre imágenes combinadas -->
        {#each combinedImages as item, index}
          <!-- Tarjeta para cada imagen -->
          <div
            class="card cursor-move {draggedIndex === index
              ? 'opacity-50'
              : dragOverIndex === index
                ? 'ring-4 ring-primary ring-opacity-50 bg-base-300'
                : 'bg-base-200'}"
            draggable="true"
            role="button"
            tabindex="0"
            aria-label="Arrastrar imagen {index + 1}"
            ondragstart={(e) => handleDragStart(e, index)}
            ondragover={handleDragOver}
            ondragenter={(e) => handleDragEnter(e, index)}
            ondragleave={handleDragLeave}
            ondrop={(e) => handleDrop(e, index)}
            ondragend={handleDragEnd}>
            <!-- Figura con imagen -->
            <figure class="px-4 pt-4">
              {#if item.type === 'existing'}
                <img
                  src={resolvedImages((item.data as import('src/models/product_response').FileResponse).path)}
                  alt="Producto existente {index + 1}"
                  class="w-full h-24 object-cover rounded"
                  draggable="false" />
              {:else}
                <img
                  src={URL.createObjectURL(item.data as File)}
                  alt="Producto nuevo {index + 1}"
                  class="w-full h-24 object-cover rounded"
                  draggable="false" />
              {/if}
            </figure>
            <!-- Cuerpo de la tarjeta con acciones -->
            <div class="card-body p-2">
              <div class="card-actions justify-between">
                <!-- Indicador de arrastre -->
                <svg class="w-4 h-4 opacity-50 cursor-grab" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16"></path>
                </svg>
                <!-- Botón para eliminar imagen -->
                <button
                  type="button"
                  class="btn btn-xs btn-error"
                  onclick={() => removeImage(index)}
                  aria-label="Eliminar imagen">
                  <!-- Icono de X -->
                  <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
    </div>
  {/if}
</div>

<!-- Modal para recortar la imagen -->
{#if showCropModal}
  <!-- Overlay del modal -->
  <div class="modal modal-open">
    <!-- Caja del modal -->
    <div class="modal-box max-w-4xl">
      <!-- Título del modal -->
      <h3 class="font-bold text-lg mb-4">Recortar Imagen</h3>

      <!-- Contenedor del cropper -->
      <div class="relative h-96 mb-4">
        <Cropper image={imageToCrop} bind:crop bind:zoom aspect={3 / 2} oncropcomplete={onCropComplete} />
      </div>

      <!-- Control de zoom -->
      <div class="mb-4">
        <label class="label" for="inRange">
          <span class="label-text">Zoom: {zoom.toFixed(1)}x</span>
        </label>
        <input id="inRange" type="range" min="1" max="3" step="0.1" bind:value={zoom} class="range range-primary" />
      </div>

      <!-- Acciones del modal -->
      <div class="modal-action">
        <button class="btn btn-ghost" onclick={cancelCrop}>Cancelar</button>
        <button class="btn btn-primary" onclick={applyCrop}>Aplicar Recorte</button>
      </div>
    </div>
  </div>
{/if}
