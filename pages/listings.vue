<template>
  <div class="listings-page">
    <div class="page-header">
      <h1>Perth Car Listings</h1>
      <p class="page-desc">{{ filteredListings.length }} cars found across Perth</p>
    </div>

    <!-- Filters Bar -->
    <div class="filters-bar">
      <div class="filter-row">
        <input
          v-model="filters.search"
          type="text"
          placeholder="Search make, model, suburb..."
          class="filter-input search-input"
        />
        <select v-model="filters.make" class="filter-input">
          <option value="">All Makes</option>
          <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
        </select>
        <select v-model="filters.bodyType" class="filter-input">
          <option value="">All Body Types</option>
          <option v-for="b in bodyTypes" :key="b" :value="b">{{ b }}</option>
        </select>
        <select v-model="filters.source" class="filter-input">
          <option value="">All Sources</option>
          <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
        </select>
      </div>
      <div class="filter-row">
        <input
          v-model.number="filters.minPrice"
          type="number"
          placeholder="Min Price"
          class="filter-input price-input"
        />
        <input
          v-model.number="filters.maxPrice"
          type="number"
          placeholder="Max Price"
          class="filter-input price-input"
        />
        <div class="flip-score-filter">
          <label>Min Flip Score: {{ filters.minFlipScore }}</label>
          <input v-model.number="filters.minFlipScore" type="range" min="0" max="100" class="score-slider" />
        </div>
        <select v-model="filters.sortBy" class="filter-input">
          <option value="flip-score">Sort: Best Flip Score</option>
          <option value="newest">Sort: Newest First</option>
          <option value="price-low">Sort: Price Low to High</option>
          <option value="price-high">Sort: Price High to Low</option>
          <option value="profit">Sort: Highest Profit</option>
        </select>
      </div>
      <div class="filter-actions">
        <button class="btn-filter-clear" @click="clearFilters">Clear Filters</button>
        <button class="btn-save-search" @click="showSaveSearch = true">Save This Search</button>
      </div>
    </div>

    <!-- Save Search Modal -->
    <div v-if="showSaveSearch" class="modal-overlay" @click.self="showSaveSearch = false">
      <div class="modal">
        <h3>Save Search</h3>
        <p>Get alerted when new cars match these filters.</p>
        <input v-model="searchName" type="text" placeholder="Name this search (e.g. SUVs Under $20k)" class="filter-input" style="width:100%;margin:1rem 0" />
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showSaveSearch = false">Cancel</button>
          <button class="btn btn-primary" @click="saveSearch">Save &amp; Enable Alerts</button>
        </div>
      </div>
    </div>

    <!-- Listings Grid -->
    <div v-if="filteredListings.length" class="listings-grid">
      <div v-for="listing in filteredListings" :key="listing.id" class="listing-card">
        <div class="card-top">
          <div class="card-placeholder">
            <span>{{ listing.make[0] }}{{ listing.model[0] }}</span>
          </div>
          <div class="card-badges">
            <span class="badge" :class="scoreClass(listing.flipScore)">
              Flip {{ listing.flipScore }}
            </span>
          </div>
        </div>
        <div class="card-body">
          <div class="card-source-time">
            <span class="source-tag">{{ listing.source }}</span>
            <span class="time-tag">{{ timeAgo(listing.listedAt) }}</span>
          </div>
          <h3 class="card-title">{{ listing.title }}</h3>
          <div class="card-details">
            <span>{{ listing.year }}</span>
            <span>{{ listing.mileage.toLocaleString() }} km</span>
            <span>{{ listing.transmission }}</span>
            <span>{{ listing.fuelType }}</span>
          </div>
          <div class="card-location">{{ listing.suburb }}, Perth</div>

          <div class="card-pricing">
            <div class="price-main">
              <span class="price-asking">${{ listing.price.toLocaleString() }}</span>
              <span class="price-vs">vs</span>
              <span class="price-market">${{ listing.estimatedValue.toLocaleString() }}</span>
            </div>
            <div class="profit-bar">
              <div class="profit-fill" :style="{ width: Math.min((listing.profitEstimate / listing.estimatedValue) * 100 * 3, 100) + '%' }"></div>
            </div>
            <div class="profit-amount">
              Est. Profit: <strong>+${{ listing.profitEstimate.toLocaleString() }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div v-else class="no-results">
      <h3>No listings match your filters</h3>
      <p>Try adjusting your search criteria or clearing filters.</p>
      <button class="btn btn-primary" @click="clearFilters">Clear All Filters</button>
    </div>
  </div>
</template>

<script setup>
const { filteredListings, filters, makes, bodyTypes, sources } = useListings()
const { addSavedSearch } = useAlerts()

const showSaveSearch = ref(false)
const searchName = ref('')

function clearFilters() {
  filters.value = {
    search: '',
    minPrice: null,
    maxPrice: null,
    make: '',
    bodyType: '',
    source: '',
    sortBy: 'flip-score',
    minFlipScore: 0,
  }
}

function saveSearch() {
  if (!searchName.value.trim()) return
  addSavedSearch({
    name: searchName.value,
    filters: {
      ...(filters.value.make && { make: filters.value.make }),
      ...(filters.value.bodyType && { bodyType: filters.value.bodyType }),
      ...(filters.value.maxPrice && { maxPrice: filters.value.maxPrice }),
      ...(filters.value.minFlipScore > 0 && { minFlipScore: filters.value.minFlipScore }),
      ...(filters.value.source && { source: filters.value.source }),
    },
    notifyEnabled: true,
  })
  showSaveSearch.value = false
  searchName.value = ''
}

function scoreClass(score) {
  if (score >= 85) return 'score-hot'
  if (score >= 70) return 'score-good'
  return 'score-ok'
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

/* Filters */
.filters-bar {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.filter-row {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 0.75rem;
  flex-wrap: wrap;
}

.filter-input {
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.6rem 0.85rem;
  color: var(--text-primary);
  font-size: 0.85rem;
  outline: none;
  transition: border-color 0.2s;
}

.filter-input:focus {
  border-color: var(--accent);
}

.search-input {
  flex: 2;
  min-width: 200px;
}

.price-input {
  width: 130px;
}

.flip-score-filter {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex: 1;
}

.flip-score-filter label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.score-slider {
  flex: 1;
  accent-color: var(--accent);
}

.filter-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-filter-clear {
  background: none;
  border: 1px solid var(--border);
  color: var(--text-secondary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 500;
}

.btn-filter-clear:hover {
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.btn-save-search {
  background: var(--accent);
  border: none;
  color: var(--bg-primary);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
}

.btn-save-search:hover {
  background: var(--accent-hover);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
  backdrop-filter: blur(4px);
}

.modal {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 2rem;
  max-width: 450px;
  width: 90%;
}

.modal h3 {
  margin-bottom: 0.5rem;
}

.modal p {
  color: var(--text-secondary);
  font-size: 0.85rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn {
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
  border: none;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
}

.btn-secondary {
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

/* Listings Grid */
.listings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.25rem;
}

.listing-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  overflow: hidden;
  transition: all 0.2s;
}

.listing-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.card-top {
  position: relative;
  height: 120px;
}

.card-placeholder {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #1a2332, #2a3a4a);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-muted);
}

.card-badges {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

.badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.score-hot { background: var(--green); color: #0a0a0a; }
.score-good { background: var(--yellow); color: #0a0a0a; }
.score-ok { background: var(--orange); color: #0a0a0a; }

.card-body {
  padding: 1rem;
}

.card-source-time {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.source-tag {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--accent);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.time-tag {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  line-height: 1.3;
  margin-bottom: 0.5rem;
}

.card-details {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-bottom: 0.35rem;
}

.card-details span {
  font-size: 0.75rem;
  color: var(--text-muted);
  background: rgba(255,255,255,0.04);
  padding: 2px 6px;
  border-radius: 4px;
}

.card-location {
  font-size: 0.8rem;
  color: var(--text-secondary);
  margin-bottom: 0.75rem;
}

.card-pricing {
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 0.75rem;
}

.price-main {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.price-asking {
  font-size: 1.15rem;
  font-weight: 800;
  color: var(--text-primary);
}

.price-vs {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.price-market {
  font-size: 0.85rem;
  color: var(--text-muted);
  text-decoration: line-through;
}

.profit-bar {
  height: 4px;
  background: rgba(255,255,255,0.08);
  border-radius: 2px;
  overflow: hidden;
  margin-bottom: 0.5rem;
}

.profit-fill {
  height: 100%;
  background: var(--green);
  border-radius: 2px;
  transition: width 0.3s;
}

.profit-amount {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.profit-amount strong {
  color: var(--green);
}

.no-results {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-secondary);
}

.no-results h3 {
  margin-bottom: 0.5rem;
  color: var(--text-primary);
}

.no-results p {
  margin-bottom: 1.5rem;
}

@media (max-width: 768px) {
  .filter-row { flex-direction: column; }
  .price-input { width: 100%; }
  .search-input { min-width: auto; }
}
</style>
