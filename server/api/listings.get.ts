// Server API route for listings
// In production, this would connect to real scraping sources
// (Gumtree, Facebook Marketplace, Carsales, Pickles, Manheim)
// For now returns mock data that mirrors the composable structure

export default defineEventHandler(() => {
  return {
    meta: {
      total: 20,
      region: 'Perth Metro',
      sources: ['Gumtree', 'Facebook Marketplace', 'Carsales', 'Pickles Auctions', 'Manheim Auctions'],
      lastUpdated: new Date().toISOString(),
    },
    listings: [
      {
        id: '1',
        title: '2018 Toyota Camry Ascent - Low KMs, One Owner',
        make: 'Toyota', model: 'Camry', year: 2018,
        price: 16500, estimatedValue: 22000,
        mileage: 65000, suburb: 'Joondalup', region: 'North',
        source: 'Gumtree', sellerType: 'Private',
        bodyType: 'Sedan', condition: 'Excellent',
        flipScore: 92, profitEstimate: 4500,
      },
      {
        id: '2',
        title: '2016 Mazda CX-5 Maxx Sport - Needs New Tyres Only',
        make: 'Mazda', model: 'CX-5', year: 2016,
        price: 14000, estimatedValue: 20500,
        mileage: 98000, suburb: 'Rockingham', region: 'South',
        source: 'Facebook Marketplace', sellerType: 'Private',
        bodyType: 'SUV', condition: 'Good',
        flipScore: 88, profitEstimate: 5000,
      },
      {
        id: '4',
        title: '2015 Ford Ranger XLT 4x4 - Repo Auction',
        make: 'Ford', model: 'Ranger', year: 2015,
        price: 22000, estimatedValue: 31000,
        mileage: 130000, suburb: 'Welshpool', region: 'Central',
        source: 'Pickles Auctions', sellerType: 'Auction',
        bodyType: 'Ute', condition: 'Good',
        flipScore: 82, profitEstimate: 5700,
      },
      // ... remaining 17 listings available at full detail via client-side composable
    ],
  }
})
