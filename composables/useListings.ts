export interface CarListing {
  id: string
  title: string
  make: string
  model: string
  year: number
  price: number
  estimatedValue: number
  mileage: number
  location: string
  suburb: string
  source: string
  listedAt: string
  image: string
  bodyType: string
  transmission: string
  fuelType: string
  flipScore: number // 1-100 score of flip potential
  profitEstimate: number
  daysListed: number
  url: string
}

// Mock data simulating Perth car listings
const MOCK_LISTINGS: CarListing[] = [
  {
    id: '1',
    title: '2018 Toyota Camry Ascent - Low KMs, One Owner',
    make: 'Toyota',
    model: 'Camry',
    year: 2018,
    price: 16500,
    estimatedValue: 22000,
    mileage: 65000,
    location: 'Perth',
    suburb: 'Joondalup',
    source: 'Gumtree',
    listedAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    image: '',
    bodyType: 'Sedan',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 92,
    profitEstimate: 4500,
    daysListed: 0,
    url: '#',
  },
  {
    id: '2',
    title: '2016 Mazda CX-5 Maxx Sport - Needs Minor Work',
    make: 'Mazda',
    model: 'CX-5',
    year: 2016,
    price: 14000,
    estimatedValue: 20500,
    mileage: 98000,
    location: 'Perth',
    suburb: 'Rockingham',
    source: 'Facebook Marketplace',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    image: '',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 88,
    profitEstimate: 5000,
    daysListed: 0,
    url: '#',
  },
  {
    id: '3',
    title: '2019 Hyundai i30 Active - Deceased Estate Sale',
    make: 'Hyundai',
    model: 'i30',
    year: 2019,
    price: 13500,
    estimatedValue: 18000,
    mileage: 42000,
    location: 'Perth',
    suburb: 'Morley',
    source: 'Gumtree',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    image: '',
    bodyType: 'Hatchback',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 85,
    profitEstimate: 3500,
    daysListed: 0,
    url: '#',
  },
  {
    id: '4',
    title: '2015 Ford Ranger XLT 4x4 - Repo Auction',
    make: 'Ford',
    model: 'Ranger',
    year: 2015,
    price: 22000,
    estimatedValue: 31000,
    mileage: 130000,
    location: 'Perth',
    suburb: 'Welshpool',
    source: 'Pickles Auctions',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 6).toISOString(),
    image: '',
    bodyType: 'Ute',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    flipScore: 82,
    profitEstimate: 7000,
    daysListed: 1,
    url: '#',
  },
  {
    id: '5',
    title: '2017 Kia Sportage SLi - Urgent Sale, Moving OS',
    make: 'Kia',
    model: 'Sportage',
    year: 2017,
    price: 15000,
    estimatedValue: 21000,
    mileage: 78000,
    location: 'Perth',
    suburb: 'Fremantle',
    source: 'Facebook Marketplace',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 8).toISOString(),
    image: '',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 80,
    profitEstimate: 4500,
    daysListed: 1,
    url: '#',
  },
  {
    id: '6',
    title: '2020 Mitsubishi ASX ES - Ex-Rental Fleet',
    make: 'Mitsubishi',
    model: 'ASX',
    year: 2020,
    price: 17500,
    estimatedValue: 23000,
    mileage: 55000,
    location: 'Perth',
    suburb: 'Cannington',
    source: 'Carsales',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(),
    image: '',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 76,
    profitEstimate: 4000,
    daysListed: 1,
    url: '#',
  },
  {
    id: '7',
    title: '2014 Toyota Hilux SR5 - Farm Use, Solid',
    make: 'Toyota',
    model: 'Hilux',
    year: 2014,
    price: 25000,
    estimatedValue: 34000,
    mileage: 160000,
    location: 'Perth',
    suburb: 'Midland',
    source: 'Gumtree',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 18).toISOString(),
    image: '',
    bodyType: 'Ute',
    transmission: 'Automatic',
    fuelType: 'Diesel',
    flipScore: 78,
    profitEstimate: 7000,
    daysListed: 1,
    url: '#',
  },
  {
    id: '8',
    title: '2021 MG ZS Excite - Barely Driven, Repo',
    make: 'MG',
    model: 'ZS',
    year: 2021,
    price: 12000,
    estimatedValue: 17500,
    mileage: 18000,
    location: 'Perth',
    suburb: 'Osborne Park',
    source: 'Manheim Auctions',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    image: '',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 74,
    profitEstimate: 4000,
    daysListed: 1,
    url: '#',
  },
  {
    id: '9',
    title: '2016 Volkswagen Golf 110TSI - Hail Damaged',
    make: 'Volkswagen',
    model: 'Golf',
    year: 2016,
    price: 8500,
    estimatedValue: 16000,
    mileage: 72000,
    location: 'Perth',
    suburb: 'Malaga',
    source: 'Facebook Marketplace',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 36).toISOString(),
    image: '',
    bodyType: 'Hatchback',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 70,
    profitEstimate: 5000,
    daysListed: 2,
    url: '#',
  },
  {
    id: '10',
    title: '2018 Subaru Forester 2.5i-L - Divorce Sale',
    make: 'Subaru',
    model: 'Forester',
    year: 2018,
    price: 18000,
    estimatedValue: 24500,
    mileage: 85000,
    location: 'Perth',
    suburb: 'Armadale',
    source: 'Gumtree',
    listedAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    image: '',
    bodyType: 'SUV',
    transmission: 'Automatic',
    fuelType: 'Petrol',
    flipScore: 72,
    profitEstimate: 5000,
    daysListed: 2,
    url: '#',
  },
]

export interface ListingFilters {
  search: string
  minPrice: number | null
  maxPrice: number | null
  make: string
  bodyType: string
  source: string
  sortBy: 'newest' | 'price-low' | 'price-high' | 'flip-score' | 'profit'
  minFlipScore: number
}

export const useListings = () => {
  const listings = useState<CarListing[]>('listings', () => MOCK_LISTINGS)

  const filters = useState<ListingFilters>('listing-filters', () => ({
    search: '',
    minPrice: null,
    maxPrice: null,
    make: '',
    bodyType: '',
    source: '',
    sortBy: 'flip-score',
    minFlipScore: 0,
  }))

  const filteredListings = computed(() => {
    let result = [...listings.value]

    if (filters.value.search) {
      const q = filters.value.search.toLowerCase()
      result = result.filter(l =>
        l.title.toLowerCase().includes(q) ||
        l.make.toLowerCase().includes(q) ||
        l.model.toLowerCase().includes(q) ||
        l.suburb.toLowerCase().includes(q)
      )
    }

    if (filters.value.minPrice) {
      result = result.filter(l => l.price >= filters.value.minPrice!)
    }
    if (filters.value.maxPrice) {
      result = result.filter(l => l.price <= filters.value.maxPrice!)
    }
    if (filters.value.make) {
      result = result.filter(l => l.make === filters.value.make)
    }
    if (filters.value.bodyType) {
      result = result.filter(l => l.bodyType === filters.value.bodyType)
    }
    if (filters.value.source) {
      result = result.filter(l => l.source === filters.value.source)
    }
    if (filters.value.minFlipScore > 0) {
      result = result.filter(l => l.flipScore >= filters.value.minFlipScore)
    }

    switch (filters.value.sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.listedAt).getTime() - new Date(a.listedAt).getTime())
        break
      case 'price-low':
        result.sort((a, b) => a.price - b.price)
        break
      case 'price-high':
        result.sort((a, b) => b.price - a.price)
        break
      case 'flip-score':
        result.sort((a, b) => b.flipScore - a.flipScore)
        break
      case 'profit':
        result.sort((a, b) => b.profitEstimate - a.profitEstimate)
        break
    }

    return result
  })

  const makes = computed(() => [...new Set(listings.value.map(l => l.make))].sort())
  const bodyTypes = computed(() => [...new Set(listings.value.map(l => l.bodyType))].sort())
  const sources = computed(() => [...new Set(listings.value.map(l => l.source))].sort())

  return {
    listings,
    filters,
    filteredListings,
    makes,
    bodyTypes,
    sources,
  }
}
