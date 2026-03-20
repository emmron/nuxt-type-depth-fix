import type { CarListing } from './useListings'

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
    region?: string
  }
  notifyEnabled: boolean
  createdAt: string
  lastTriggered: string | null
}

export interface NotificationPrefs {
  hotDeals: boolean
  priceDrops: boolean
  newListings: boolean
  auctions: boolean
}

const MOCK_ALERTS: Alert[] = [
  {
    id: 'a1',
    type: 'hot_deal',
    title: 'Hot Deal: Toyota Camry $16,500',
    message: '2018 Toyota Camry in Joondalup. One owner, 65k km, full service history. Market value $22k. Flip score 92.',
    listingId: '1',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 'a2',
    type: 'new_listing',
    title: 'New: Mazda CX-5 in Rockingham',
    message: 'Just listed: 2016 CX-5 Maxx Sport for $14,000. Needs tyres only. Seller moving interstate, wants it gone this week.',
    listingId: '2',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
  },
  {
    id: 'a3',
    type: 'saved_search',
    title: 'Match: SUVs Under $20k',
    message: 'Kia Sportage SLi in Fremantle for $15,000. Owner moving overseas Friday - urgent sale. Flip score 80.',
    listingId: '5',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
  },
  {
    id: 'a4',
    type: 'price_drop',
    title: 'Price Drop: VW Golf now $8,500',
    message: 'Hail damaged Golf in Malaga dropped from $11k to $8.5k. PDR repair ~$3k. Could net $4k profit if repair goes well.',
    listingId: '17',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
  },
  {
    id: 'a5',
    type: 'hot_deal',
    title: 'Auction: Ford Ranger $22k',
    message: 'Repo Ranger XLT 4x4 at Pickles Welshpool this Saturday. Market value $31k. Factor in 15% buyer premium. Inspection Thursday.',
    listingId: '4',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
  {
    id: 'a6',
    type: 'new_listing',
    title: 'New: RAV4 Write-Off $16k',
    message: 'Repairable write-off RAV4 Hybrid at Manheim. Front-end damage, airbags OK. Repair ~$5k. Market value $30k if fixed. High effort, high reward.',
    listingId: '19',
    read: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
  },
  {
    id: 'a7',
    type: 'saved_search',
    title: 'Match: Ute Deals',
    message: 'Isuzu D-Max LS-U at Pickles for $19k. Unknown history but market value $28k. Inspection required.',
    listingId: '18',
    read: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
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
  },
  {
    id: 's2',
    name: 'Toyota & Hilux Deals',
    filters: { make: 'Toyota', minFlipScore: 75 },
    notifyEnabled: true,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 14).toISOString(),
    lastTriggered: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
  },
  {
    id: 's3',
    name: 'Auction Bargains',
    filters: { source: 'Pickles Auctions', maxPrice: 25000 },
    notifyEnabled: false,
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 3).toISOString(),
    lastTriggered: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
  },
]

export const useAlerts = () => {
  const alerts = useState<Alert[]>('alerts', () => MOCK_ALERTS)
  const savedSearches = useState<SavedSearch[]>('saved-searches', () => MOCK_SAVED_SEARCHES)
  const notificationPrefs = useState<NotificationPrefs>('notification-prefs', () => ({
    hotDeals: true,
    priceDrops: true,
    newListings: true,
    auctions: false,
  }))

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

  const addSavedSearch = (search: Omit<SavedSearch, 'id' | 'createdAt' | 'lastTriggered'>) => {
    savedSearches.value.push({
      ...search,
      id: 's' + Date.now(),
      createdAt: new Date().toISOString(),
      lastTriggered: null,
    })
  }

  // Actually match listings against a saved search's filters
  const getMatchingListings = (searchId: string): CarListing[] => {
    const search = savedSearches.value.find(s => s.id === searchId)
    if (!search) return []

    const { listings } = useListings()
    return listings.value.filter(l => {
      if (search.filters.make && l.make !== search.filters.make) return false
      if (search.filters.bodyType && l.bodyType !== search.filters.bodyType) return false
      if (search.filters.maxPrice && l.price > search.filters.maxPrice) return false
      if (search.filters.minFlipScore && l.flipScore < search.filters.minFlipScore) return false
      if (search.filters.source && l.source !== search.filters.source) return false
      if (search.filters.region && l.region !== search.filters.region) return false
      return true
    })
  }

  const getMatchCount = (searchId: string) => getMatchingListings(searchId).length

  return {
    alerts,
    savedSearches,
    notificationPrefs,
    markAsRead,
    markAllRead,
    deleteAlert,
    toggleSearchNotify,
    deleteSavedSearch,
    addSavedSearch,
    getMatchingListings,
    getMatchCount,
  }
}
