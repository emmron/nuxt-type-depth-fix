export default defineEventHandler(() => {
  // Mock alerts - replace with real notification system
  return [
    {
      id: 'a1',
      type: 'hot_deal',
      title: 'Hot Deal Alert!',
      message: '2018 Toyota Camry listed in Joondalup for $16,500 - estimated value $22,000. Flip score: 92/100',
      listingId: '1',
      read: false,
    },
    {
      id: 'a2',
      type: 'new_listing',
      title: 'New Listing: Mazda CX-5',
      message: '2016 Mazda CX-5 Maxx Sport just listed in Rockingham for $14,000.',
      listingId: '2',
      read: false,
    },
  ]
})
