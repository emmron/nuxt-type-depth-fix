<template>
  <div class="watchlist-page">
    <div class="page-header">
      <h1>Watchlist</h1>
      <p class="page-desc">{{ watchedListings.length }} car{{ watchedListings.length !== 1 ? 's' : '' }} saved</p>
    </div>

    <div v-if="watchedListings.length" class="listings-grid">
      <div v-for="listing in watchedListings" :key="listing.id" class="listing-card">
        <NuxtLink :to="'/listings/' + listing.id" class="card-link">
          <div class="card-top">
            <div class="card-placeholder">
              <span>{{ listing.make[0] }}{{ listing.model[0] }}</span>
            </div>
            <div class="card-badges">
              <span class="badge" :class="scoreClass(listing.flipScore)">{{ listing.flipScore }}</span>
            </div>
          </div>
          <div class="card-body">
            <div class="card-source-time">
              <span class="source-tag">{{ listing.source }}</span>
              <span class="time-tag">{{ timeAgo(listing.listedAt) }}</span>
            </div>
            <h3 class="card-title">{{ listing.title }}</h3>
            <div class="card-meta">
              {{ listing.suburb }} &bull; {{ listing.mileage.toLocaleString() }} km &bull; {{ listing.condition }}
            </div>
            <div class="card-pricing">
              <span class="price-asking">${{ listing.price.toLocaleString() }}</span>
              <span class="profit-est" :class="{ negative: listing.profitEstimate < 0 }">
                {{ listing.profitEstimate >= 0 ? '+' : '' }}${{ listing.profitEstimate.toLocaleString() }} est.
              </span>
            </div>
          </div>
        </NuxtLink>
        <button class="remove-btn" aria-label="Remove from watchlist" @click="toggleWatchlist(listing.id)">Remove</button>
      </div>
    </div>

    <div v-else class="empty-state">
      <div class="empty-icon">&#9734;</div>
      <h3>Your watchlist is empty</h3>
      <p>Save cars you're interested in while browsing listings. Click the star on any listing card to add it here.</p>
      <NuxtLink to="/listings" class="btn-browse">Browse Listings</NuxtLink>
    </div>
  </div>
</template>

<script setup>
const { watchedListings, toggleWatchlist } = useWatchlist()

function scoreClass(score) {
  if (score >= 75) return 'score-hot'
  if (score >= 50) return 'score-good'
  return 'score-bad'
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
.page-header { margin-bottom: 1.5rem; }
.page-header h1 { font-size: 1.75rem; font-weight: 800; }
.page-desc { color: var(--text-secondary); font-size: 0.9rem; margin-top: 0.25rem; }

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
.listing-card:hover { border-color: var(--accent); }

.card-link { text-decoration: none; color: inherit; display: block; }

.card-top { position: relative; height: 100px; }
.card-placeholder {
  width: 100%; height: 100%;
  background: linear-gradient(135deg, #1a2332, #2a3a4a);
  display: flex; align-items: center; justify-content: center;
  font-size: 2rem; font-weight: 800; color: var(--text-muted);
}
.card-badges { position: absolute; top: 0.5rem; right: 0.5rem; }
.badge { padding: 3px 8px; border-radius: 6px; font-size: 0.7rem; font-weight: 700; }
.score-hot { background: var(--green); color: #0a0a0a; }
.score-good { background: var(--yellow); color: #0a0a0a; }
.score-bad { background: var(--red); color: #fff; }

.card-body { padding: 1rem; }
.card-source-time { display: flex; justify-content: space-between; margin-bottom: 0.35rem; }
.source-tag { font-size: 0.7rem; font-weight: 600; color: var(--accent); text-transform: uppercase; }
.time-tag { font-size: 0.7rem; color: var(--text-muted); }
.card-title { font-size: 0.9rem; font-weight: 600; line-height: 1.3; margin-bottom: 0.35rem; }
.card-meta { font-size: 0.75rem; color: var(--text-muted); margin-bottom: 0.5rem; }

.card-pricing {
  display: flex; justify-content: space-between; align-items: center;
  background: rgba(0,0,0,0.2); border-radius: 8px; padding: 0.5rem 0.75rem;
}
.price-asking { font-size: 1.1rem; font-weight: 800; }
.profit-est { font-size: 0.8rem; font-weight: 600; color: var(--green); }
.profit-est.negative { color: var(--red); }

.remove-btn {
  width: 100%;
  background: none;
  border: none;
  border-top: 1px solid var(--border);
  color: var(--text-muted);
  padding: 0.6rem;
  font-size: 0.75rem;
  font-weight: 500;
  cursor: pointer;
}
.remove-btn:hover { color: var(--red); background: rgba(248,113,113,0.05); }

.empty-state { text-align: center; padding: 4rem 1rem; }
.empty-icon { font-size: 3rem; color: var(--text-muted); margin-bottom: 1rem; }
.empty-state h3 { margin-bottom: 0.5rem; }
.empty-state p { color: var(--text-secondary); margin-bottom: 1.5rem; max-width: 400px; margin-left: auto; margin-right: auto; font-size: 0.9rem; line-height: 1.5; }
.btn-browse {
  display: inline-block;
  background: var(--accent); color: var(--bg-primary);
  padding: 0.65rem 1.5rem; border-radius: 10px;
  font-weight: 600; font-size: 0.9rem;
}
</style>
