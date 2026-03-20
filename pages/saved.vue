<template>
  <div class="saved-page">
    <div class="page-header">
      <div>
        <h1>Saved Searches</h1>
        <p class="page-desc">Get notified when new cars match your criteria in Perth</p>
      </div>
      <button class="btn btn-primary" @click="showCreate = true">+ New Search</button>
    </div>

    <!-- Saved Searches List -->
    <div v-if="savedSearches.length" class="searches-list">
      <div v-for="search in savedSearches" :key="search.id" class="search-card">
        <div class="search-main">
          <div class="search-header">
            <h3>{{ search.name }}</h3>
            <label class="toggle">
              <input type="checkbox" :checked="search.notifyEnabled" @change="toggleSearchNotify(search.id)" />
              <span class="toggle-slider"></span>
            </label>
          </div>
          <div class="search-filters">
            <span v-if="search.filters.make" class="filter-tag">{{ search.filters.make }}</span>
            <span v-if="search.filters.bodyType" class="filter-tag">{{ search.filters.bodyType }}</span>
            <span v-if="search.filters.maxPrice" class="filter-tag">Under ${{ search.filters.maxPrice.toLocaleString() }}</span>
            <span v-if="search.filters.minFlipScore" class="filter-tag">Score {{ search.filters.minFlipScore }}+</span>
            <span v-if="search.filters.source" class="filter-tag">{{ search.filters.source }}</span>
            <span v-if="search.filters.region" class="filter-tag">{{ search.filters.region }} Perth</span>
          </div>
          <div class="search-meta">
            <NuxtLink :to="searchResultsUrl(search)" class="match-link">
              {{ getMatchCount(search.id) }} matching car{{ getMatchCount(search.id) !== 1 ? 's' : '' }} &rarr;
            </NuxtLink>
            <span>&bull;</span>
            <span v-if="search.lastTriggered">Last alert: {{ timeAgo(search.lastTriggered) }}</span>
            <span v-else>No alerts yet</span>
            <span>&bull;</span>
            <span>Created {{ timeAgo(search.createdAt) }}</span>
          </div>
        </div>
        <div class="search-actions">
          <span class="notify-status" :class="{ active: search.notifyEnabled }">
            {{ search.notifyEnabled ? 'Alerts ON' : 'Alerts OFF' }}
          </span>
          <button class="btn-delete" @click="deleteSavedSearch(search.id)">Delete</button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">&#128269;</div>
      <h3>No saved searches yet</h3>
      <p>Create a saved search to get alerted when matching cars are listed in Perth.</p>
      <button class="btn btn-primary" @click="showCreate = true">Create Your First Search</button>
    </div>

    <!-- Create Modal -->
    <div v-if="showCreate" class="modal-overlay" @click.self="showCreate = false">
      <div class="modal" role="dialog" aria-label="Create saved search">
        <h3>Create Saved Search</h3>
        <p class="modal-desc">We'll alert you when new listings match these criteria.</p>
        <div class="form-group">
          <label>Search Name</label>
          <input v-model="newSearch.name" type="text" placeholder="e.g. SUVs Under $20k" class="form-input" />
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Make</label>
            <select v-model="newSearch.make" class="form-input">
              <option value="">Any Make</option>
              <option v-for="m in makes" :key="m" :value="m">{{ m }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Body Type</label>
            <select v-model="newSearch.bodyType" class="form-input">
              <option value="">Any Type</option>
              <option v-for="b in bodyTypes" :key="b" :value="b">{{ b }}</option>
            </select>
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Max Price</label>
            <input v-model.number="newSearch.maxPrice" type="number" placeholder="e.g. 20000" class="form-input" />
          </div>
          <div class="form-group">
            <label>Min Flip Score</label>
            <input v-model.number="newSearch.minFlipScore" type="number" placeholder="e.g. 70" min="0" max="100" class="form-input" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group">
            <label>Source</label>
            <select v-model="newSearch.source" class="form-input">
              <option value="">Any Source</option>
              <option v-for="s in sources" :key="s" :value="s">{{ s }}</option>
            </select>
          </div>
          <div class="form-group">
            <label>Region</label>
            <select v-model="newSearch.region" class="form-input">
              <option value="">All Perth</option>
              <option value="North">North</option>
              <option value="South">South</option>
              <option value="East">East</option>
              <option value="Central">Central</option>
            </select>
          </div>
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showCreate = false">Cancel</button>
          <button class="btn btn-primary" :disabled="!newSearch.name" @click="createSearch">Create &amp; Enable Alerts</button>
        </div>
      </div>
    </div>

    <!-- Tips -->
    <section class="tips-section">
      <h2>Perth Flipper Tips</h2>
      <div class="tips-grid">
        <div class="tip-card">
          <h4>Best Makes to Flip</h4>
          <p>Toyota, Mazda and Hyundai sell fastest. Hilux and Ranger utes always have strong demand in WA. Avoid European cars unless you know the repair costs.</p>
        </div>
        <div class="tip-card">
          <h4>Where to Find Deals</h4>
          <p>Deceased estates, divorce sales and repo auctions (Pickles Welshpool, Manheim) often have the best margins. Ex-fleet clearances are worth watching too.</p>
        </div>
        <div class="tip-card">
          <h4>Factor In Real Costs</h4>
          <p>Use the deal calculator on each listing. Auction fees (10-15%), transport, detailing ($400+), rego transfer ($200), and roadworthy ($300) add up fast.</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { savedSearches, toggleSearchNotify, deleteSavedSearch, addSavedSearch, getMatchCount } = useAlerts()
const { makes, bodyTypes, sources, filters: listingFilters } = useListings()
const router = useRouter()

const showCreate = ref(false)
const newSearch = ref({ name: '', make: '', bodyType: '', maxPrice: null, minFlipScore: null, source: '', region: '' })

function searchResultsUrl(search) {
  const params = new URLSearchParams()
  if (search.filters.make) params.set('make', search.filters.make)
  if (search.filters.bodyType) params.set('bodyType', search.filters.bodyType)
  if (search.filters.maxPrice) params.set('maxPrice', String(search.filters.maxPrice))
  if (search.filters.minFlipScore) params.set('minFlipScore', String(search.filters.minFlipScore))
  if (search.filters.source) params.set('source', search.filters.source)
  if (search.filters.region) params.set('region', search.filters.region)
  return '/listings?' + params.toString()
}

function createSearch() {
  if (!newSearch.value.name.trim()) return
  const filters = {}
  if (newSearch.value.make) filters.make = newSearch.value.make
  if (newSearch.value.bodyType) filters.bodyType = newSearch.value.bodyType
  if (newSearch.value.maxPrice) filters.maxPrice = newSearch.value.maxPrice
  if (newSearch.value.minFlipScore) filters.minFlipScore = newSearch.value.minFlipScore
  if (newSearch.value.source) filters.source = newSearch.value.source
  if (newSearch.value.region) filters.region = newSearch.value.region
  addSavedSearch({ name: newSearch.value.name, filters, notifyEnabled: true })
  showCreate.value = false
  newSearch.value = { name: '', make: '', bodyType: '', maxPrice: null, minFlipScore: null, source: '', region: '' }
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  if (days < 7) return `${days}d ago`
  return `${Math.floor(days / 7)}w ago`
}
</script>

<style scoped>
.page-header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.75rem; font-weight: 800; }
.page-desc { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }

.btn { padding: 0.6rem 1.25rem; border-radius: 8px; font-weight: 600; font-size: 0.85rem; border: none; cursor: pointer; }
.btn-primary { background: var(--accent); color: var(--bg-primary); }
.btn-primary:hover { background: var(--accent-hover); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
.btn-secondary { background: rgba(255,255,255,0.08); color: var(--text-primary); border: 1px solid var(--border); }

.searches-list { display: flex; flex-direction: column; gap: 1rem; margin-bottom: 3rem; }
.search-card { display: flex; justify-content: space-between; align-items: flex-start; gap: 1.5rem; padding: 1.25rem; background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); }
.search-header { display: flex; align-items: center; gap: 1rem; margin-bottom: 0.75rem; }
.search-header h3 { font-size: 1.05rem; font-weight: 700; }
.search-filters { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem; }
.filter-tag { background: rgba(34,211,238,0.1); color: var(--accent); padding: 3px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; }
.search-meta { display: flex; gap: 0.5rem; font-size: 0.75rem; color: var(--text-muted); align-items: center; flex-wrap: wrap; }
.match-link { color: var(--accent); font-weight: 600; text-decoration: none; }
.match-link:hover { text-decoration: underline; }

.search-actions { display: flex; flex-direction: column; align-items: flex-end; gap: 0.5rem; flex-shrink: 0; }
.notify-status { font-size: 0.7rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: var(--text-muted); }
.notify-status.active { color: var(--green); }
.btn-delete { background: none; border: 1px solid var(--border); color: var(--text-muted); padding: 0.3rem 0.75rem; border-radius: 6px; font-size: 0.75rem; cursor: pointer; }
.btn-delete:hover { color: var(--red); border-color: var(--red); }

.toggle { position: relative; display: inline-block; width: 40px; height: 22px; flex-shrink: 0; }
.toggle input { opacity: 0; width: 0; height: 0; }
.toggle-slider { position: absolute; cursor: pointer; inset: 0; background: var(--border); border-radius: 11px; transition: 0.2s; }
.toggle-slider::before { content: ''; position: absolute; height: 16px; width: 16px; left: 3px; bottom: 3px; background: var(--text-primary); border-radius: 50%; transition: 0.2s; }
.toggle input:checked + .toggle-slider { background: var(--accent); }
.toggle input:checked + .toggle-slider::before { transform: translateX(18px); }

.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.6); display: flex; align-items: center; justify-content: center; z-index: 200; backdrop-filter: blur(4px); }
.modal { background: var(--bg-secondary); border: 1px solid var(--border); border-radius: var(--radius); padding: 2rem; max-width: 500px; width: 90%; }
.modal h3 { font-size: 1.2rem; margin-bottom: 0.35rem; }
.modal-desc { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 1.5rem; }
.form-group { margin-bottom: 1rem; flex: 1; }
.form-group label { display: block; font-size: 0.8rem; font-weight: 600; color: var(--text-secondary); margin-bottom: 0.35rem; }
.form-input { width: 100%; background: var(--bg-primary); border: 1px solid var(--border); border-radius: 8px; padding: 0.6rem 0.85rem; color: var(--text-primary); font-size: 0.85rem; outline: none; }
.form-input:focus { border-color: var(--accent); }
.form-row { display: flex; gap: 1rem; }
.modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; }

.empty-state { text-align: center; padding: 3rem 1rem; margin-bottom: 2rem; }
.empty-icon { font-size: 3rem; margin-bottom: 1rem; }
.empty-state h3 { margin-bottom: 0.5rem; }
.empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; }

.tips-section { margin-top: 2rem; }
.tips-section h2 { font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; }
.tips-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(260px, 1fr)); gap: 1rem; }
.tip-card { background: var(--bg-card); border: 1px solid var(--border); border-radius: var(--radius); padding: 1.25rem; }
.tip-card h4 { font-size: 0.9rem; margin-bottom: 0.5rem; color: var(--accent); }
.tip-card p { font-size: 0.8rem; color: var(--text-secondary); line-height: 1.5; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; gap: 1rem; }
  .search-card { flex-direction: column; }
  .form-row { flex-direction: column; gap: 0; }
}
</style>
