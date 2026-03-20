<template>
  <div class="alerts-page">
    <div class="page-header">
      <div>
        <h1>Alerts &amp; Notifications</h1>
        <p class="page-desc">
          {{ unreadCount }} unread alert{{ unreadCount !== 1 ? 's' : '' }}
        </p>
      </div>
      <button v-if="unreadCount > 0" class="btn-mark-all" @click="markAllRead">
        Mark All Read
      </button>
    </div>

    <!-- Alert Type Filters -->
    <div class="alert-filters">
      <button
        v-for="f in typeFilters"
        :key="f.value"
        class="filter-chip"
        :class="{ active: activeFilter === f.value }"
        @click="activeFilter = f.value"
      >
        {{ f.label }}
        <span v-if="f.count > 0" class="chip-count">{{ f.count }}</span>
      </button>
    </div>

    <!-- Alert List -->
    <div v-if="displayedAlerts.length" class="alerts-list">
      <div
        v-for="alert in displayedAlerts"
        :key="alert.id"
        class="alert-card"
        :class="{ unread: !alert.read }"
        @click="markAsRead(alert.id)"
      >
        <div class="alert-icon" :class="'icon-' + alert.type">
          {{ iconFor(alert.type) }}
        </div>
        <div class="alert-body">
          <div class="alert-top">
            <span class="alert-type-badge" :class="'type-' + alert.type">
              {{ labelFor(alert.type) }}
            </span>
            <span class="alert-time">{{ timeAgo(alert.createdAt) }}</span>
          </div>
          <h3>{{ alert.title }}</h3>
          <p>{{ alert.message }}</p>
          <div v-if="alert.listingId" class="alert-action">
            <NuxtLink to="/listings" class="alert-link">View Listing &rarr;</NuxtLink>
          </div>
        </div>
        <button class="alert-dismiss" title="Dismiss" @click.stop="deleteAlert(alert.id)">
          &times;
        </button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">&#128276;</div>
      <h3>No alerts yet</h3>
      <p>Set up saved searches to receive notifications when matching cars are listed in Perth.</p>
      <NuxtLink to="/saved" class="btn btn-primary">Set Up Alerts</NuxtLink>
    </div>

    <!-- Notification Preferences -->
    <section class="prefs-section">
      <h2>Notification Settings</h2>
      <div class="prefs-grid">
        <div class="pref-card">
          <div class="pref-info">
            <h4>Hot Deal Alerts</h4>
            <p>Get notified for listings with flip score 85+</p>
          </div>
          <label class="toggle">
            <input type="checkbox" checked />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="pref-card">
          <div class="pref-info">
            <h4>Price Drop Alerts</h4>
            <p>When a tracked car's price decreases</p>
          </div>
          <label class="toggle">
            <input type="checkbox" checked />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="pref-card">
          <div class="pref-info">
            <h4>New Listing Alerts</h4>
            <p>All new listings matching your saved searches</p>
          </div>
          <label class="toggle">
            <input type="checkbox" checked />
            <span class="toggle-slider"></span>
          </label>
        </div>
        <div class="pref-card">
          <div class="pref-info">
            <h4>Auction Alerts</h4>
            <p>Pickles &amp; Manheim auction listings in Perth</p>
          </div>
          <label class="toggle">
            <input type="checkbox" />
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { alerts, markAsRead, markAllRead, deleteAlert } = useAlerts()

const activeFilter = ref('all')

const unreadCount = computed(() => alerts.value.filter(a => !a.read).length)

const typeFilters = computed(() => [
  { value: 'all', label: 'All', count: alerts.value.length },
  { value: 'hot_deal', label: 'Hot Deals', count: alerts.value.filter(a => a.type === 'hot_deal').length },
  { value: 'new_listing', label: 'New Listings', count: alerts.value.filter(a => a.type === 'new_listing').length },
  { value: 'price_drop', label: 'Price Drops', count: alerts.value.filter(a => a.type === 'price_drop').length },
  { value: 'saved_search', label: 'Saved Searches', count: alerts.value.filter(a => a.type === 'saved_search').length },
])

const displayedAlerts = computed(() => {
  if (activeFilter.value === 'all') return alerts.value
  return alerts.value.filter(a => a.type === activeFilter.value)
})

function iconFor(type) {
  const map = { hot_deal: '!', new_listing: '+', price_drop: '$', saved_search: '*' }
  return map[type] || '?'
}

function labelFor(type) {
  const map = { hot_deal: 'Hot Deal', new_listing: 'New Listing', price_drop: 'Price Drop', saved_search: 'Saved Search' }
  return map[type] || type
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>

<style scoped>
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  font-size: 1.75rem;
  font-weight: 800;
}

.page-desc {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-top: 0.25rem;
}

.btn-mark-all {
  background: rgba(255,255,255,0.08);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
  white-space: nowrap;
}

.btn-mark-all:hover {
  color: var(--text-primary);
  border-color: var(--accent);
}

/* Filters */
.alert-filters {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  flex-wrap: wrap;
}

.filter-chip {
  background: var(--bg-card);
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.45rem 0.85rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.filter-chip.active {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.chip-count {
  background: rgba(0,0,0,0.2);
  padding: 1px 6px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 700;
}

/* Alert Cards */
.alerts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 3rem;
}

.alert-card {
  display: flex;
  gap: 1rem;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  cursor: pointer;
  transition: all 0.2s;
}

.alert-card:hover {
  border-color: var(--text-muted);
}

.alert-card.unread {
  border-left: 3px solid var(--accent);
  background: rgba(34, 211, 238, 0.03);
}

.alert-icon {
  width: 44px;
  height: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.icon-hot_deal { background: rgba(248, 113, 113, 0.15); color: var(--red); }
.icon-new_listing { background: rgba(74, 222, 128, 0.15); color: var(--green); }
.icon-price_drop { background: rgba(251, 191, 36, 0.15); color: var(--yellow); }
.icon-saved_search { background: rgba(34, 211, 238, 0.15); color: var(--accent); }

.alert-body {
  flex: 1;
  min-width: 0;
}

.alert-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.alert-type-badge {
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 2px 6px;
  border-radius: 4px;
}

.type-hot_deal { background: rgba(248,113,113,0.15); color: var(--red); }
.type-new_listing { background: rgba(74,222,128,0.15); color: var(--green); }
.type-price_drop { background: rgba(251,191,36,0.15); color: var(--yellow); }
.type-saved_search { background: rgba(34,211,238,0.15); color: var(--accent); }

.alert-time {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.alert-body h3 {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
}

.alert-body p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.alert-action {
  margin-top: 0.5rem;
}

.alert-link {
  font-size: 0.8rem;
  color: var(--accent);
  font-weight: 500;
}

.alert-dismiss {
  background: none;
  border: none;
  color: var(--text-muted);
  font-size: 1.25rem;
  padding: 0 0.25rem;
  align-self: flex-start;
}

.alert-dismiss:hover {
  color: var(--red);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.empty-state h3 {
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
  max-width: 400px;
  margin-left: auto;
  margin-right: auto;
}

.btn {
  padding: 0.65rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.9rem;
  border: none;
  display: inline-flex;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
}

/* Preferences */
.prefs-section {
  margin-top: 2rem;
}

.prefs-section h2 {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.prefs-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.pref-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
}

.pref-info h4 {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.pref-info p {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Toggle */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
  flex-shrink: 0;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background: var(--border);
  border-radius: 12px;
  transition: 0.2s;
}

.toggle-slider::before {
  content: '';
  position: absolute;
  height: 18px;
  width: 18px;
  left: 3px;
  bottom: 3px;
  background: var(--text-primary);
  border-radius: 50%;
  transition: 0.2s;
}

.toggle input:checked + .toggle-slider {
  background: var(--accent);
}

.toggle input:checked + .toggle-slider::before {
  transform: translateX(20px);
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; gap: 1rem; }
}
</style>
