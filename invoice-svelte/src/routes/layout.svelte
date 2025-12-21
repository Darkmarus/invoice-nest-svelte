<script lang="ts">
	import type { Snippet } from 'svelte';
  import Header from "../components/header.svelte";

	let { children }: { children: Snippet } = $props();
</script>

<div class="min-h-screen bg-base-200">
  <Header />
  
  <main class="container mx-auto px-4 py-8">
    {@render children()}
  </main>

  <footer class="footer footer-center p-10 bg-base-300 text-base-content">
    <div>
      <p class="font-bold">MiTienda © 2024 - Todos los derechos reservados</p>
    </div>
    <div>
      <div class="grid grid-flow-col gap-4">
        <a href="/about" class="link link-hover">Acerca de</a>
        <a href="/contact" class="link link-hover">Contacto</a>
        <a href="/privacy" class="link link-hover">Privacidad</a>
        <a href="/terms" class="link link-hover">Términos</a>
      </div>
    </div>
  </footer>
</div>