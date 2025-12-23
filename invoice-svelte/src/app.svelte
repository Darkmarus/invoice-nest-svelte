<script lang="ts">
  import { onMount } from 'svelte';
  import { Router } from 'sv-router';
  import 'sv-router/generated';
  import { configStore, loadConfig } from './stores/config_store';
  import Layout from './components/layout.svelte';

  onMount(() => loadConfig());
</script>

{#if $configStore.loading}
  <div class="flex items-center justify-center min-h-screen">
    <span class="loading loading-spinner loading-lg"></span>
    <p class="ml-4">Cargando configuración...</p>
  </div>
{:else if $configStore.error}
  <div class="alert alert-error max-w-md mx-auto mt-10">
    <span>Error: {$configStore.error}</span>
  </div>
{:else}
  <Layout>
    <Router />
  </Layout>
{/if}
