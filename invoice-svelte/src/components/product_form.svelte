<script lang="ts">
  import Cropper from 'svelte-easy-crop';
  import { createEventDispatcher } from 'svelte';

  let { newProduct = $bindable({ name: '', price: 0, stock: 0, details: '', images: [] as string[] }) } = $props();

  let images = $state<string[]>([]);
  let currentImage = $state<string | null>(null);
  let crop = $state({ x: 0, y: 0 });
  let zoom = $state(1);
  let showCropper = $state(false);
  const dispatch = createEventDispatcher();

  function handleImageUpload(event: Event) {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        currentImage = e.target?.result as string;
        showCropper = true;
      };
      reader.readAsDataURL(file);
    }
  }

  async function cropImage() {
    if (!currentImage) return;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const image = new Image();
    image.src = currentImage;

    await new Promise((resolve) => {
      image.onload = resolve;
    });

    canvas.width = 300;
    canvas.height = 200;

    // Draw the image maintaining aspect ratio, centered
    const imgAspect = image.width / image.height;
    const canvasAspect = 300 / 200;
    let drawWidth, drawHeight, offsetX, offsetY;

    if (imgAspect > canvasAspect) {
      // Image is wider, fit height
      drawHeight = 200;
      drawWidth = drawHeight * imgAspect;
      offsetX = (300 - drawWidth) / 2;
      offsetY = 0;
    } else {
      // Image is taller, fit width
      drawWidth = 300;
      drawHeight = drawWidth / imgAspect;
      offsetX = 0;
      offsetY = (200 - drawHeight) / 2;
    }

    ctx?.drawImage(image, offsetX, offsetY, drawWidth, drawHeight);

    const croppedImage = canvas.toDataURL('image/jpeg', 0.9);
    images = [...images, croppedImage];
    newProduct.images = images;
    currentImage = null;
    showCropper = false;
  }

  function removeImage(index: number) {
    images = images.filter((_, i) => i !== index);
    newProduct.images = images;
  }
</script>

<div class="grid grid-cols-1 md:grid-cols-2 gap-6">
  <div class="form-control md:col-span-2">
    <label class="label" for="name">
      <span class="label-text font-semibold">Nombre</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
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

  <div class="form-control">
    <label class="label" for="price">
      <span class="label-text font-semibold">Precio</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
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

  <div class="form-control">
    <label class="label" for="stock">
      <span class="label-text font-semibold">Stock</span>
    </label>
    <label class="input input-bordered flex items-center gap-2">
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

  <div class="form-control md:col-span-2">
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

  <div class="form-control md:col-span-2">
    <label class="label" for="images">
      <span class="label-text font-semibold">Imágenes del Producto</span>
    </label>
    <div class="flex-col items-center gap-4">
      <input
        id="images"
        type="file"
        accept="image/*"
        class="file-input file-input-bordered file-input-primary"
        onchange={handleImageUpload} />
      <div class="text-sm opacity-70">Selecciona una imagen para recortar y agregar</div>
    </div>

    {#if images.length > 0}
      <div class="mt-4">
        <h4 class="font-semibold mb-2">Imágenes Agregadas ({images.length})</h4>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          {#each images as image, index}
            <div class="card bg-base-200">
              <figure class="px-4 pt-4">
                <img src={image} alt="Producto {index + 1}" class="w-full h-24 object-cover rounded" />
              </figure>
              <div class="card-body p-2">
                <div class="card-actions justify-end">
                  <button
                    type="button"
                    class="btn btn-xs btn-error"
                    onclick={() => removeImage(index)}
                    aria-label="Eliminar imagen">
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

  {#if showCropper && currentImage}
    <div class="modal modal-open">
      <div class="modal-box max-w-2xl">
        <h3 class="font-bold text-lg mb-4">Recortar Imagen</h3>
        <div class="relative h-96">
          <Cropper image={currentImage} bind:crop bind:zoom aspect={1.5} />
        </div>
        <div class="modal-action">
          <button
            class="btn btn-ghost"
            onclick={() => {
              showCropper = false;
              currentImage = null;
            }}>Cancelar</button>
          <button class="btn btn-primary" onclick={cropImage}>Recortar y Agregar</button>
        </div>
      </div>
    </div>
  {/if}
</div>
