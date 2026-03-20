<template>
  <div v-if="listing" class="detail-page">
    <NuxtLink to="/listings" class="back-link">&larr; Back to listings</NuxtLink>

    <!-- Header -->
    <div class="detail-header">
      <div class="header-left">
        <div class="header-badges">
          <span class="badge-condition" :class="'cond-' + listing.condition.toLowerCase().replace(' ', '-')">
            {{ listing.condition }}
          </span>
          <span class="badge-source">{{ listing.source }}</span>
          <span class="badge-seller">{{ listing.sellerType }}</span>
        </div>
        <h1>{{ listing.title }}</h1>
        <div class="header-meta">
          <span>{{ listing.suburb }}, Perth {{ listing.region }}</span>
          <span>&bull;</span>
          <span>{{ listing.year }} &bull; {{ listing.mileage.toLocaleString() }} km &bull; {{ listing.transmission }} &bull; {{ listing.fuelType }}</span>
          <span>&bull;</span>
          <span>{{ listing.colour }}</span>
        </div>
      </div>
      <div class="header-actions">
        <button class="btn-watch" :class="{ watched: isWatched(listing.id) }" @click="toggleWatchlist(listing.id)">
          {{ isWatched(listing.id) ? 'Saved' : 'Save' }}
        </button>
        <a :href="listing.url" target="_blank" rel="noopener" class="btn-external">View Original &nearr;</a>
      </div>
    </div>

    <div class="detail-grid">
      <!-- Left Column -->
      <div class="detail-left">
        <!-- Car Image Placeholder -->
        <div class="image-placeholder">
          <span class="image-initials">{{ listing.make[0] }}{{ listing.model[0] }}</span>
          <span class="image-label">{{ listing.year }} {{ listing.make }} {{ listing.model }}</span>
        </div>

        <!-- Condition & History -->
        <div class="info-card">
          <h3>Condition &amp; History</h3>
          <div class="info-grid">
            <div class="info-item">
              <span class="info-label">Condition</span>
              <span class="info-value" :class="'cond-text-' + listing.condition.toLowerCase().replace(' ', '-')">{{ listing.condition }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Service History</span>
              <span class="info-value">{{ listing.serviceHistory }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Previous Owners</span>
              <span class="info-value">{{ listing.previousOwners || 'Unknown' }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Rego Expiry</span>
              <span class="info-value">{{ formatDate(listing.regoExpiry) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Listed</span>
              <span class="info-value">{{ timeAgo(listing.listedAt) }}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Seller Type</span>
              <span class="info-value">{{ listing.sellerType }}</span>
            </div>
          </div>
          <div v-if="listing.conditionNotes" class="condition-notes">
            <strong>Notes:</strong> {{ listing.conditionNotes }}
          </div>
        </div>

        <!-- Similar Deals -->
        <div v-if="similarDeals.length" class="info-card">
          <h3>Similar Deals in Perth</h3>
          <div class="similar-grid">
            <NuxtLink v-for="sim in similarDeals" :key="sim.id" :to="'/listings/' + sim.id" class="similar-card">
              <div class="similar-top">
                <span class="similar-score" :class="scoreClass(sim.flipScore)">{{ sim.flipScore }}</span>
                <span class="similar-price">${{ sim.price.toLocaleString() }}</span>
              </div>
              <div class="similar-title">{{ sim.year }} {{ sim.make }} {{ sim.model }}</div>
              <div class="similar-meta">{{ sim.suburb }} &bull; {{ sim.mileage.toLocaleString() }} km</div>
            </NuxtLink>
          </div>
        </div>
      </div>

      <!-- Right Column -->
      <div class="detail-right">
        <!-- Flip Score Breakdown -->
        <div class="score-card">
          <div class="score-header">
            <div>
              <h3>Flip Score</h3>
              <p class="score-subtitle">Why this car scored {{ listing.flipScore }}/100</p>
            </div>
            <div class="score-big" :class="scoreClass(listing.flipScore)">{{ listing.flipScore }}</div>
          </div>
          <div class="score-factors">
            <div v-for="factor in scoreFactors" :key="factor.label" class="factor-row">
              <div class="factor-info">
                <span class="factor-label">{{ factor.label }}</span>
                <span class="factor-weight">{{ factor.weight }}%</span>
              </div>
              <div class="factor-bar-bg">
                <div class="factor-bar-fill" :class="factorClass(factor.value)" :style="{ width: factor.value + '%' }"></div>
              </div>
              <span class="factor-value" :class="factorClass(factor.value)">{{ factor.value }}</span>
            </div>
          </div>
          <div class="score-verdict">
            <strong>Verdict:</strong> {{ getVerdict(listing.flipScore) }}
          </div>
        </div>

        <!-- Deal Calculator -->
        <div class="calc-card">
          <h3>Deal Calculator</h3>
          <p class="calc-subtitle">Estimate your real profit after all costs</p>

          <div class="calc-section">
            <h4>Buy</h4>
            <div class="calc-row">
              <label>Purchase Price</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input v-model.number="calc.purchasePrice" type="number" class="calc-input" />
              </div>
            </div>
            <div v-if="listing.auctionFeePercent" class="calc-row">
              <label>Auction Buyer Premium ({{ listing.auctionFeePercent }}%)</label>
              <span class="calc-value">${{ auctionFee.toLocaleString() }}</span>
            </div>
          </div>

          <div class="calc-section">
            <h4>Costs</h4>
            <div class="calc-row">
              <label>Transport</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input v-model.number="calc.transport" type="number" class="calc-input" />
              </div>
            </div>
            <div class="calc-row">
              <label>Detailing / Cleanup</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input v-model.number="calc.detailing" type="number" class="calc-input" />
              </div>
            </div>
            <div class="calc-row">
              <label>Mechanical / Repairs</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input v-model.number="calc.repairs" type="number" class="calc-input" />
              </div>
            </div>
            <div class="calc-row">
              <label>Rego Transfer</label>
              <span class="calc-value">${{ calc.regoTransfer }}</span>
            </div>
            <div class="calc-row">
              <label>Roadworthy / Inspection</label>
              <span class="calc-value">${{ calc.roadworthy }}</span>
            </div>
          </div>

          <div class="calc-section">
            <h4>Sell</h4>
            <div class="calc-row">
              <label>Expected Sale Price</label>
              <div class="calc-input-wrap">
                <span class="calc-prefix">$</span>
                <input v-model.number="calc.salePrice" type="number" class="calc-input" />
              </div>
            </div>
          </div>

          <div class="calc-results">
            <div class="calc-result-row">
              <span>Total Investment</span>
              <span class="calc-result-value">${{ totalInvestment.toLocaleString() }}</span>
            </div>
            <div class="calc-result-row">
              <span>Total Costs</span>
              <span class="calc-result-value">${{ totalCosts.toLocaleString() }}</span>
            </div>
            <div class="calc-result-row result-profit" :class="{ negative: netProfit < 0 }">
              <span>Net Profit</span>
              <span class="calc-result-value">{{ netProfit >= 0 ? '+' : '' }}${{ netProfit.toLocaleString() }}</span>
            </div>
            <div class="calc-result-row">
              <span>ROI</span>
              <span class="calc-result-value" :class="{ negative: roi < 0 }">{{ roi.toFixed(1) }}%</span>
            </div>
            <div class="calc-result-row">
              <span>Break-even Sale Price</span>
              <span class="calc-result-value">${{ breakEven.toLocaleString() }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <div v-else class="not-found">
    <h2>Listing not found</h2>
    <p>This car may have been sold or removed.</p>
    <NuxtLink to="/listings" class="btn-back">Browse Listings</NuxtLink>
  </div>
</template>

<script setup>
const route = useRoute()
const { getListingById, getSimilarListings } = useListings()
const { toggleWatchlist, isWatched } = useWatchlist()

const listing = computed(() => getListingById(route.params.id))
const similarDeals = computed(() => listing.value ? getSimilarListings(listing.value) : [])

const scoreFactors = computed(() => {
  if (!listing.value) return []
  const b = listing.value.flipScoreBreakdown
  return [
    { label: 'Price vs Market Gap', weight: 40, value: b.priceGap },
    { label: 'Brand Demand in Perth', weight: 15, value: b.demand },
    { label: 'Mileage for Age', weight: 15, value: b.mileageForAge },
    { label: 'Source Reliability', weight: 15, value: b.sourceReliability },
    { label: 'Days on Market', weight: 15, value: b.daysOnMarket },
  ]
})

// Deal calculator state
const defaultRepairs = computed(() => {
  if (!listing.value) return 0
  const c = listing.value.condition
  if (c === 'Damaged') return 3000
  if (c === 'Needs Work') return 1500
  if (c === 'Fair') return 500
  return 0
})

const calc = reactive({
  purchasePrice: listing.value?.price || 0,
  transport: 150,
  detailing: 400,
  repairs: defaultRepairs.value,
  regoTransfer: 200,
  roadworthy: 300,
  salePrice: listing.value?.estimatedValue || 0,
})

// Update calc when listing changes
watch(() => listing.value, (l) => {
  if (l) {
    calc.purchasePrice = l.price
    calc.salePrice = l.estimatedValue
    calc.repairs = defaultRepairs.value
  }
}, { immediate: true })

const auctionFee = computed(() => {
  if (!listing.value?.auctionFeePercent) return 0
  return Math.round(calc.purchasePrice * listing.value.auctionFeePercent / 100)
})

const totalCosts = computed(() =>
  auctionFee.value + calc.transport + calc.detailing + calc.repairs + calc.regoTransfer + calc.roadworthy
)

const totalInvestment = computed(() => calc.purchasePrice + totalCosts.value)

const netProfit = computed(() => calc.salePrice - totalInvestment.value)

const roi = computed(() => {
  if (totalInvestment.value === 0) return 0
  return (netProfit.value / totalInvestment.value) * 100
})

const breakEven = computed(() => totalInvestment.value)

function scoreClass(score) {
  if (score >= 75) return 'score-hot'
  if (score >= 50) return 'score-good'
  return 'score-bad'
}

function factorClass(value) {
  if (value >= 75) return 'factor-high'
  if (value >= 50) return 'factor-mid'
  return 'factor-low'
}

function getVerdict(score) {
  if (score >= 85) return 'Excellent flip opportunity. Move fast — these don\'t last.'
  if (score >= 75) return 'Strong deal. Worth inspecting and negotiating.'
  if (score >= 60) return 'Decent potential but margins are tight. Negotiate hard or pass.'
  if (score >= 40) return 'Risky. Only if you can get a significant price drop.'
  return 'Avoid. Overpriced, high risk, or no demand.'
}

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

function formatDate(dateStr) {
  return new Date(dateStr).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })
}
</script>

<style scoped>
.back-link {
  display: inline-block;
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 1.25rem;
}

/* Header */
.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.header-badges {
  display: flex;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.header-badges span {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.badge-condition { border: 1px solid var(--border); }
.cond-excellent { background: rgba(74,222,128,0.15); color: var(--green); border-color: rgba(74,222,128,0.3); }
.cond-good { background: rgba(251,191,36,0.15); color: var(--yellow); border-color: rgba(251,191,36,0.3); }
.cond-fair { background: rgba(251,146,60,0.15); color: var(--orange); border-color: rgba(251,146,60,0.3); }
.cond-needs-work { background: rgba(248,113,113,0.15); color: var(--red); border-color: rgba(248,113,113,0.3); }
.cond-damaged { background: rgba(248,113,113,0.25); color: var(--red); border-color: rgba(248,113,113,0.4); }

.badge-source { background: rgba(34,211,238,0.1); color: var(--accent); }
.badge-seller { background: rgba(255,255,255,0.05); color: var(--text-muted); }

.detail-header h1 {
  font-size: 1.5rem;
  font-weight: 800;
  line-height: 1.2;
  margin-bottom: 0.35rem;
}

.header-meta {
  display: flex;
  gap: 0.4rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  flex-wrap: wrap;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0;
}

.btn-watch, .btn-external {
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-size: 0.8rem;
  font-weight: 600;
  border: 1px solid var(--border);
  background: var(--bg-card);
  color: var(--text-primary);
  white-space: nowrap;
}

.btn-watch.watched {
  background: var(--accent);
  color: var(--bg-primary);
  border-color: var(--accent);
}

.btn-external {
  background: rgba(255,255,255,0.05);
  color: var(--accent);
  border-color: var(--accent);
  text-decoration: none;
}

/* Grid Layout */
.detail-grid {
  display: grid;
  grid-template-columns: 1fr 420px;
  gap: 1.5rem;
  align-items: start;
}

/* Left Column */
.image-placeholder {
  background: linear-gradient(135deg, #1a2332, #2a3a4a);
  border-radius: var(--radius);
  height: 240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

.image-initials {
  font-size: 4rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.image-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.5rem;
}

.info-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.info-card h3 {
  font-size: 1rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 1rem;
  margin-bottom: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.info-label {
  font-size: 0.7rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.info-value {
  font-size: 0.85rem;
  font-weight: 600;
}

.cond-text-excellent { color: var(--green); }
.cond-text-good { color: var(--yellow); }
.cond-text-fair { color: var(--orange); }
.cond-text-needs-work { color: var(--red); }
.cond-text-damaged { color: var(--red); }

.condition-notes {
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Similar Deals */
.similar-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.similar-card {
  background: rgba(0,0,0,0.2);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.75rem;
  text-decoration: none;
  transition: border-color 0.2s;
}

.similar-card:hover {
  border-color: var(--accent);
}

.similar-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.35rem;
}

.similar-score {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.similar-price {
  font-size: 0.8rem;
  font-weight: 700;
}

.similar-title {
  font-size: 0.8rem;
  font-weight: 600;
  margin-bottom: 0.2rem;
}

.similar-meta {
  font-size: 0.7rem;
  color: var(--text-muted);
}

/* Score Card */
.score-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
  margin-bottom: 1.5rem;
}

.score-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.score-header h3 {
  font-size: 1rem;
  font-weight: 700;
}

.score-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.15rem;
}

.score-big {
  font-size: 2.25rem;
  font-weight: 800;
  line-height: 1;
  padding: 0.35rem 0.75rem;
  border-radius: 10px;
}

.score-hot { background: rgba(74,222,128,0.15); color: var(--green); }
.score-good { background: rgba(251,191,36,0.15); color: var(--yellow); }
.score-bad { background: rgba(248,113,113,0.15); color: var(--red); }

.score-factors {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  margin-bottom: 1rem;
}

.factor-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.factor-info {
  width: 160px;
  flex-shrink: 0;
  display: flex;
  justify-content: space-between;
}

.factor-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.factor-weight {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.factor-bar-bg {
  flex: 1;
  height: 6px;
  background: rgba(255,255,255,0.06);
  border-radius: 3px;
  overflow: hidden;
}

.factor-bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.3s;
}

.factor-high { background: var(--green); color: var(--green); }
.factor-mid { background: var(--yellow); color: var(--yellow); }
.factor-low { background: var(--red); color: var(--red); }

.factor-value {
  font-size: 0.8rem;
  font-weight: 700;
  width: 30px;
  text-align: right;
}

.score-verdict {
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

/* Calculator Card */
.calc-card {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.25rem;
}

.calc-card h3 {
  font-size: 1rem;
  font-weight: 700;
}

.calc-subtitle {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: 1rem;
}

.calc-section {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.calc-section h4 {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 0.5rem;
}

.calc-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.3rem 0;
}

.calc-row label {
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.calc-input-wrap {
  display: flex;
  align-items: center;
  background: var(--bg-primary);
  border: 1px solid var(--border);
  border-radius: 6px;
  overflow: hidden;
}

.calc-prefix {
  padding: 0.35rem 0.5rem;
  font-size: 0.8rem;
  color: var(--text-muted);
  border-right: 1px solid var(--border);
}

.calc-input {
  background: transparent;
  border: none;
  color: var(--text-primary);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.35rem 0.5rem;
  width: 100px;
  text-align: right;
  outline: none;
}

.calc-value {
  font-size: 0.8rem;
  font-weight: 500;
  color: var(--text-secondary);
}

/* Results */
.calc-results {
  background: rgba(0,0,0,0.25);
  border-radius: 8px;
  padding: 0.75rem;
}

.calc-result-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.35rem 0;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.calc-result-value {
  font-weight: 700;
  color: var(--text-primary);
}

.result-profit {
  border-top: 1px solid var(--border);
  margin-top: 0.25rem;
  padding-top: 0.5rem;
  font-weight: 600;
}

.result-profit .calc-result-value {
  color: var(--green);
  font-size: 1.1rem;
}

.result-profit.negative .calc-result-value {
  color: var(--red);
}

.negative {
  color: var(--red) !important;
}

/* Not Found */
.not-found {
  text-align: center;
  padding: 4rem 1rem;
}

.not-found h2 {
  margin-bottom: 0.5rem;
}

.not-found p {
  color: var(--text-secondary);
  margin-bottom: 1.5rem;
}

.btn-back {
  display: inline-block;
  background: var(--accent);
  color: var(--bg-primary);
  padding: 0.6rem 1.25rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.85rem;
}

@media (max-width: 900px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }
  .detail-header {
    flex-direction: column;
  }
  .info-grid {
    grid-template-columns: 1fr 1fr;
  }
  .similar-grid {
    grid-template-columns: 1fr;
  }
  .factor-info {
    width: 120px;
  }
}
</style>
