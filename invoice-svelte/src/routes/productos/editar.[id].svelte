<script lang="ts">
  import type { FileResponse } from 'src/models/product_response';
  import { navigate, route } from 'sv-router/generated';
  import { onMount } from 'svelte';
  import ProductForm from '../../components/product_form.svelte';
  import { productsStore } from '../../stores/products_store';

  let newProduct = $state({
    name: '',
    price: 0,
    stock: 0,
    details: '',
    images: [] as File[],
  });

  let productId = $state<string>('');
  let existingImages = $state<FileResponse[]>([]);

  // Load product data when component mounts
  onMount(async () => {
    // Get the product ID from the query parameters

    const { id } = route.getParams('/productos/editar/:id');

    if (id) {
      try {
        const product = await productsStore.fetchProduct(id);
        if (product) {
          productId = product.id;
          existingImages = product.images || [];
          newProduct = {
            name: product.name,
            price: product.price ?? 0,
            stock: product.stock ?? 0,
            details: product.description || '',
            images: [] as File[],
          };
        } else {
          navigate('/productos');
        }
      } catch (error) {
        console.error('Error fetching product:', error);
        navigate('/productos');
      }
    } else {
      // If no product ID in query params, redirect back
      navigate('/productos');
    }
  });

  async function handleSave() {
    try {
      await productsStore.update(productId, {
        name: newProduct.name,
        details: newProduct.details,
        price: newProduct.price,
        stock: newProduct.stock,
      });
      navigate('/productos');
    } catch (err) {
      console.error(err);
    }
  }

  function handleCancel() {
    navigate('/productos');
  }
</script>

<div class="container mx-auto">
  <div class="max-w-4xl mx-auto">
    <!-- Breadcrumb -->
    <div class="text-sm breadcrumbs mb-6">
      <ul>
        <li><a href="/">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
        <li>Editar Producto</li>
      </ul>
    </div>

    <div class="card bg-base-100 shadow-xl">
      <div class="card-body">
        <h2 class="card-title text-2xl md:text-3xl mb-6">
          <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
            ></path>
          </svg>
          Editar Producto
        </h2>

        <ProductForm bind:newProduct {existingImages} />

        <div class="card-actions justify-end mt-6">
          <button class="btn btn-ghost" onclick={handleCancel}>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
            Cancelar
          </button>
          <button class="btn btn-primary" onclick={handleSave}>
            <svg class="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            Actualizar Producto
          </button>
        </div>
      </div>
    </div>
  </div>
</div>
