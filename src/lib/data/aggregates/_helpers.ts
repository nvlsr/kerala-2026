/** Get an entry from a map, creating it via `factory` if absent. */
export function ensureMapEntry<K, V>(
  map: Map<K, V>,
  key: K,
  factory: () => V
): V {
  let entry = map.get(key)
  if (!entry) {
    entry = factory()
    map.set(key, entry)
  }
  return entry
}
