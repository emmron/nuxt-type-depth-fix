<template>
  <div class="home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">
          Find Underpriced Cars
          <span class="hero-highlight">in Perth</span>
        </h1>
        <p class="hero-subtitle">
          Get instant alerts when cars are listed below market value across Gumtree, Facebook Marketplace, Carsales &amp; auctions. Built for flippers, by flippers.
        </p>
        <div class="hero-actions">
          <NuxtLink to="/listings" class="btn btn-primary">Browse Listings</NuxtLink>
          <NuxtLink to="/alerts" class="btn btn-secondary">View Alerts</NuxtLink>
        </div>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ listings.length }}</span>
            <span class="stat-label">Active Deals</span>
          </div>
          <div class="stat">
            <span class="stat-value">${{ avgProfit.toLocaleString() }}</span>
            <span class="stat-label">Avg Profit</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ unreadAlerts }}</span>
            <span class="stat-label">New Alerts</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Hot Deals -->
    <section class="section">
      <div class="section-header">
        <h2>Hot Deals Right Now</h2>
        <NuxtLink to="/listings" class="view-all">View all &rarr;</NuxtLink>
      </div>
      <div class="card-grid">
        <div v-for="listing in hotDeals" :key="listing.id" class="listing-card">
          <div class="card-image">
            <div class="card-placeholder">
              <span>{{ listing.make[0] }}{{ listing.model[0] }}</span>
            </div>
            <div class="card-badges">
              <span class="badge badge-score" :class="scoreClass(listing.flipScore)">
                {{ listing.flipScore }}/100
              </span>
              <span class="badge badge-source">{{ listing.source }}</span>
            </div>
          </div>
          <div class="card-body">
            <h3 class="card-title">{{ listing.title }}</h3>
            <div class="card-meta">
              <span>{{ listing.suburb }}</span>
              <span>&bull;</span>
              <span>{{ listing.mileage.toLocaleString() }} km</span>
              <span>&bull;</span>
              <span>{{ listing.transmission }}</span>
            </div>
            <div class="card-pricing">
              <div class="price-row">
                <span class="price-label">Asking</span>
                <span class="price-value">${{ listing.price.toLocaleString() }}</span>
              </div>
              <div class="price-row">
                <span class="price-label">Market Value</span>
                <span class="price-value price-market">${{ listing.estimatedValue.toLocaleString() }}</span>
              </div>
              <div class="price-row profit-row">
                <span class="price-label">Est. Profit</span>
                <span class="price-value price-profit">+${{ listing.profitEstimate.toLocaleString() }}</span>
              </div>
            </div>
            <div class="card-footer">
              <span class="time-ago">{{ timeAgo(listing.listedAt) }}</span>
              <NuxtLink to="/listings" class="btn btn-sm">Details</NuxtLink>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="section">
      <h2 class="section-title-center">How It Works</h2>
      <div class="steps-grid">
        <div class="step">
          <div class="step-icon">1</div>
          <h3>We Scan Perth</h3>
          <p>Monitors Gumtree, Facebook Marketplace, Carsales, Pickles &amp; Manheim auctions across all Perth suburbs.</p>
        </div>
        <div class="step">
          <div class="step-icon">2</div>
          <h3>AI Scores Deals</h3>
          <p>Each listing gets a Flip Score based on price vs market value, demand, condition keywords &amp; profit potential.</p>
        </div>
        <div class="step">
          <div class="step-icon">3</div>
          <h3>Get Alerted Instantly</h3>
          <p>Set up saved searches and get push notifications the moment a matching deal drops. Be first to call.</p>
        </div>
        <div class="step">
          <div class="step-icon">4</div>
          <h3>Flip for Profit</h3>
          <p>Buy low, clean up, and resell. Track your margins and build your flipping business in Perth.</p>
        </div>
      </div>
    </section>

    <!-- Recent Alerts Preview -->
    <section class="section">
      <div class="section-header">
        <h2>Recent Alerts</h2>
        <NuxtLink to="/alerts" class="view-all">View all &rarr;</NuxtLink>
      </div>
      <div class="alerts-preview">
        <div v-for="alert in recentAlerts" :key="alert.id" class="alert-row" :class="{ unread: !alert.read }">
          <div class="alert-icon" :class="'alert-' + alert.type">
            {{ alertIcon(alert.type) }}
          </div>
          <div class="alert-content">
            <strong>{{ alert.title }}</strong>
            <p>{{ alert.message }}</p>
          </div>
          <span class="alert-time">{{ timeAgo(alert.createdAt) }}</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const { listings } = useListings()
const { alerts } = useAlerts()

const hotDeals = computed(() =>
  [...listings.value].sort((a, b) => b.flipScore - a.flipScore).slice(0, 4)
)

const avgProfit = computed(() => {
  const total = listings.value.reduce((sum, l) => sum + l.profitEstimate, 0)
  return Math.round(total / listings.value.length)
})

const unreadAlerts = computed(() => alerts.value.filter(a => !a.read).length)

const recentAlerts = computed(() => alerts.value.slice(0, 3))

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

function alertIcon(type) {
  const icons = { new_listing: '+', price_drop: '$', hot_deal: '!', saved_search: '*' }
  return icons[type] || '?'
}
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 0 4rem;
}

.hero-title {
  font-size: 2.75rem;
  font-weight: 800;
  line-height: 1.1;
  margin-bottom: 1rem;
}

.hero-highlight {
  display: block;
  color: var(--accent);
}

.hero-subtitle {
  color: var(--text-secondary);
  font-size: 1.1rem;
  max-width: 600px;
  margin: 0 auto 2rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

.btn {
  padding: 0.75rem 1.75rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 0.95rem;
  border: none;
  transition: all 0.2s;
  display: inline-flex;
  align-items: center;
}

.btn-primary {
  background: var(--accent);
  color: var(--bg-primary);
}

.btn-primary:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-secondary {
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.btn-secondary:hover {
  background: rgba(255,255,255,0.12);
}

.btn-sm {
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  border-radius: 8px;
  background: rgba(255,255,255,0.08);
  color: var(--text-primary);
  border: 1px solid var(--border);
}

.hero-stats {
  display: flex;
  gap: 3rem;
  justify-content: center;
}

.stat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-value {
  font-size: 1.75rem;
  font-weight: 800;
  color: var(--accent);
}

.stat-label {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 0.25rem;
}

.section {
  margin-bottom: 3rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
}

.section-title-center {
  text-align: center;
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 2rem;
}

.view-all {
  color: var(--accent);
  font-size: 0.9rem;
  font-weight: 500;
}

.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.25rem;
}

.listing-card {
  background: var(--bg-card);
  border-radius: var(--radius);
  border: 1px solid var(--border);
  overflow: hidden;
  transition: all 0.2s;
}

.listing-card:hover {
  border-color: var(--accent);
  transform: translateY(-2px);
}

.card-image {
  position: relative;
  height: 140px;
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
  letter-spacing: 0.05em;
}

.card-badges {
  position: absolute;
  top: 0.5rem;
  left: 0.5rem;
  right: 0.5rem;
  display: flex;
  justify-content: space-between;
}

.badge {
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.7rem;
  font-weight: 700;
}

.badge-source {
  background: rgba(0,0,0,0.6);
  color: var(--text-primary);
  backdrop-filter: blur(4px);
}

.score-hot { background: var(--green); color: #0a0a0a; }
.score-good { background: var(--yellow); color: #0a0a0a; }
.score-ok { background: var(--orange); color: #0a0a0a; }

.card-body {
  padding: 1rem;
}

.card-title {
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-meta {
  display: flex;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.card-pricing {
  background: rgba(0,0,0,0.2);
  border-radius: 8px;
  padding: 0.75rem;
  margin-bottom: 0.75rem;
}

.price-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  padding: 0.15rem 0;
}

.price-label {
  color: var(--text-muted);
}

.price-value {
  font-weight: 600;
}

.price-market {
  color: var(--text-secondary);
}

.profit-row {
  border-top: 1px solid var(--border);
  margin-top: 0.25rem;
  padding-top: 0.35rem;
}

.price-profit {
  color: var(--green);
  font-weight: 700;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.time-ago {
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Steps */
.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.step {
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 1.5rem;
  text-align: center;
}

.step-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: var(--accent);
  color: var(--bg-primary);
  font-weight: 800;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1rem;
}

.step h3 {
  font-size: 1rem;
  margin-bottom: 0.5rem;
}

.step p {
  font-size: 0.85rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

/* Alerts Preview */
.alerts-preview {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.alert-row {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: var(--bg-card);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  transition: all 0.2s;
}

.alert-row.unread {
  border-left: 3px solid var(--accent);
  background: rgba(34, 211, 238, 0.03);
}

.alert-icon {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  flex-shrink: 0;
}

.alert-hot_deal { background: rgba(248, 113, 113, 0.15); color: var(--red); }
.alert-new_listing { background: rgba(74, 222, 128, 0.15); color: var(--green); }
.alert-price_drop { background: rgba(251, 191, 36, 0.15); color: var(--yellow); }
.alert-saved_search { background: rgba(34, 211, 238, 0.15); color: var(--accent); }

.alert-content {
  flex: 1;
  min-width: 0;
}

.alert-content strong {
  font-size: 0.9rem;
  display: block;
  margin-bottom: 0.25rem;
}

.alert-content p {
  font-size: 0.8rem;
  color: var(--text-secondary);
  line-height: 1.4;
}

.alert-time {
  font-size: 0.75rem;
  color: var(--text-muted);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .hero-title { font-size: 2rem; }
  .hero-stats { gap: 1.5rem; }
  .stat-value { font-size: 1.25rem; }
  .hero-actions { flex-direction: column; align-items: center; }
}
</style>
