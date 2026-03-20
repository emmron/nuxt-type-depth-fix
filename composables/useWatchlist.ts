export const useWatchlist = () => {
  const watchlistIds = useState<string[]>('watchlist', () => [])

  const toggleWatchlist = (id: string) => {
    const idx = watchlistIds.value.indexOf(id)
    if (idx >= 0) {
      watchlistIds.value = watchlistIds.value.filter(i => i !== id)
    } else {
      watchlistIds.value = [...watchlistIds.value, id]
    }
  }

  const isWatched = (id: string) => watchlistIds.value.includes(id)

  const watchedListings = computed(() => {
    const { listings } = useListings()
    return listings.value.filter(l => watchlistIds.value.includes(l.id))
  })

  const watchlistCount = computed(() => watchlistIds.value.length)

  return {
    watchlistIds,
    toggleWatchlist,
    isWatched,
    watchedListings,
    watchlistCount,
  }
}
