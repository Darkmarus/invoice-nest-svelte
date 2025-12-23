<script lang="ts">
  interface Props {
    currentPage: number;
    totalPages: number;
    totalItems?: number;
    itemsPerPage?: number;
    itemName?: string;
    onPageChange: (page: number) => void;
  }

  let { currentPage, totalPages, totalItems, itemsPerPage, itemName = 'items', onPageChange }: Props = $props();

  function goToPage(page: number) {
    if (page >= 1 && page <= totalPages) {
      onPageChange(page);
    }
  }

  function previousPage() {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  }

  function nextPage() {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  }

  // Generate page numbers with ellipsis for large page counts
  function getPageNumbers(currentPage: number, totalPages: number): (number | string)[] {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, '...', totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        pages.push(1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages);
      }
    }

    return pages;
  }

  const pageNumbers = $derived(getPageNumbers(currentPage, totalPages));

  const startIndex = $derived(totalItems && itemsPerPage ? (currentPage - 1) * itemsPerPage : 0);
  const endIndex = $derived(totalItems && itemsPerPage ? startIndex + itemsPerPage : 0);
</script>

{#if totalPages > 1}
  <div class="flex justify-center mt-8">
    <div class="join">
      <button
        class="join-item btn"
        class:btn-disabled={currentPage === 1}
        onclick={previousPage}
        aria-label="Previous page">
        «
      </button>

      {#each pageNumbers as page}
        {#if page === '...'}
          <button class="join-item btn btn-disabled" disabled>...</button>
        {:else if typeof page === 'number'}
          <button
            class="join-item btn"
            class:btn-active={currentPage === page}
            onclick={() => goToPage(page)}
            aria-label="Go to page {page}">
            {page}
          </button>
        {/if}
      {/each}

      <button
        class="join-item btn"
        class:btn-disabled={currentPage === totalPages}
        onclick={nextPage}
        aria-label="Next page">
        »
      </button>
    </div>
  </div>

  {#if totalItems !== undefined}
    <div class="text-center mt-4">
      <p class="text-sm text-base-content/60">
        Mostrando {startIndex + 1}-{Math.min(endIndex, totalItems)} de {totalItems}
        {itemName}
      </p>
    </div>
  {/if}
{/if}
