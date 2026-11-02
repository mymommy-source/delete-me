export const en = {
  nav: {
    home: 'Home',
  },
  collection: {
    title: 'The Sock Edit',
    subtitle: 'Soft, playful pairs I love and picked for you — little comforts for every day.',
    empty: 'Nothing here yet — new pieces are on their way.',
    newArrival: 'New Arrival',
    featuredBadge: 'Featured',
    soldOut: 'Sold out',
    inStock: 'Available',
    viewDetails: 'View details',
    order: 'Order via X DM',
    askAvailability: 'Ask via X DM',
  },
  product: {
    description: 'Description',
    availability: 'Availability',
    close: 'Close',
    image: 'Image',
    orderNote: 'Orders are confirmed personally in X (Twitter) DMs.',
    previous: 'Previous photo',
    next: 'Next photo',
  },
  terms: {
    statement: 'I confirm that I am over 18 years old.',
    accept: 'Yes, I am over 18',
    decline: 'No',
    declined: 'Sorry, this site is only available to visitors over 18.',
  },
};

type Widen<T> = { [K in keyof T]: T[K] extends string ? string : Widen<T[K]> };
export type Dictionary = Widen<typeof en>;
