export interface FlipScoreBreakdown {
  priceGap: number       // 0-100: how far below market value (weight: 40%)
  demand: number         // 0-100: brand/model demand in Perth (weight: 15%)
  mileageForAge: number  // 0-100: low km relative to year (weight: 15%)
  sourceReliability: number // 0-100: how trustworthy the source is (weight: 15%)
  daysOnMarket: number   // 0-100: freshness, newer = higher (weight: 15%)
}

export type Condition = 'Excellent' | 'Good' | 'Fair' | 'Needs Work' | 'Damaged'
export type ServiceHistory = 'Full' | 'Partial' | 'Unknown'
export type SellerType = 'Private' | 'Dealer' | 'Auction' | 'Fleet'
export type Region = 'North' | 'South' | 'East' | 'Central'

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
  region: Region
  source: string
  sellerType: SellerType
  listedAt: string
  bodyType: string
  transmission: string
  fuelType: string
  colour: string
  condition: Condition
  conditionNotes: string
  serviceHistory: ServiceHistory
  previousOwners: number
  regoExpiry: string
  auctionFeePercent: number | null
  flipScore: number
  flipScoreBreakdown: FlipScoreBreakdown
  profitEstimate: number
  daysListed: number
  url: string
}

export const SUBURB_REGIONS: Record<Region, string[]> = {
  North: ['Joondalup', 'Wanneroo', 'Scarborough', 'Stirling', 'Balcatta', 'Clarkson'],
  South: ['Rockingham', 'Mandurah', 'Fremantle', 'Cockburn', 'Canning Vale', 'Bibra Lake'],
  East: ['Midland', 'Armadale', 'Kalamunda', 'Ellenbrook', 'Mundijong', 'Forrestfield'],
  Central: ['Cannington', 'Osborne Park', 'Victoria Park', 'Welshpool', 'Malaga', 'Morley', 'Perth CBD'],
}

function hoursAgo(h: number) {
  return new Date(Date.now() - 1000 * 60 * 60 * h).toISOString()
}
function daysAgo(d: number) {
  return new Date(Date.now() - 1000 * 60 * 60 * 24 * d).toISOString()
}

const MOCK_LISTINGS: CarListing[] = [
  // === GREAT DEALS (flip score 75+) ===
  {
    id: '1',
    title: '2018 Toyota Camry Ascent - Low KMs, One Owner',
    make: 'Toyota', model: 'Camry', year: 2018,
    price: 16500, estimatedValue: 22000, mileage: 65000,
    location: 'Perth', suburb: 'Joondalup', region: 'North',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: hoursAgo(0.5),
    bodyType: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol', colour: 'White',
    condition: 'Excellent', conditionNotes: 'Garaged its whole life. No marks, no issues. Selling because upgrading to SUV.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-11-15', auctionFeePercent: null,
    flipScore: 92,
    flipScoreBreakdown: { priceGap: 95, demand: 90, mileageForAge: 88, sourceReliability: 80, daysOnMarket: 100 },
    profitEstimate: 4500, daysListed: 0, url: '#',
  },
  {
    id: '2',
    title: '2016 Mazda CX-5 Maxx Sport - Needs New Tyres Only',
    make: 'Mazda', model: 'CX-5', year: 2016,
    price: 14000, estimatedValue: 20500, mileage: 98000,
    location: 'Perth', suburb: 'Rockingham', region: 'South',
    source: 'Facebook Marketplace', sellerType: 'Private',
    listedAt: hoursAgo(2),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Grey',
    condition: 'Good', conditionNotes: 'Runs perfectly. Needs 4 new tyres (~$600). Small scratch on rear bumper. Moving interstate, need gone this week.',
    serviceHistory: 'Full', previousOwners: 2, regoExpiry: '2026-08-20', auctionFeePercent: null,
    flipScore: 88,
    flipScoreBreakdown: { priceGap: 92, demand: 88, mileageForAge: 75, sourceReliability: 70, daysOnMarket: 95 },
    profitEstimate: 5000, daysListed: 0, url: '#',
  },
  {
    id: '3',
    title: '2019 Hyundai i30 Active - Deceased Estate, Immaculate',
    make: 'Hyundai', model: 'i30', year: 2019,
    price: 13500, estimatedValue: 18000, mileage: 42000,
    location: 'Perth', suburb: 'Morley', region: 'Central',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: hoursAgo(4),
    bodyType: 'Hatchback', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Silver',
    condition: 'Excellent', conditionNotes: 'Deceased estate. Barely driven, always garaged. Full books, both keys. Family wants quick sale.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-06-01', auctionFeePercent: null,
    flipScore: 85,
    flipScoreBreakdown: { priceGap: 85, demand: 82, mileageForAge: 92, sourceReliability: 80, daysOnMarket: 90 },
    profitEstimate: 3500, daysListed: 0, url: '#',
  },
  {
    id: '4',
    title: '2015 Ford Ranger XLT 4x4 - Repo Auction This Saturday',
    make: 'Ford', model: 'Ranger', year: 2015,
    price: 22000, estimatedValue: 31000, mileage: 130000,
    location: 'Perth', suburb: 'Welshpool', region: 'Central',
    source: 'Pickles Auctions', sellerType: 'Auction',
    listedAt: hoursAgo(6),
    bodyType: 'Ute', transmission: 'Automatic', fuelType: 'Diesel', colour: 'Black',
    condition: 'Good', conditionNotes: 'Repo vehicle. Starts and drives. Some stone chips on bonnet. Bullbar fitted. Tray liner. Inspection available Thursday.',
    serviceHistory: 'Partial', previousOwners: 2, regoExpiry: '2026-04-10', auctionFeePercent: 15,
    flipScore: 82,
    flipScoreBreakdown: { priceGap: 88, demand: 95, mileageForAge: 65, sourceReliability: 75, daysOnMarket: 85 },
    profitEstimate: 5700, daysListed: 1, url: '#',
  },
  {
    id: '5',
    title: '2017 Kia Sportage SLi - Urgent, Moving Overseas Friday',
    make: 'Kia', model: 'Sportage', year: 2017,
    price: 15000, estimatedValue: 21000, mileage: 78000,
    location: 'Perth', suburb: 'Fremantle', region: 'South',
    source: 'Facebook Marketplace', sellerType: 'Private',
    listedAt: hoursAgo(8),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Red',
    condition: 'Good', conditionNotes: 'Relocating to UK. Must sell by Friday. Panoramic sunroof, leather seats. Minor door ding on driver side.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2027-01-20', auctionFeePercent: null,
    flipScore: 80,
    flipScoreBreakdown: { priceGap: 82, demand: 78, mileageForAge: 80, sourceReliability: 70, daysOnMarket: 88 },
    profitEstimate: 4500, daysListed: 1, url: '#',
  },
  {
    id: '6',
    title: '2014 Toyota Hilux SR5 - Farm Use, Solid as a Rock',
    make: 'Toyota', model: 'Hilux', year: 2014,
    price: 25000, estimatedValue: 34000, mileage: 160000,
    location: 'Perth', suburb: 'Midland', region: 'East',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: hoursAgo(18),
    bodyType: 'Ute', transmission: 'Automatic', fuelType: 'Diesel', colour: 'White',
    condition: 'Fair', conditionNotes: 'Farm use but always serviced at Toyota. Scratches and dents on tray. Mechanically perfect. Timing belt done at 150k.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-09-30', auctionFeePercent: null,
    flipScore: 78,
    flipScoreBreakdown: { priceGap: 80, demand: 98, mileageForAge: 55, sourceReliability: 80, daysOnMarket: 75 },
    profitEstimate: 7000, daysListed: 1, url: '#',
  },

  // === MEDIOCRE DEALS (flip score 50-74) ===
  {
    id: '7',
    title: '2020 Mitsubishi ASX ES - Ex-Rental, High KMs for Age',
    make: 'Mitsubishi', model: 'ASX', year: 2020,
    price: 17500, estimatedValue: 21000, mileage: 95000,
    location: 'Perth', suburb: 'Cannington', region: 'Central',
    source: 'Carsales', sellerType: 'Dealer',
    listedAt: daysAgo(1),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Blue',
    condition: 'Good', conditionNotes: 'Ex-rental fleet. Higher kms than usual for a 2020. Some interior wear on driver seat. Dealer warranty 1 month.',
    serviceHistory: 'Full', previousOwners: 3, regoExpiry: '2026-07-15', auctionFeePercent: null,
    flipScore: 62,
    flipScoreBreakdown: { priceGap: 50, demand: 65, mileageForAge: 40, sourceReliability: 85, daysOnMarket: 70 },
    profitEstimate: 2000, daysListed: 1, url: '#',
  },
  {
    id: '8',
    title: '2021 MG ZS Excite - Repo, Low KMs but Slow Resale',
    make: 'MG', model: 'ZS', year: 2021,
    price: 12000, estimatedValue: 15500, mileage: 18000,
    location: 'Perth', suburb: 'Osborne Park', region: 'Central',
    source: 'Manheim Auctions', sellerType: 'Auction',
    listedAt: daysAgo(1),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'White',
    condition: 'Good', conditionNotes: 'Repo. Looks new inside and out. Problem: MG resale is weak in Perth. Expect 3-4 weeks to move.',
    serviceHistory: 'Unknown', previousOwners: 1, regoExpiry: '2026-05-20', auctionFeePercent: 12,
    flipScore: 58,
    flipScoreBreakdown: { priceGap: 55, demand: 30, mileageForAge: 95, sourceReliability: 75, daysOnMarket: 70 },
    profitEstimate: 2060, daysListed: 1, url: '#',
  },
  {
    id: '9',
    title: '2018 Subaru Forester 2.5i-L - Divorce Sale, Fair Price',
    make: 'Subaru', model: 'Forester', year: 2018,
    price: 20000, estimatedValue: 24500, mileage: 85000,
    location: 'Perth', suburb: 'Armadale', region: 'East',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: daysAgo(2),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Green',
    condition: 'Good', conditionNotes: 'Divorce sale but not desperate. Priced close to market. Might negotiate $500-1k off. AWD, roof racks.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-12-01', auctionFeePercent: null,
    flipScore: 55,
    flipScoreBreakdown: { priceGap: 45, demand: 70, mileageForAge: 72, sourceReliability: 80, daysOnMarket: 55 },
    profitEstimate: 3000, daysListed: 2, url: '#',
  },
  {
    id: '10',
    title: '2017 Honda Civic VTi-S - Tidy but Thin Margin',
    make: 'Honda', model: 'Civic', year: 2017,
    price: 16000, estimatedValue: 19000, mileage: 72000,
    location: 'Perth', suburb: 'Victoria Park', region: 'Central',
    source: 'Carsales', sellerType: 'Dealer',
    listedAt: daysAgo(3),
    bodyType: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Black',
    condition: 'Excellent', conditionNotes: 'Immaculate condition. Problem is dealer is already asking near market. Not much meat on the bone unless they drop.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2027-02-28', auctionFeePercent: null,
    flipScore: 52,
    flipScoreBreakdown: { priceGap: 35, demand: 72, mileageForAge: 78, sourceReliability: 85, daysOnMarket: 45 },
    profitEstimate: 1500, daysListed: 3, url: '#',
  },
  {
    id: '11',
    title: '2019 Nissan X-Trail ST - Sat for 2 Weeks, No Bites',
    make: 'Nissan', model: 'X-Trail', year: 2019,
    price: 19500, estimatedValue: 23000, mileage: 60000,
    location: 'Perth', suburb: 'Wanneroo', region: 'North',
    source: 'Facebook Marketplace', sellerType: 'Private',
    listedAt: daysAgo(14),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Grey',
    condition: 'Good', conditionNotes: 'Listed 2 weeks, seller might be flexible now. Originally asking $22k, already dropped once. CVT gearbox - some buyers avoid these.',
    serviceHistory: 'Partial', previousOwners: 2, regoExpiry: '2026-10-10', auctionFeePercent: null,
    flipScore: 65,
    flipScoreBreakdown: { priceGap: 48, demand: 55, mileageForAge: 82, sourceReliability: 70, daysOnMarket: 95 },
    profitEstimate: 2000, daysListed: 14, url: '#',
  },
  {
    id: '12',
    title: '2015 Mazda 3 SP25 - Clean but Overpriced for Year',
    make: 'Mazda', model: '3', year: 2015,
    price: 14500, estimatedValue: 15500, mileage: 110000,
    location: 'Perth', suburb: 'Clarkson', region: 'North',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: daysAgo(5),
    bodyType: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Red',
    condition: 'Good', conditionNotes: 'Clean car but seller thinks its worth more than it is. 110k kms is average for 2015. Margin too thin unless you get it for $12k.',
    serviceHistory: 'Full', previousOwners: 2, regoExpiry: '2026-08-15', auctionFeePercent: null,
    flipScore: 50,
    flipScoreBreakdown: { priceGap: 20, demand: 75, mileageForAge: 60, sourceReliability: 80, daysOnMarket: 60 },
    profitEstimate: 500, daysListed: 5, url: '#',
  },

  // === BAD DEALS (flip score below 50) ===
  {
    id: '13',
    title: '2013 Holden Commodore VF SV6 - "Bargain" at $15k',
    make: 'Holden', model: 'Commodore', year: 2013,
    price: 15000, estimatedValue: 14000, mileage: 185000,
    location: 'Perth', suburb: 'Balcatta', region: 'North',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: daysAgo(8),
    bodyType: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Black',
    condition: 'Fair', conditionNotes: 'Overpriced. Commodores are dropping in value. 185k kms, timing chain rattle reported by some VF owners. Avoid.',
    serviceHistory: 'Partial', previousOwners: 4, regoExpiry: '2026-04-30', auctionFeePercent: null,
    flipScore: 18,
    flipScoreBreakdown: { priceGap: 0, demand: 25, mileageForAge: 30, sourceReliability: 80, daysOnMarket: 40 },
    profitEstimate: -1500, daysListed: 8, url: '#',
  },
  {
    id: '14',
    title: '2020 Suzuki Baleno GLX - Dealer Asking Full Market',
    make: 'Suzuki', model: 'Baleno', year: 2020,
    price: 18500, estimatedValue: 18000, mileage: 35000,
    location: 'Perth', suburb: 'Canning Vale', region: 'South',
    source: 'Carsales', sellerType: 'Dealer',
    listedAt: daysAgo(12),
    bodyType: 'Hatchback', transmission: 'Automatic', fuelType: 'Petrol', colour: 'White',
    condition: 'Excellent', conditionNotes: 'Nice car but dealer wants full market value plus their margin. Zero flip potential. Would lose money.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2027-03-15', auctionFeePercent: null,
    flipScore: 12,
    flipScoreBreakdown: { priceGap: 0, demand: 30, mileageForAge: 85, sourceReliability: 85, daysOnMarket: 20 },
    profitEstimate: -1000, daysListed: 12, url: '#',
  },
  {
    id: '15',
    title: '2012 BMW 320i F30 - Cheap but Money Pit Incoming',
    make: 'BMW', model: '320i', year: 2012,
    price: 9500, estimatedValue: 12000, mileage: 165000,
    location: 'Perth', suburb: 'Stirling', region: 'North',
    source: 'Facebook Marketplace', sellerType: 'Private',
    listedAt: daysAgo(4),
    bodyType: 'Sedan', transmission: 'Automatic', fuelType: 'Petrol', colour: 'White',
    condition: 'Fair', conditionNotes: 'Looks cheap but N20 engine has timing chain issues at this mileage. Could need $3-5k in engine work. Oil leak visible in photos. High risk.',
    serviceHistory: 'Unknown', previousOwners: 4, regoExpiry: '2026-06-20', auctionFeePercent: null,
    flipScore: 28,
    flipScoreBreakdown: { priceGap: 40, demand: 35, mileageForAge: 20, sourceReliability: 70, daysOnMarket: 65 },
    profitEstimate: -500, daysListed: 4, url: '#',
  },
  {
    id: '16',
    title: '2014 Jeep Cherokee Limited - Transmission Concerns',
    make: 'Jeep', model: 'Cherokee', year: 2014,
    price: 11000, estimatedValue: 14000, mileage: 140000,
    location: 'Perth', suburb: 'Ellenbrook', region: 'East',
    source: 'Gumtree', sellerType: 'Private',
    listedAt: daysAgo(6),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Silver',
    condition: 'Fair', conditionNotes: 'ZF 9-speed auto is known for issues. Seller says "drives fine" but no recent service. High risk for a flip - if gearbox goes, $4-6k repair.',
    serviceHistory: 'Unknown', previousOwners: 3, regoExpiry: '2026-05-01', auctionFeePercent: null,
    flipScore: 35,
    flipScoreBreakdown: { priceGap: 42, demand: 20, mileageForAge: 35, sourceReliability: 80, daysOnMarket: 55 },
    profitEstimate: 1000, daysListed: 6, url: '#',
  },

  // === NEEDS INVESTIGATION ===
  {
    id: '17',
    title: '2016 Volkswagen Golf 110TSI - Hail Damaged, Drives Fine',
    make: 'Volkswagen', model: 'Golf', year: 2016,
    price: 8500, estimatedValue: 16000, mileage: 72000,
    location: 'Perth', suburb: 'Malaga', region: 'Central',
    source: 'Facebook Marketplace', sellerType: 'Private',
    listedAt: daysAgo(1.5),
    bodyType: 'Hatchback', transmission: 'Automatic', fuelType: 'Petrol', colour: 'Grey',
    condition: 'Damaged', conditionNotes: 'Hail damage to roof, bonnet, and boot. Mechanically perfect. PPSR shows no write-off. PDR quote $2,500-3,500 to fix. Could be a great flip if repair costs stay under $3k.',
    serviceHistory: 'Full', previousOwners: 2, regoExpiry: '2026-09-01', auctionFeePercent: null,
    flipScore: 70,
    flipScoreBreakdown: { priceGap: 90, demand: 72, mileageForAge: 78, sourceReliability: 70, daysOnMarket: 80 },
    profitEstimate: 4000, daysListed: 2, url: '#',
  },
  {
    id: '18',
    title: '2017 Isuzu D-Max LS-U - Auction, Unknown History',
    make: 'Isuzu', model: 'D-Max', year: 2017,
    price: 19000, estimatedValue: 28000, mileage: 145000,
    location: 'Perth', suburb: 'Welshpool', region: 'Central',
    source: 'Pickles Auctions', sellerType: 'Auction',
    listedAt: hoursAgo(12),
    bodyType: 'Ute', transmission: 'Automatic', fuelType: 'Diesel', colour: 'White',
    condition: 'Fair', conditionNotes: 'Auction - no test drive available. Starts and idles fine. Canopy fitted. Some rust on tray. No service books with vehicle. Big margin IF mechanically sound.',
    serviceHistory: 'Unknown', previousOwners: 0, regoExpiry: '2026-04-15', auctionFeePercent: 15,
    flipScore: 72,
    flipScoreBreakdown: { priceGap: 88, demand: 90, mileageForAge: 50, sourceReliability: 60, daysOnMarket: 80 },
    profitEstimate: 5350, daysListed: 1, url: '#',
  },
  {
    id: '19',
    title: '2019 Toyota RAV4 GX - Repairable Write-Off',
    make: 'Toyota', model: 'RAV4', year: 2019,
    price: 16000, estimatedValue: 30000, mileage: 55000,
    location: 'Perth', suburb: 'Bibra Lake', region: 'South',
    source: 'Manheim Auctions', sellerType: 'Auction',
    listedAt: daysAgo(1),
    bodyType: 'SUV', transmission: 'Automatic', fuelType: 'Hybrid', colour: 'White',
    condition: 'Damaged', conditionNotes: 'WOVR repairable write-off. Front-end damage - needs bumper, headlight, radiator support. Airbags NOT deployed. Could repair for $4-6k. Re-registration inspection required. High reward but high effort.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-03-01', auctionFeePercent: 12,
    flipScore: 68,
    flipScoreBreakdown: { priceGap: 95, demand: 95, mileageForAge: 85, sourceReliability: 75, daysOnMarket: 75 },
    profitEstimate: 7080, daysListed: 1, url: '#',
  },
  {
    id: '20',
    title: '2016 Mitsubishi Triton GLX+ - Fleet Clearance, 3 Available',
    make: 'Mitsubishi', model: 'Triton', year: 2016,
    price: 16500, estimatedValue: 22000, mileage: 180000,
    location: 'Perth', suburb: 'Forrestfield', region: 'East',
    source: 'Carsales', sellerType: 'Fleet',
    listedAt: daysAgo(2),
    bodyType: 'Ute', transmission: 'Automatic', fuelType: 'Diesel', colour: 'White',
    condition: 'Fair', conditionNotes: 'Ex-mining fleet. High kms but serviced on schedule. All have tow bars and canopies. Minor dents. 3 identical available - buy one or all.',
    serviceHistory: 'Full', previousOwners: 1, regoExpiry: '2026-07-01', auctionFeePercent: null,
    flipScore: 66,
    flipScoreBreakdown: { priceGap: 62, demand: 82, mileageForAge: 35, sourceReliability: 85, daysOnMarket: 60 },
    profitEstimate: 3500, daysListed: 2, url: '#',
  },
]

export interface ListingFilters {
  search: string
  minPrice: number | null
  maxPrice: number | null
  make: string
  bodyType: string
  source: string
  region: string
  suburb: string
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
    region: '',
    suburb: '',
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
    if (filters.value.region) {
      result = result.filter(l => l.region === filters.value.region)
    }
    if (filters.value.suburb) {
      result = result.filter(l => l.suburb === filters.value.suburb)
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
  const suburbs = computed(() => {
    const region = filters.value.region
    if (region) {
      return SUBURB_REGIONS[region as Region] || []
    }
    return [...new Set(listings.value.map(l => l.suburb))].sort()
  })

  const getListingById = (id: string) => listings.value.find(l => l.id === id) || null

  const getSimilarListings = (listing: CarListing, limit = 3) => {
    return listings.value
      .filter(l => l.id !== listing.id && (l.bodyType === listing.bodyType || l.make === listing.make))
      .sort((a, b) => b.flipScore - a.flipScore)
      .slice(0, limit)
  }

  return {
    listings,
    filters,
    filteredListings,
    makes,
    bodyTypes,
    sources,
    suburbs,
    getListingById,
    getSimilarListings,
  }
}
