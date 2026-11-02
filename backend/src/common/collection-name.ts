/**
 * Prefixes every collection so the site can share a database with other apps
 * without mixing data (e.g. `socks_products`). Set MONGO_COLLECTION_PREFIX to change it.
 */
export const collectionName = (name: string): string =>
  `${process.env.MONGO_COLLECTION_PREFIX ?? 'socks_'}${name}`;
