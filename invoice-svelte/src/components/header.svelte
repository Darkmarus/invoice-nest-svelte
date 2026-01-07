<script lang="ts">
  let cartCount = $state(0);
  let mobileMenuOpen = $state(false);
</script>

<section class="bg-base-100">
  <header class="container mx-auto navbar bg-base-100">
    <div class="navbar-start">
      <div class="dropdown">
        <button
          onclick={() => (mobileMenuOpen = !mobileMenuOpen)}
          class="btn btn-ghost lg:hidden"
          aria-label="Abrir menú">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h8m-8 6h16"></path>
          </svg>
        </button>
        {#if mobileMenuOpen}
          <div class="fixed inset-0 z-50 bg-base-100 flex flex-col items-center justify-center">
            <button
              onclick={() => (mobileMenuOpen = false)}
              class="btn btn-ghost self-end m-4"
              aria-label="Cerrar menú">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
            <ul class="menu menu-vertical text-xl space-y-4">
              <li><a href="/" onclick={() => (mobileMenuOpen = false)}>Inicio</a></li>
              <li><a href="/productos" onclick={() => (mobileMenuOpen = false)}>Productos</a></li>
              <li><a href="/qr-scanner" onclick={() => (mobileMenuOpen = false)}>Escáner QR</a></li>
            </ul>
          </div>
        {/if}
      </div>
      <a href="/" class="btn btn-ghost text-xl font-bold">MiTienda</a>
    </div>

    <div class="navbar-center hidden lg:flex">
      <ul class="menu menu-horizontal px-1">
        <li><a href="/" class="font-semibold">Inicio</a></li>
        <li><a href="/productos">Productos</a></li>
        <li><a href="/qr-scanner">Escáner QR</a></li>
      </ul>
    </div>

    <div class="navbar-end">
      <div class="flex items-center gap-2">
        <button class="btn btn-ghost btn-circle">
          <div class="indicator">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
              ></path>
            </svg>
            <span class="badge badge-sm indicator-item">{cartCount}</span>
          </div>
        </button>

        <div class="dropdown dropdown-end">
          <div tabindex="0" role="button" class="btn btn-ghost btn-circle avatar">
            <div class="w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
            </div>
          </div>
          <ul class="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52">
            <li><a href="/perfil">Mi perfil</a></li>
            <li><a href="/pedidos">Mis pedidos</a></li>
            <li><a href="/configuracion">Configuración</a></li>
            <li><a href="/logout">Cerrar sesión</a></li>
          </ul>
        </div>
      </div>
    </div>
  </header>
</section>
