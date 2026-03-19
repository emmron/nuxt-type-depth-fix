export interface Alert {
  id: string
  type: 'new_listing' | 'price_drop' | 'hot_deal' | 'saved_search'
  title: string
  message: string
  listingId: string | null
  read: boolean
  createdAt: string
}

export interface SavedSearch {
  id: string
  name: string
  filters: {
    make?: string
    bodyType?: string
    maxPrice?: number
    minFlipScore?: number
    source?: string
  }
  notifyEnabled: boolean
  createdAt: string
  lastTriggered: string | null
  matchCount: number
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'hot_deal',
    title: 'Hot Deal Alert!',
    message: '2018 Toyota Camry listed in Joondalup for $16,500 - estimated value $22,000. Flip score: 92/100',
    listingId: '1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'a2',
    type: 'new_listing',
    title: 'New Listing: Mazda CX-5',
    message: '2016 Mazda CX-5 Maxx Sport just listed in Rockingham for $14,000. Needs minor work - great flip opportunity.',
    listingId: '2',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'a3',
    type: 'saved_search',
    title: 'Saved Search Match: SUVs Under $20k',
    message: 'New match found: 2017 Kia Sportage SLi in Fremantle for $15,000. Moving overseas - urgent sale.',
    listingId: '5',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'a4',
    type: 'price_drop',
    title: 'Price Drop: VW Golf',
    message: '2016 Volkswagen Golf dropped from $11,000 to $8,500 in Malaga. Hail damaged but great margins.',
    listingId: '9',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'a5',
    type: 'hot_deal',
    title: 'Repo Auction Alert',
    message: '2015 Ford Ranger XLT 4x4 at Pickles Welshpool for $22,000. Market value $31,000+. Don\'t miss this!',
    listingId: '4',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
]

const MOCK_SAVED_SEARCHES: SavedSearch[] = [
  {
    id: 's1',
    name: 'SUVs Under $20k',
    filters: { bodyType: 'SUV', maxPrice: 20000, minFlipScore: 70 },
    notifyEnabled: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 7).toISOString(),
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    matchCount: 4,
  },
  {
    id: 's2',
    name: 'Toyota & Hilux Deals',
    filters: { make: 'Toyota', minFlipScore: 75 },
    notifyEnabled: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    lastTriggered: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    matchCount: 2,
  },
  {
    id: 's3',
    name: 'Auction Bargains',
    filters: { source: 'Pickles Auctions', maxPrice: 25000 },
    notifyEnabled: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    matchCount: 1,
  },
]

export const useAlerts = () => {
  const alerts = useState<Alert[]>('alerts', () => MOCK_ALERTS)
  const savedSearches = useState<SavedSearch[]>('saved-searches', () => MOCK_SAVED_SEARCHES)

  const markAsRead = (id: string) => {
    const alert = alerts.value.find(a => a.id === id)
    if (alert) alert.read = true
  }

  const markAllRead = () => {
    alerts.value.forEach(a => a.read = true)
  }

  const deleteAlert = (id: string) => {
    alerts.value = alerts.value.filter(a => a.id !== id)
  }

  const toggleSearchNotify = (id: string) => {
    const search = savedSearches.value.find(s => s.id === id)
    if (search) search.notifyEnabled = !search.notifyEnabled
  }

  const deleteSavedSearch = (id: string) => {
    savedSearches.value = savedSearches.value.filter(s => s.id !== id)
  }

  const addSavedSearch = (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastTriggered' | 'matchCount'>) => {
    savedSearches.value.push({
      ...search,
      id: 's' + Date.now(),
      createdAt: new Date().toISOString(),
      lastTriggered: null,
      matchCount: 0,
    })
  }

  return {
    alerts,
    savedSearches,
    markAsRead,
    markAllRead,
    deleteAlert,
    toggleSearchNotify,
    deleteSavedSearch,
    addSavedSearch,
  }
}
