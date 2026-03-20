<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-inner">
        <NuxtLink to="/" class="logo">
          <span class="logo-icon">&#9889;</span>
          <span class="logo-text">FlipFind</span>
          <span class="logo-badge">PERTH</span>
        </NuxtLink>
        <div class="nav-links">
          <NuxtLink to="/" class="nav-link">Home</NuxtLink>
          <NuxtLink to="/listings" class="nav-link">Listings</NuxtLink>
          <NuxtLink to="/alerts" class="nav-link">
            Alerts
            <span v-if="alertCount > 0" class="alert-badge">{{ alertCount }}</span>
          </NuxtLink>
          <NuxtLink to="/saved" class="nav-link">Saved</NuxtLink>
        </div>
        <button class="mobile-toggle" @click="mobileOpen = !mobileOpen">
          <span></span><span></span><span></span>
        </button>
      </div>
      <div v-if="mobileOpen" class="mobile-menu">
        <NuxtLink to="/" class="mobile-link" @click="mobileOpen = false">Home</NuxtLink>
        <NuxtLink to="/listings" class="mobile-link" @click="mobileOpen = false">Listings</NuxtLink>
        <NuxtLink to="/alerts" class="mobile-link" @click="mobileOpen = false">Alerts</NuxtLink>
        <NuxtLink to="/saved" class="mobile-link" @click="mobileOpen = false">Saved</NuxtLink>
      </div>
    </nav>
    <main class="main-content">
      <slot />
    </main>
    <footer class="footer">
      <p>&copy; 2026 FlipFind Perth &mdash; Find. Flip. Profit.</p>
    </footer>
  </div>
</template>

<script setup>
const mobileOpen = ref(false)
const { alerts } = useAlerts()
const alertCount = computed(() => alerts.value.filter(a => !a.read).length)
</script>

<style scoped>
.layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  background: var(--bg-secondary);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
  backdrop-filter: blur(12px);
}

.nav-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 800;
  font-size: 1.25rem;
}

.logo-icon {
  font-size: 1.5rem;
}

.logo-text {
  color: var(--text-primary);
}

.logo-badge {
  background: var(--accent);
  color: var(--bg-primary);
  font-size: 0.6rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
  letter-spacing: 0.05em;
}

.nav-links {
  display: flex;
  gap: 0.25rem;
}

.nav-link {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  font-weight: 500;
  color: var(--text-secondary);
  transition: all 0.2s;
  position: relative;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--text-primary);
  background: rgba(255,255,255,0.05);
}

.alert-badge {
  background: var(--red);
  color: white;
  font-size: 0.65rem;
  font-weight: 700;
  padding: 1px 5px;
  border-radius: 10px;
  margin-left: 4px;
}

.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  padding: 8px;
}

.mobile-toggle span {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--text-secondary);
  border-radius: 1px;
}

.mobile-menu {
  display: none;
  flex-direction: column;
  padding: 0.5rem 1.5rem 1rem;
  border-top: 1px solid var(--border);
}

.mobile-link {
  padding: 0.75rem 0;
  color: var(--text-secondary);
  font-weight: 500;
  border-bottom: 1px solid var(--border);
}

.main-content {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
  width: 100%;
}

.footer {
  border-top: 1px solid var(--border);
  padding: 1.5rem;
  text-align: center;
  color: var(--text-muted);
  font-size: 0.8rem;
}

@media (max-width: 768px) {
  .nav-links { display: none; }
  .mobile-toggle { display: flex; }
  .mobile-menu { display: flex; }
}
</style>
