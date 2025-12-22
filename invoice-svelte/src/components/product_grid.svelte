<script lang="ts">
  import ProductCard from './product_card.svelte';
  import Pagination from './pagination.svelte';

  let currentPage = $state(1);
  const itemsPerPage = 6;

  const allProducts = [
    {
      id: 1,
      name: 'Laptop Gaming Pro',
      price: 1299.99,
      images: [
        'https://placehold.co/300x200/1e40af/ffffff?text=Laptop+Azul',
        'https://placehold.co/300x200/dc2626/ffffff?text=Laptop+Roja',
        'https://placehold.co/300x200/059669/ffffff?text=Laptop+Verde',
      ],
      description: 'Potente laptop para gaming con última generación',
      category: 'Electrónica',
    },
    {
      id: 2,
      name: 'Smartphone Ultra',
      price: 899.99,
      images: [
        'https://placehold.co/300x200/059669/ffffff?text=Smartphone+Verde',
        'https://placehold.co/300x200/7c3aed/ffffff?text=Smartphone+Púrpura',
        'https://placehold.co/300x200/ea580c/ffffff?text=Smartphone+Naranja',
      ],
      description: 'Teléfono inteligente con cámara profesional',
      category: 'Móviles',
    },
    {
      id: 3,
      name: 'Auriculares Premium',
      price: 199.99,
      images: [
        'https://placehold.co/300x200/7c3aed/ffffff?text=Auriculares+Púrpura',
        'https://placehold.co/300x200/0891b2/ffffff?text=Auriculares+Azul',
        'https://placehold.co/300x200/0f766e/ffffff?text=Auriculares+Turquesa',
      ],
      description: 'Auriculares inalámbricos con cancelación de ruido',
      category: 'Audio',
    },
    {
      id: 4,
      name: 'Smartwatch Sport',
      price: 349.99,
      images: ['https://placehold.co/300x200/dc2626/ffffff?text=Smartwatch'],
      description: 'Reloj inteligente para deportes y fitness',
      category: 'Wearables',
    },
    {
      id: 5,
      name: 'Tablet Pro Max',
      price: 799.99,
      images: ['https://placehold.co/300x200/ea580c/ffffff?text=Tablet'],
      description: 'Tablet profesional para trabajo y creatividad',
      category: 'Tablets',
    },
    {
      id: 6,
      name: 'Cámara 4K',
      price: 599.99,
      images: ['https://placehold.co/300x200/0891b2/ffffff?text=Cámara'],
      description: 'Cámara de alta resolución para fotografía profesional',
      category: 'Fotografía',
    },
    {
      id: 7,
      name: 'Monitor 4K Ultra',
      price: 449.99,
      images: ['https://placehold.co/300x200/0f766e/ffffff?text=Monitor'],
      description: 'Monitor 4K con alta precisión de color',
      category: 'Monitores',
    },
    {
      id: 8,
      name: 'Teclado Mecánico RGB',
      price: 129.99,
      images: ['https://placehold.co/300x200/b91c1c/ffffff?text=Teclado'],
      description: 'Teclado gaming con iluminación RGB',
      category: 'Accesorios',
    },
    {
      id: 9,
      name: 'Mouse Gaming Pro',
      price: 79.99,
      images: ['https://placehold.co/300x200/1e3a8a/ffffff?text=Mouse'],
      description: 'Mouse gaming con sensor óptico preciso',
      category: 'Accesorios',
    },
    {
      id: 10,
      name: 'Altavoces Bluetooth',
      price: 159.99,
      images: ['https://placehold.co/300x200/a21caf/ffffff?text=Altavoces'],
      description: 'Sistema de audio inalámbrico premium',
      category: 'Audio',
    },
    {
      id: 11,
      name: 'Impresora Multifunción',
      price: 299.99,
      images: ['https://placehold.co/300x200/15803d/ffffff?text=Impresora'],
      description: 'Impresora con escáner y copiadora',
      category: 'Oficina',
    },
    {
      id: 12,
      name: 'Disco Duro Externo',
      price: 89.99,
      images: ['https://placehold.co/300x200/7c2d12/ffffff?text=Disco'],
      description: 'Almacenamiento externo 2TB USB 3.0',
      category: 'Almacenamiento',
    },
  ];

  const totalPages = $derived(Math.ceil(allProducts.length / itemsPerPage));
  const startIndex = $derived((currentPage - 1) * itemsPerPage);
  const endIndex = $derived(startIndex + itemsPerPage);
  const products = $derived(allProducts.slice(startIndex, endIndex));

  function handlePageChange(page: number) {
    currentPage = page;
  }
</script>

<section class="py-8">
  <div class="container mx-auto px-4">
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {#each products as product (product.id)}
        <ProductCard {product} />
      {/each}
    </div>

     <Pagination
       {currentPage}
       {totalPages}
       totalItems={allProducts.length}
       itemsPerPage={itemsPerPage}
       itemName="productos"
       onPageChange={handlePageChange}
     />
  </div>
</section>
