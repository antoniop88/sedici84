/**
 * Registered collection keys — single source of truth for the union type.
 *
 * Lives in its own dependency-free module so files that must NOT import the full registry can
 * still reference the union without a circular import. In particular config/site.ts needs it to
 * type nav items, but config/collections.ts (the registry) imports `site`, which would otherwise
 * create a cycle.
 *
 * Adding a collection: add its key here AND register it in ../collections.ts. The registry is
 * checked against this union at compile time (see `_registryIsComplete` in collections.ts), so a
 * key declared here without a matching registry entry is a type error.
 */
export type CollectionKey = 'immobili'
