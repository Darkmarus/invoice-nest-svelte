<script lang="ts">
  import { onMount } from 'svelte';
  import QRCode from 'qrcode';

  let { id }: { id: string } = $props();
  let qrUrl = $state('');

  onMount(async () => {
    try {
      qrUrl = await QRCode.toDataURL(id);
    } catch (error) {
      console.error('Error generating QR code:', error);
    }
  });
</script>

{#if qrUrl}
  <img src={qrUrl} alt="QR Code for {id}" class="w-16 h-16" />
{:else}
  <div class="w-16 h-16 bg-gray-200 animate-pulse"></div>
{/if}
