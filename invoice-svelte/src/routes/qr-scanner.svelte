<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { Html5QrcodeScanner } from 'html5-qrcode';

  let scanner: Html5QrcodeScanner | null = null;
  let scannedResult = $state('');
  let isScanning = $state(true);

  onMount(() => {
    scanner = new Html5QrcodeScanner(
      'qr-reader',
      {
        fps: 10,
        qrbox: { width: 250, height: 250 },
        aspectRatio: 1.0,
      },
      false
    );

    scanner.render(
      (decodedText: string) => {
        scannedResult = decodedText;
        isScanning = false;
        scanner?.clear();
      },
      (errorMessage: string) => {
        // Ignore errors, just keep scanning
      }
    );
  });

  onDestroy(() => {
    scanner?.clear();
  });

  function restartScan() {
    scannedResult = '';
    isScanning = true;
    scanner?.render(
      (decodedText: string) => {
        scannedResult = decodedText;
        isScanning = false;
        scanner?.clear();
      },
      () => {}
    );
  }
</script>

<div class="container mx-auto px-4 py-8">
  <h1 class="text-2xl font-bold mb-6">Escáner QR</h1>

  {#if isScanning}
    <div id="qr-reader" class="w-full max-w-md mx-auto"></div>
    <p class="text-center mt-4">Apunta la cámara al código QR</p>
  {:else}
    <div class="alert alert-success">
      <h3 class="font-bold">Código QR escaneado:</h3>
      <p>{scannedResult}</p>
    </div>
    <div class="text-center mt-4">
      <button class="btn btn-primary" onclick={restartScan}>Escanear otro QR</button>
    </div>
  {/if}
</div>

<style>
  #qr-reader {
    width: 100%;
  }
</style>
